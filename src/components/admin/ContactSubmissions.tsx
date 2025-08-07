import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContactSubmission } from '@/types/contact';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Calendar, MessageSquare } from 'lucide-react';

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: 'new' | 'contacted' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status } : sub)
      );
      toast.success('Status updated');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'new': return 'destructive';
      case 'contacted': return 'default';
      case 'resolved': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return <div className="p-6">Loading contact submissions...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contact Submissions</h1>
        <Badge variant="outline">{submissions.length} Total</Badge>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="w-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{submission.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(submission.status || 'new')}>
                    {submission.status || 'new'}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={submission.status === 'new' ? 'default' : 'outline'}
                      onClick={() => updateStatus(submission.id!, 'new')}
                    >
                      New
                    </Button>
                    <Button
                      size="sm"
                      variant={submission.status === 'contacted' ? 'default' : 'outline'}
                      onClick={() => updateStatus(submission.id!, 'contacted')}
                    >
                      Contacted
                    </Button>
                    <Button
                      size="sm"
                      variant={submission.status === 'resolved' ? 'default' : 'outline'}
                      onClick={() => updateStatus(submission.id!, 'resolved')}
                    >
                      Resolved
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
                    {submission.phone}
                  </a>
                </div>
                {submission.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                      {submission.email}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{submission.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(submission.created_at!).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                <p className="text-sm text-muted-foreground">{submission.details}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {submissions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No contact submissions yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactSubmissions;