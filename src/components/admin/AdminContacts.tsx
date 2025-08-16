import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Calendar, User, MessageSquare, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  details: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  contacted_at: string | null;
  contacted_by: string | null;
}

const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notes, setNotes] = useState('');

  const fetchContacts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const updateContactStatus = async (contactId: string, newStatus: string, contactNotes?: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'contacted') {
        updateData.contacted_at = new Date().toISOString();
        // You could add current user info here
        updateData.contacted_by = 'Admin';
      }

      if (contactNotes !== undefined) {
        updateData.notes = contactNotes;
      }

      const { error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', contactId);

      if (error) throw error;

      toast.success('Contact updated successfully');
      fetchContacts();
      setSelectedContact(null);
      setNotes('');
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500'
    };

    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Contact Submissions</CardTitle>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchContacts} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No contacts found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          {formatDate(contact.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {contact.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <a href={`tel:${contact.phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                            <Phone className="h-4 w-4" />
                            {contact.phone}
                          </a>
                          {contact.email !== 'No email provided' && (
                            <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                              <Mail className="h-4 w-4" />
                              {contact.email}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {contact.location}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(contact.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedContact(contact);
                                setNotes(contact.notes || '');
                              }}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Contact Details</DialogTitle>
                            </DialogHeader>
                            {selectedContact && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-gray-500">Name</Label>
                                    <p className="font-medium">{selectedContact.name}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-500">Phone</Label>
                                    <a href={`tel:${selectedContact.phone}`} className="font-medium text-blue-600 hover:underline">
                                      {selectedContact.phone}
                                    </a>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-500">Email</Label>
                                    <p className="font-medium">
                                      {selectedContact.email !== 'No email provided' ? (
                                        <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                                          {selectedContact.email}
                                        </a>
                                      ) : (
                                        'No email provided'
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-500">Location</Label>
                                    <p className="font-medium">{selectedContact.location}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-500">Submitted</Label>
                                    <p className="font-medium">{formatDate(selectedContact.created_at)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-500">Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedContact.status)}</div>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm text-gray-500">Vehicle/Load Details</Label>
                                  <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedContact.details}</p>
                                </div>

                                {selectedContact.contacted_at && (
                                  <div>
                                    <Label className="text-sm text-gray-500">Contact History</Label>
                                    <p className="mt-1 text-sm">
                                      Contacted on {formatDate(selectedContact.contacted_at)}
                                      {selectedContact.contacted_by && ` by ${selectedContact.contacted_by}`}
                                    </p>
                                  </div>
                                )}

                                <div>
                                  <Label htmlFor="notes" className="text-sm text-gray-500">Internal Notes</Label>
                                  <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add notes about this contact..."
                                    className="mt-1"
                                    rows={3}
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Select
                                    value={selectedContact.status}
                                    onValueChange={(value) => updateContactStatus(selectedContact.id, value, notes)}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="contacted">Contacted</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    onClick={() => updateContactStatus(selectedContact.id, selectedContact.status, notes)}
                                    variant="outline"
                                  >
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContacts;