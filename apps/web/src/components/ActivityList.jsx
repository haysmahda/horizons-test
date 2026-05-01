
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const ActivityList = ({ refreshTrigger, onEdit }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    setError(false);
    try {
      const records = await pb.collection('activities').getFullList({
        sort: '-created',
        $autoCancel: false,
      });
      setActivities(records);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
      try {
        await pb.collection('activities').delete(id, { $autoCancel: false });
        toast.success('Activity deleted successfully');
        fetchActivities();
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Failed to delete activity');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
            <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-6 rounded-xl flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-10 h-10 mb-3" />
        <p className="font-semibold mb-4">Failed to load activities</p>
        <Button variant="outline" onClick={fetchActivities} className="bg-white text-foreground">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-border">
        <p className="text-muted-foreground">No activities found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-4 py-3">Activity</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={activity.image ? pb.files.getUrl(activity, activity.image) : 'https://horizons-cdn.hostinger.com/a9e58fe0-cc2f-4d94-af7e-94a6ddb13aea/448c1e4d244199d34df30bc8317bbb68.png'}
                      alt={activity.title}
                      className="w-12 h-12 rounded-lg object-cover bg-muted"
                    />
                    <div>
                      <p className="font-semibold text-foreground line-clamp-1">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium">
                    {activity.category || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  ${activity.price}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(activity)}
                      aria-label="Edit activity"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(activity.id)}
                      aria-label="Delete activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityList;
