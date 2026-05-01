
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Search, Heart, Star, MessageCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ExperiencesPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  const WHATSAPP_NUMBER = '1234567890'; // Replace with actual number
  const categories = ['All', 'Adventure', 'Relaxation', 'Culture', 'Nature', 'Water Sports'];

  useEffect(() => {
    fetchActivities();
  }, [selectedCategory]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const filter = selectedCategory !== 'All' ? `category = "${selectedCategory}"` : '';
      const records = await pb.collection('activities').getFullList({
        filter,
        sort: '-created',
        $autoCancel: false,
      });
      setActivities(records);
    } catch (error) {
      toast.error('Failed to load experiences');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (activityId) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites');
      return;
    }
    toast.success('Added to favorites');
  };

  const handleWhatsAppInquiry = (e, activity) => {
    e.preventDefault();
    const message = `Hi! I'm interested in ${activity.title} priced at $${activity.price}. Please provide more details. Category: ${activity.category || 'General'}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Experiences - TravelExp</title>
        <meta name="description" content="Browse our curated collection of local experiences. From adventure to culture, find your perfect activity." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-muted/30">
        <div className="bg-white border-b border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6">Explore experiences</h1>
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by location or activity name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No experiences found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <Link key={activity.id} to={`/activity/${activity.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative h-56">
                      <img
                        src={activity.image ? pb.files.getUrl(activity, activity.image) : 'https://horizons-cdn.hostinger.com/a9e58fe0-cc2f-4d94-af7e-94a6ddb13aea/448c1e4d244199d34df30bc8317bbb68.png'}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                      {activity.badge && (
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                          {activity.badge}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToFavorites(activity.id);
                        }}
                        className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-1">{activity.location}</p>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{activity.title}</h3>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{activity.description}</p>
                      )}
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{activity.rating || 4.8}</span>
                        <span className="text-sm text-muted-foreground">({activity.reviewCount || 127})</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <p className="text-2xl font-bold text-primary">${activity.price}</p>
                        <Button 
                          onClick={(e) => handleWhatsAppInquiry(e, activity)}
                          className="bg-[#25D366] hover:bg-[#128C7E] text-white"
                          size="sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Book via WhatsApp
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ExperiencesPage;
