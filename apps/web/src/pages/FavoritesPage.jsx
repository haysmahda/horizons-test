
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/contexts/CartContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const favoriteRecords = await pb.collection('favorites').getFullList({
        filter: `userId = "${currentUser.id}"`,
        $autoCancel: false,
      });
      setFavorites(favoriteRecords);

      if (favoriteRecords.length > 0) {
        const activityIds = favoriteRecords.map(f => f.activityId);
        const activityRecords = await pb.collection('activities').getFullList({
          filter: activityIds.map(id => `id = "${id}"`).join(' || '),
          $autoCancel: false,
        });
        setActivities(activityRecords);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (activityId) => {
    try {
      const favorite = favorites.find(f => f.activityId === activityId);
      if (favorite) {
        await pb.collection('favorites').delete(favorite.id, { $autoCancel: false });
        setFavorites(favorites.filter(f => f.id !== favorite.id));
        setActivities(activities.filter(a => a.id !== activityId));
        toast.success('Removed from favorites');
      }
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  const handleAddToCart = (activity) => {
    addItem(activity, 1);
    toast.success('Added to cart');
  };

  return (
    <>
      <Helmet>
        <title>My Favorites - TravelExp</title>
        <meta name="description" content="Your saved experiences" />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8">My favorites</h1>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full rounded-2xl" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">Start adding experiences you love</p>
              <Link to="/experiences">
                <Button size="lg">Browse experiences</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-2xl overflow-hidden shadow-lg h-full flex flex-col">
                  <Link to={`/activity/${activity.id}`}>
                    <div className="relative h-56">
                      <img
                        src={activity.image ? pb.files.getUrl(activity, activity.image) : 'https://horizons-cdn.hostinger.com/a9e58fe0-cc2f-4d94-af7e-94a6ddb13aea/448c1e4d244199d34df30bc8317bbb68.png'}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-1">{activity.location}</p>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{activity.title}</h3>
                    <p className="text-2xl font-bold text-primary mb-4">${activity.price}</p>
                    <div className="mt-auto flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleAddToCart(activity)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveFavorite(activity.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FavoritesPage;
