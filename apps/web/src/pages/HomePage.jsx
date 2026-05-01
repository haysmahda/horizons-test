import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Shield, CheckCircle, CreditCard, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/contexts/CartContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const HomePage = () => {
  const [activities, setActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const categories = ['All', 'Adventure', 'Relaxation', 'Culture', 'Nature', 'Water Sports'];

  useEffect(() => {
    fetchActivities();
  }, [selectedCategory]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const options = {
        sort: '-created',
        $autoCancel: false,
      };
      
      if (selectedCategory !== 'All') {
        options.filter = `category = "${selectedCategory}"`;
      }

      const records = await pb.collection('activities').getList(1, 8, options);
      setActivities(records.items);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast.success('Thanks for subscribing');
    setNewsletterEmail('');
  };

  const handleAddToFavorites = async (activityId) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites');
      return;
    }
    toast.success('Added to favorites');
  };

  const features = [
    {
      icon: Shield,
      title: 'Curated by locals',
      description: 'Every experience is handpicked by local experts who know their cities inside out',
    },
    {
      icon: CheckCircle,
      title: 'Instant confirmation',
      description: 'Book now and receive immediate confirmation for your chosen experiences',
    },
    {
      icon: CreditCard,
      title: 'Secure payments',
      description: 'Your transactions are protected with bank-level encryption and security',
    },
  ];

  const faqs = [
    {
      question: 'How do I book an experience?',
      answer: 'Browse our curated experiences, select your preferred date and time, add to cart, and complete the secure checkout process. You will receive instant confirmation via email.',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Most experiences offer free cancellation up to 24 hours before the scheduled time. Specific policies vary by activity and are clearly stated on each listing.',
    },
    {
      question: 'Are the experiences suitable for families?',
      answer: 'Many of our experiences are family-friendly. Check the activity details for age restrictions and group size recommendations.',
    },
    {
      question: 'How are local guides verified?',
      answer: 'All our local guides undergo a thorough verification process including background checks, certifications review, and customer feedback analysis.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>TravelExp - Discover the World Through Local Eyes</title>
        <meta name="description" content="Book authentic local experiences curated by experts. From adventure to culture, find unique activities in destinations worldwide." />
      </Helmet>
      <Header />

      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1691702563121-ed219cba8517" 
          alt="tropical beach with turquoise water" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white mb-6"
          >
            Discover the world through local eyes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-md"
          >
            Book authentic experiences curated by local experts in destinations worldwide
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Where are you going?"
                  className="pl-10 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="When?"
                  className="pl-10 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <Button className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2>Why choose TravelExp</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              We connect you with authentic local experiences that go beyond typical tourist attractions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center shadow-sm">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2>Must try attractions</h2>
            <p className="text-muted-foreground mt-4">Explore experiences by category</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse shadow-sm"></div>
              ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/activity/${activity.id}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 h-full flex flex-col">
                      <div className="relative h-48 bg-muted">
                        <img
                          src={activity.image ? pb.files.getUrl(activity, activity.image) : 'https://horizons-cdn.hostinger.com/a9e58fe0-cc2f-4d94-af7e-94a6ddb13aea/448c1e4d244199d34df30bc8317bbb68.png'}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                        {activity.badge && activity.badge !== 'None' && (
                          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                            {activity.badge}
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToFavorites(activity.id);
                          }}
                          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95 shadow-sm"
                          aria-label="Add to favorites"
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground mb-1">{activity.location}</p>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{activity.title}</h3>
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{activity.rating || 4.8}</span>
                          <span className="text-sm text-muted-foreground">({activity.reviewCount || 127})</span>
                        </div>
                        <div className="mt-auto pt-4 border-t border-border/50">
                          <p className="text-2xl font-bold text-primary">${activity.price}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-border">
              <p className="text-muted-foreground text-lg">No activities found in this category.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSelectedCategory('All')}
              >
                View all activities
              </Button>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/experiences">
              <Button size="lg">View all experiences</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2>Frequently asked questions</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-muted/30 rounded-xl px-6 border-0 shadow-sm">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-20 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">Stay updated with the latest deals</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive offers and new experiences
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 bg-white text-gray-900 placeholder:text-gray-400"
            />
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;