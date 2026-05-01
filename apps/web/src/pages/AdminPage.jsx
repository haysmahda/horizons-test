
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Star, UploadCloud, X } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ActivityList from '@/components/ActivityList.jsx';

const initialFormState = {
  title: '',
  price: '',
  description: '',
  category: 'Adventure',
  location: '',
  image: null,
  rating: 4.8,
  reviewCount: 0,
  duration: '',
  groupSize: '',
  badge: 'None',
};

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const fileInputRef = useRef(null);

  const categories = ['Adventure', 'Relaxation', 'Culture', 'Nature', 'Water Sports'];
  const badges = ['None', 'BEST SELLER', 'LOCALLY CURATED', 'MUST TRY'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (activity) => {
    setEditingId(activity.id);
    setFormData({
      title: activity.title || '',
      price: activity.price || '',
      description: activity.description || '',
      category: activity.category || 'Adventure',
      location: activity.location || '',
      image: activity.image || null,
      rating: activity.rating || 4.8,
      reviewCount: activity.reviewCount || 0,
      duration: activity.duration || '',
      groupSize: activity.groupSize || '',
      badge: activity.badge || 'None',
    });

    if (activity.image) {
      setPreviewImage(pb.files.getUrl(activity, activity.image));
    } else {
      setPreviewImage(null);
    }
    
    // Scroll to top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!currentUser?.id) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    setIsSubmitting(true);
    try {
      const pbData = new FormData();
      pbData.append('title', formData.title);
      pbData.append('price', parseFloat(formData.price));
      pbData.append('description', formData.description);
      pbData.append('category', formData.category);
      pbData.append('location', formData.location);
      pbData.append('rating', parseFloat(formData.rating));
      pbData.append('reviewCount', parseInt(formData.reviewCount, 10));
      pbData.append('duration', formData.duration);
      pbData.append('groupSize', formData.groupSize);
      pbData.append('badge', formData.badge === 'None' ? '' : formData.badge);
      pbData.append('userId', currentUser.id);

      if (formData.image instanceof File) {
        pbData.append('image', formData.image);
      }

      if (editingId) {
        await pb.collection('activities').update(editingId, pbData, { $autoCancel: false });
        toast.success('Activity updated successfully');
      } else {
        await pb.collection('activities').create(pbData, { $autoCancel: false });
        toast.success('Activity created successfully');
      }

      resetForm();
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultPlaceholderImg = 'https://horizons-cdn.hostinger.com/a9e58fe0-cc2f-4d94-af7e-94a6ddb13aea/448c1e4d244199d34df30bc8317bbb68.png';

  return (
    <>
      <Helmet>
        <title>Content Manager - TravelExp</title>
        <meta name="description" content="Manage activities and experiences" />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Content Manager</h1>
              <p className="text-muted-foreground mt-2">Create and manage activities</p>
            </div>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" /> Cancel Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Form Section */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-6">
                {editingId ? 'Edit Activity' : 'Add New Activity'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Sunset Snorkeling Tour"
                      required
                      className="text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 89.00"
                      required
                      className="text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Maui, Hawaii"
                      required
                      className="text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the experience in detail..."
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g. 2 hours"
                      className="text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="groupSize">Group Size</Label>
                    <Input
                      id="groupSize"
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleChange}
                      placeholder="e.g. 2-10 people"
                      className="text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Initial Rating</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={handleChange}
                      className="text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewCount">Reviews Count</Label>
                    <Input
                      id="reviewCount"
                      name="reviewCount"
                      type="number"
                      min="0"
                      value={formData.reviewCount}
                      onChange={handleChange}
                      className="text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge</Label>
                    <select
                      id="badge"
                      name="badge"
                      value={formData.badge}
                      onChange={handleChange}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {badges.map((badge) => (
                        <option key={badge} value={badge}>{badge}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Activity Image</Label>
                    <div className="relative">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="pl-10 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-gray-900"
                      />
                      <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1 md:flex-none min-w-[200px]">
                    {isSubmitting ? 'Saving...' : (editingId ? 'Update Activity' : 'Create Activity')}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" size="lg" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Live Preview Section */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Live Preview</h3>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border h-full flex flex-col pointer-events-none">
                  <div className="relative h-56 bg-muted">
                    <img
                      src={previewImage || defaultPlaceholderImg}
                      alt={formData.title || "Preview"}
                      className="w-full h-full object-cover"
                    />
                    {formData.badge && formData.badge !== 'None' && (
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        {formData.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-1">{formData.location || 'Location'}</p>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-foreground">
                      {formData.title || 'Activity Title'}
                    </h3>
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-foreground">{formData.rating}</span>
                      <span className="text-sm text-muted-foreground">({formData.reviewCount})</span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border/50">
                      <p className="text-2xl font-bold text-primary">
                        ${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Manage Activities</h2>
            <ActivityList refreshTrigger={refreshTrigger} onEdit={handleEdit} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminPage;
