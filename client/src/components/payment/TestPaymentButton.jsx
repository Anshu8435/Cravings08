import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../config/ApiConfig';
import { loadRazorpayScript } from '../../utils/loadRazorpay';

const TestPaymentButton = ({ amount = 100 }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Load Razorpay script
      const res = await loadRazorpayScript();

      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // 2. Call backend to create order
      const orderResponse = await api.post('/payment/create-order', { amount });
      const { data, isMock } = orderResponse.data;

      if (isMock) {
        const verifyRes = await api.post('/payment/verify', {
          razorpay_order_id: data.orderId,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'mock_signature',
        });
        if (verifyRes.data.success) {
          toast.success('Test mock payment successful and verified!');
        }
        return;
      }

      // 3. Configure Checkout options
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Cravings Delivery',
        description: 'Test Transaction',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // 4. Verify payment on the server
            const verifyRes = await api.post('/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success('Payment successful and verified!');
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast.error('An error occurred during verification.');
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      // 5. Open Razorpay Checkout modal
      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', function (response) {
        toast.error('Payment failed. ' + response.error.description);
      });

      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast.error('Could not initiate payment. Check server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50"
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
};

export default TestPaymentButton;
