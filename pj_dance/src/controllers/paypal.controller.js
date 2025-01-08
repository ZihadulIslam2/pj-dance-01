const createPaypalClient = require('../config/paypalClient');
const paypal = require('@paypal/checkout-server-sdk');

const getOrderDetails = async (orderId) => {
  const client = createPaypalClient();
  const request = new paypal.orders.OrdersGetRequest(orderId);

  try {
    const order = await client.execute(request);
    return order.result;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw new Error('Unable to fetch order details');
  }
};

const createPayment = async (req, res) => {
  const client = createPaypalClient();

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: req.body.amount, // Ensure req.body.amount is valid and sanitized
        },
      },
    ],
  });

  try {
    const orders = await client.execute(request);
    res.json({
      id: orders.result.id,
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).send('Internal server error.');
  }
};

const capturePayment = async (req, res) => {
  const orderId = req.body.orderId;
  console.log('Received Order ID:', orderId);

  if (!orderId) {
    return res.status(400).json({
      error: 'Order ID is required.',
    });
  }

  try {
    const orderDetails = await getOrderDetails(orderId);
    console.log('Order Details:', orderDetails);

    if (orderDetails.status === 'COMPLETED') {
      return res.json({
        status: 'COMPLETED',
        message: 'This order has already been captured.',
        id: orderDetails.id,
      });
    }

    const client = createPaypalClient();
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client.execute(request);
    console.log('Capture Response:', capture.result);

    if (capture.result.status === 'COMPLETED') {
      return res.json({
        status: 'COMPLETED',
        id: capture.result.id,
      });
    } else {
      return res.status(400).json({
        error: 'Payment was not successfully captured.',
      });
    }
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(500).send('Internal server error.');
  }
};

module.exports = { createPayment, capturePayment };
