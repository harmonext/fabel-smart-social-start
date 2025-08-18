import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, XCircle, Search, Filter, Calendar, Building, User, MessageSquare, Clock, Shield, AlertCircle } from 'lucide-react';
import { useAdminContentModeration, AdminContentItem } from '@/hooks/useAdminContentModeration';
import { format } from 'date-fns';

const AdminContentModeration = () => {
  const {
    content,
    loading,
    selectedItems,
    moderateContent,
    bulkModerateContent,
    toggleSelection,
    selectAll,
    clearSelection,
    getFilteredContent
  } = useAdminContentModeration();

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [moderationDialogOpen, setModerationDialogOpen] = useState(false);
  const [moderationReason, setModerationReason] = useState('');
  const [selectedAction, setSelectedAction] = useState<'approved' | 'denied'>('approved');

  const getSocialIcon = (platform: string) => {
    const baseClasses = "h-4 w-4";
    switch (platform.toLowerCase()) {
      case 'facebook': return <div className={`${baseClasses} bg-blue-600 rounded-full`} />;
      case 'instagram': return <div className={`${baseClasses} bg-pink-600 rounded-full`} />;
      case 'linkedin': return <div className={`${baseClasses} bg-blue-700 rounded-full`} />;
      case 'twitter': return <div className={`${baseClasses} bg-blue-400 rounded-full`} />;
      case 'pinterest': return <div className={`${baseClasses} bg-red-600 rounded-full`} />;
      case 'tiktok': return <div className={`${baseClasses} bg-black rounded-full`} />;
      default: return <div className={`${baseClasses} bg-gray-400 rounded-full`} />;
    }
  };

  const getRiskBadge = (risk: string | null) => {
    if (!risk) return null;
    
    const variants = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge variant="outline" className={variants[risk as keyof typeof variants]}>
        {risk.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (item: AdminContentItem) => {
    if (item.admin_moderation_status === 'approved') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Admin Approved</Badge>;
    }
    if (item.admin_moderation_status === 'denied') {
      return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Admin Denied</Badge>;
    }
    if (item.ai_moderation_status === 'approved') {
      return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />AI Approved</Badge>;
    }
    if (item.ai_moderation_status === 'denied') {
      return <Badge className="bg-orange-100 text-orange-800"><XCircle className="h-3 w-3 mr-1" />AI Denied</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
  };

  const filteredContent = useMemo(() => {
    let filtered = content;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(item => {
        const itemDate = format(new Date(item.created_at), 'yyyy-MM-dd');
        return itemDate === dateFilter;
      });
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(item => {
        return item.ai_moderation_violations?.includes(categoryFilter);
      });
    }

    if (companyFilter) {
      filtered = filtered.filter(item =>
        item.company_name?.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    return filtered;
  }, [content, searchTerm, dateFilter, categoryFilter, companyFilter]);

  const handleSingleModeration = async (contentId: string, decision: 'approved' | 'denied') => {
    await moderateContent(contentId, decision, moderationReason || undefined);
    setModerationReason('');
  };

  const handleBulkModeration = async () => {
    if (selectedItems.size === 0) return;
    
    await bulkModerateContent(
      Array.from(selectedItems), 
      selectedAction, 
      moderationReason || undefined
    );
    setModerationDialogOpen(false);
    setModerationReason('');
  };

  const ContentTable = ({ items }: { items: AdminContentItem[] }) => (
    <div className="space-y-4">
      {selectedItems.size > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border">
          <span className="text-sm font-medium">{selectedItems.size} items selected</span>
          <Dialog open={moderationDialogOpen} onOpenChange={setModerationDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Bulk Action</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Moderation</DialogTitle>
                <DialogDescription>
                  Apply action to {selectedItems.size} selected items
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={selectedAction} onValueChange={(value: 'approved' | 'denied') => setSelectedAction(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="denied">Deny</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Reason (optional)"
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModerationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBulkModeration}>
                  Apply to {selectedItems.size} items
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={clearSelection}>
            Clear Selection
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={items.length > 0 && selectedItems.size === items.length}
                onCheckedChange={() => {
                  if (selectedItems.size === items.length) {
                    clearSelection();
                  } else {
                    selectAll(items);
                  }
                }}
              />
            </TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>AI Analysis</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedItems.has(item.id)}
                  onCheckedChange={() => toggleSelection(item.id)}
                />
              </TableCell>
              <TableCell className="max-w-md">
                <div className="space-y-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {item.content?.substring(0, 100)}...
                  </div>
                  {item.media_url && (
                    <Badge variant="outline" className="text-xs">
                      Media Attached
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{item.company_name || 'Unknown'}</div>
                  <div className="text-sm text-muted-foreground">{item.company_industry}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getSocialIcon(item.platform)}
                  <span className="capitalize">{item.platform}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  {getRiskBadge(item.ai_moderation_risk_level)}
                  {item.ai_moderation_violations && item.ai_moderation_violations.length > 0 && (
                    <div className="space-y-1">
                      {item.ai_moderation_violations.slice(0, 2).map((violation, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-red-50 text-red-700">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {violation}
                        </Badge>
                      ))}
                      {item.ai_moderation_violations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.ai_moderation_violations.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}
                  {item.ai_moderation_confidence && (
                    <div className="text-xs text-muted-foreground">
                      Confidence: {(item.ai_moderation_confidence * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(item)}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {format(new Date(item.created_at), 'MMM dd, yyyy')}
                </div>
              </TableCell>
              <TableCell>
                {!item.admin_moderation_status && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleSingleModeration(item.id, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleSingleModeration(item.id, 'denied')}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingContent = getFilteredContent('pending');
  const approvedContent = getFilteredContent('approved');
  const deniedContent = getFilteredContent('denied');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Shield className="h-8 w-8" />
          Content Moderation Dashboard
        </h1>
        <p className="text-muted-foreground">
          Review and moderate tenant content uploads across all platforms
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search content, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by violation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Violence and graphic content">Violence</SelectItem>
                <SelectItem value="Nudity and sexual content">Nudity</SelectItem>
                <SelectItem value="Hate speech and harassment">Hate Speech</SelectItem>
                <SelectItem value="Misinformation">Misinformation</SelectItem>
                <SelectItem value="Spam">Spam</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Filter by company"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{pendingContent.length}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{approvedContent.length}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{deniedContent.length}</div>
                <div className="text-sm text-muted-foreground">Denied</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">
                  {content.filter(item => item.ai_moderation_risk_level === 'high').length}
                </div>
                <div className="text-sm text-muted-foreground">High Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Review ({pendingContent.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            AI Approved ({approvedContent.length})
          </TabsTrigger>
          <TabsTrigger value="denied" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            AI Denied ({deniedContent.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Pending Review</CardTitle>
              <CardDescription>
                Content that requires manual review or has been flagged by AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTable items={filteredContent.filter(item => 
                (item.ai_moderation_status === 'pending' || !item.ai_moderation_status) && 
                !item.admin_moderation_status
              )} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Approved Content</CardTitle>
              <CardDescription>
                Content that has been approved by AI moderation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTable items={filteredContent.filter(item => 
                item.ai_moderation_status === 'approved' || item.admin_moderation_status === 'approved'
              )} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="denied" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Denied Content</CardTitle>
              <CardDescription>
                Content that has been flagged or denied by AI moderation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTable items={filteredContent.filter(item => 
                item.ai_moderation_status === 'denied' || item.admin_moderation_status === 'denied'
              )} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContentModeration;