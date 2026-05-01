
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Star, Calendar, Minus, Plus, MessageCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const WHATSAPP_NUMBER = '1234567890'; // Replace with actual number

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      const record = await pb.collection('activities').getOne(id, { $autoCancel: false });
      setActivity(record);
    } catch (error) {
      toast.error('Activity not found');
      navigate('/experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppBooking = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    
    const message = `Hi! I'd like to book ${activity.title}. Date: ${selectedDate}, Group Size: ${quantity}, Special Requests: ${specialRequests || 'None'}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-96 w-full rounded-2xl mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Footer />
      </>
    );
  }

  if (!activity) return null;

  return (
    <>
      <Helmet>
        <title>{`${activity.title} - TravelExp`}</title>
        <meta name="description" content={activity.description || `Book ${activity.title} in ${activity.location}`} />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="rounded-2xl overflow-hidden mb-6">
                <img
                  src={activity.image ? pb.files.getUrl(activity, activity.image) : 'https://horizons-cdn.hostinger.com/a9e58fe0-cc2f-4d94-af7e-94a6ddb13aea/448c1e4d244199d34df30bc8317bbb68.png'}
                  alt={activity.title}
                  className="w-full h-96 object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="mb-4">{activity.title}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{activity.location}</span>
                    </div>
                    {activity.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{activity.duration}</span>
                      </div>
                    )}
                    {activity.groupSize && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{activity.groupSize}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{activity.rating || 4.8}</span>
                    </div>
                    <span className="text-muted-foreground">({activity.reviewCount || 127} reviews)</span>
                    {activity.badge && (
                      <span className="ml-auto bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        {activity.badge}
                      </span>
                    )}
                  </div>
                </div>

                {activity.description && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">About this experience</h3>
                    <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-muted/30 rounded-2xl p-6 sticky top-24">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary mb-1">${activity.price}</p>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="pl-10 text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Number of people</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Special Requests</label>
                    <Textarea
                      placeholder="Any dietary requirements or special needs?"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="resize-none text-gray-900 placeholder:text-gray-400"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${(activity.price * quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${(activity.price * quantity).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                  size="lg"
                  onClick={handleWhatsAppBooking}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ActivityDetailPage;
