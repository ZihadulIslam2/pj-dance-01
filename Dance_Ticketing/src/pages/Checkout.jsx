import { useState } from 'react'
import { Button } from '../components/button'
import PayPalButton from './PayPalButton'

const Checkout = ({ totalAmount }) => {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(totalAmount)
  const [showPayPal, setShowPayPal] = useState(false)
  const [showForm, setShowForm] = useState(true) // State to toggle form visibility

  const paypalHandler = () => {
    setShowForm(false) // Hide the form
    setShowPayPal(true) // Show PayPal button
  }

  const handleStripePayment = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        'http://localhost:3000/api/v1/payments/payment-stripe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'usd',
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Payment URL not found!')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0a192f]  w-full  ">
      <div className="w-full flex flex-col items-center  bg-[#112240] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#64ffda] text-center mb-6">
          Checkout
        </h2>
        {showForm ? (
          <form className="space-y-4 ">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#ccd6f6]"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 p-3 block w-full rounded-md border-[#64ffda]/50 bg-[#0a192f] text-[#64ffda] shadow-sm focus:ring-[#64ffda] focus:border-[#64ffda]"
                placeholder="your full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#ccd6f6]"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 p-3 block w-full rounded-md border-[#64ffda]/50 bg-[#0a192f] text-[#64ffda] shadow-sm focus:ring-[#64ffda] focus:border-[#64ffda]"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[#ccd6f6]"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 p-3 block w-full rounded-md border-[#64ffda]/50 bg-[#0a192f] text-[#64ffda] shadow-sm focus:ring-[#64ffda] focus:border-[#64ffda]"
                placeholder="123-456-7890"
                required
              />
            </div>
            
            <div className="flex flex-col space-y-4 mt-6">
              <Button
                onClick={paypalHandler}
                className="bg-gradient-to-r from-[#64ffda] to-[#31bdcf] text-[#0a192f] hover:shadow-lg hover:scale-105 transform transition-all duration-300 h-[50px] md:h-[60px] rounded-full px-6 text-base"
              >
                Pay With PayPal
              </Button>
              <Button
                variant="outline"
                onClick={handleStripePayment}
                disabled={loading}
                className="border-[#64ffda] text-[#64ffda] bg-[#0a192f] hover:bg-[#64ffda]/10 h-[50px] md:h-[60px] rounded-full px-6"
              >
                {loading ? 'Processing...' : 'Pay With Stripe'}
              </Button>
            </div>
          </form>
        ) : (
          showPayPal && <PayPalButton amount={amount} />
        )}
      </div>
    </div>
  )
}

export default Checkout
