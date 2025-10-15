'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Users, Coins, Package, Star, Wrench, Trash2 } from 'lucide-react';
import { adminService, AdminAction, GiveItemRequest, GiveCurrencyRequest, SpawnGuidingStarRequest } from '@/services/adminService';

interface AdminPanelProps {
  isAdmin?: boolean;
}

export default function AdminPanel({ isAdmin = false }: AdminPanelProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);

  // Form states
  const [giveItemForm, setGiveItemForm] = useState<GiveItemRequest>({
    target_username: '',
    item_type: 'lunar_dew',
    quantity: 1,
    rarity: 'common'
  });

  const [giveCurrencyForm, setGiveCurrencyForm] = useState<GiveCurrencyRequest>({
    target_username: '',
    coins: 0,
    gems: 0
  });

  const [spawnGuidingStarForm, setSpawnGuidingStarForm] = useState<SpawnGuidingStarRequest>({
    target_username: '',
    skill_node_slug: '',
    note: ''
  });

  useEffect(() => {
    if (isAdmin) {
      loadAdminActions();
    }
  }, [isAdmin]);

  const loadAdminActions = async () => {
    try {
      const response = await adminService.getAdminActions({ page_size: 10 });
      setAdminActions(response.results);
    } catch (err) {
      console.error('Failed to load admin actions:', err);
    }
  };

  const handleGiveItem = async () => {
    if (!giveItemForm.target_username.trim()) {
      setError('Target username is required');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await adminService.giveItem(giveItemForm);
      setMessage(response.message);
      setGiveItemForm({
        target_username: '',
        item_type: 'lunar_dew',
        quantity: 1,
        rarity: 'common'
      });
      loadAdminActions();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to give item');
    } finally {
      setLoading(false);
    }
  };

  const handleGiveCurrency = async () => {
    if (!giveCurrencyForm.target_username.trim()) {
      setError('Target username is required');
      return;
    }

    if (giveCurrencyForm.coins <= 0 && giveCurrencyForm.gems <= 0) {
      setError('Must give at least 1 coin or gem');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await adminService.giveCurrency(giveCurrencyForm);
      setMessage(response.message);
      setGiveCurrencyForm({
        target_username: '',
        coins: 0,
        gems: 0
      });
      loadAdminActions();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to give currency');
    } finally {
      setLoading(false);
    }
  };

  const handleSpawnGuidingStar = async () => {
    if (!spawnGuidingStarForm.target_username.trim()) {
      setError('Target username is required');
      return;
    }

    if (!spawnGuidingStarForm.skill_node_slug.trim()) {
      setError('Skill node slug is required');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await adminService.spawnGuidingStar(spawnGuidingStarForm);
      setMessage(response.message);
      setSpawnGuidingStarForm({
        target_username: '',
        skill_node_slug: '',
        note: ''
      });
      loadAdminActions();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to spawn guiding star');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Admin Access Required</h3>
          <p className="text-muted-foreground">You need admin privileges to access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      {(message || error) && (
        <Alert className={error ? 'border-destructive' : 'border-green-500'}>
          <AlertDescription>
            {error || message}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="actions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="items">Give Items</TabsTrigger>
          <TabsTrigger value="currency">Give Currency</TabsTrigger>
          <TabsTrigger value="guiding-stars">Guiding Stars</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Admin Actions
              </CardTitle>
              <CardDescription>
                View recent administrative actions performed on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminActions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No admin actions found</p>
                ) : (
                  adminActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{action.action_type_display}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(action.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{action.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Admin: {action.admin_username} → Target: {action.target_username}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Give Items
              </CardTitle>
              <CardDescription>
                Grant special items to users for testing or rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-username-item">Target Username</Label>
                  <Input
                    id="target-username-item"
                    value={giveItemForm.target_username}
                    onChange={(e) => setGiveItemForm(prev => ({ ...prev, target_username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-type">Item Type</Label>
                  <Select
                    value={giveItemForm.item_type}
                    onValueChange={(value: any) => setGiveItemForm(prev => ({ ...prev, item_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lunar_dew">Lunar Dew</SelectItem>
                      <SelectItem value="solar_fruit">Solar Fruit</SelectItem>
                      <SelectItem value="guiding_star">Guiding Star</SelectItem>
                      <SelectItem value="echo_bell">Echo Bell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="1000"
                    value={giveItemForm.quantity}
                    onChange={(e) => setGiveItemForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rarity">Rarity</Label>
                  <Select
                    value={giveItemForm.rarity}
                    onValueChange={(value: any) => setGiveItemForm(prev => ({ ...prev, rarity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="uncommon">Uncommon</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleGiveItem}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Give Item
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Give Currency
              </CardTitle>
              <CardDescription>
                Grant coins and gems to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-username-currency">Target Username</Label>
                  <Input
                    id="target-username-currency"
                    value={giveCurrencyForm.target_username}
                    onChange={(e) => setGiveCurrencyForm(prev => ({ ...prev, target_username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coins">Coins</Label>
                  <Input
                    id="coins"
                    type="number"
                    min="0"
                    max="1000000"
                    value={giveCurrencyForm.coins}
                    onChange={(e) => setGiveCurrencyForm(prev => ({ ...prev, coins: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gems">Gems</Label>
                  <Input
                    id="gems"
                    type="number"
                    min="0"
                    max="100000"
                    value={giveCurrencyForm.gems}
                    onChange={(e) => setGiveCurrencyForm(prev => ({ ...prev, gems: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <Button
                onClick={handleGiveCurrency}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Give Currency
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guiding-stars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Spawn Guiding Stars
              </CardTitle>
              <CardDescription>
                Create guiding stars for specific skill nodes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-username-star">Target Username</Label>
                  <Input
                    id="target-username-star"
                    value={spawnGuidingStarForm.target_username}
                    onChange={(e) => setSpawnGuidingStarForm(prev => ({ ...prev, target_username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-node-slug">Skill Node Slug</Label>
                  <Input
                    id="skill-node-slug"
                    value={spawnGuidingStarForm.skill_node_slug}
                    onChange={(e) => setSpawnGuidingStarForm(prev => ({ ...prev, skill_node_slug: e.target.value }))}
                    placeholder="e.g., python_basics"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  value={spawnGuidingStarForm.note}
                  onChange={(e) => setSpawnGuidingStarForm(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Optional note for the guiding star"
                  rows={3}
                />
              </div>
              <Button
                onClick={handleSpawnGuidingStar}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Spawn Guiding Star
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
