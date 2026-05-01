
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, MessageCircle, ListChecks } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CartPage = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const WHATSAPP_NUMBER = '1234567890'; // Replace with actual number

  const handleBookAll = () => {
    const itemList = items.map(i => `- ${i.title} (x${i.quantity}) on ${i.selectedDate ? new Date(i.selectedDate).toLocaleDateString() : 'TBD'}`).join('\n');
    const message = `Hi! I'd like to book the following experiences:\n\n${itemList}\n\nTotal Estimated Price: $${getTotal().toFixed(2)}\n\nPlease let me know the next steps!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Selected Experiences - TravelExp</title>
          <meta name="description" content="Your selected experiences" />
        </Helmet>
        <Header />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ListChecks className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No activities selected</h2>
            <p className="text-muted-foreground mb-6">Select activities to book via WhatsApp</p>
            <Link to="/experiences">
              <Button size="lg">Browse experiences</Button>
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
        <title>Selected Experiences - TravelExp</title>
        <meta name="description" content="Review your selected experiences and book via WhatsApp" />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8">Selected Experiences</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedDate}`} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex gap-6">
                    <img
                      src={item.image ? pb.files.getUrl(item, item.image) : 'https://horizons-cdn.hostinger.com/a9e58fe0-cc2f-4d94-af7e-94a6ddb13aea/448c1e4d244199d34df30bc8317bbb68.png'}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.location}</p>
                      {item.selectedDate && (
                        <p className="text-sm text-muted-foreground mb-3">Date: {new Date(item.selectedDate).toLocaleDateString()}</p>
                      )}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedDate)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedDate)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-auto text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id, item.selectedDate)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.price} each</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-semibold mb-6">Booking summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Estimated Price</span>
                    <span className="font-semibold">${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                  size="lg"
                  onClick={handleBookAll}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book All via WhatsApp
                </Button>
                <Link to="/experiences">
                  <Button variant="ghost" className="w-full mt-3">
                    Add more experiences
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
