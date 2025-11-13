'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Activity, Image as ImageIcon } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/banners', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner.id}`
        : '/api/admin/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowDialog(false);
        setEditingBanner(null);
        setFormData({ title: '', subtitle: '', imageUrl: '', link: '', order: 0, isActive: true });
        fetchBanners();
      }
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl,
      link: banner.link || '',
      order: banner.order,
      isActive: banner.isActive,
    });
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!deletingBanner) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/banners/${deletingBanner.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setShowDeleteDialog(false);
        setDeletingBanner(null);
        fetchBanners();
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
            <p className="text-muted-foreground">Manage app promotional banners</p>
          </div>
          <Button onClick={() => {
            setEditingBanner(null);
            setFormData({ title: '', subtitle: '', imageUrl: '', link: '', order: 0, isActive: true });
            setShowDialog(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Banner
          </Button>
        </div>

        {/* Banners Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Activity className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : banners.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No banners yet</p>
              <Button className="mt-4" onClick={() => setShowDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Banner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner) => (
              <Card key={banner.id}>
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          banner.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-1">{banner.title}</CardTitle>
                  {banner.subtitle && (
                    <CardDescription className="mb-3">{banner.subtitle}</CardDescription>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>Order: {banner.order}</span>
                    <span>Updated {new Date(banner.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(banner)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDeletingBanner(banner);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
            <DialogDescription>
              {editingBanner ? 'Update the banner information' : 'Create a new promotional banner'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter banner title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Enter banner subtitle"
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="link">Link (Optional)</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingBanner ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingBanner?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
