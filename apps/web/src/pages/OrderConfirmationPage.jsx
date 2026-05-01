
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      fetchOrder();
    }
  }, [orderId, order]);

  const fetchOrder = async () => {
    try {
      const record = await pb.collection('orders').getOne(orderId, { $autoCancel: false });
      setOrder(record);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Order not found</h2>
            <Link to="/bookings">
              <Button>View your bookings</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmation - TravelExp</title>
        <meta name="description" content="Your booking has been confirmed" />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="mb-4">Booking confirmed</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your booking. A confirmation email has been sent to {order.shippingAddress?.fullName || 'your email'}.
            </p>
            <div className="bg-muted/50 rounded-xl p-4 inline-block">
              <p className="text-sm text-muted-foreground mb-1">Booking reference</p>
              <p className="text-2xl font-bold text-primary">{order.id}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-6">Booking details</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.selectedDate && `Date: ${new Date(item.selectedDate).toLocaleDateString()}`}
                    </p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between pt-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/bookings">
              <Button size="lg">View all bookings</Button>
            </Link>
            <Link to="/experiences">
              <Button size="lg" variant="outline">Browse more experiences</Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderConfirmationPage;
