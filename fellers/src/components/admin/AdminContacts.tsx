import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { serviceClient } from '@/utils/serviceClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Calendar, User, MessageSquare, RefreshCw, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { populateTestContacts } from '@/utils/testContactData';

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

// localStorage fallback functions
const getLocalStorageContacts = (): Contact[] => {
  try {
    const stored = localStorage.getItem('contactSubmissions');
    if (!stored) return [];
    
    const contacts = JSON.parse(stored);
    return Array.isArray(contacts) ? contacts : [];
  } catch (error) {
    console.error('Error loading contacts from localStorage:', error);
    return [];
  }
};

const saveLocalStorageContacts = (contacts: Contact[]) => {
  try {
    localStorage.setItem('contactSubmissions', JSON.stringify(contacts));
  } catch (error) {
    console.error('Error saving contacts to localStorage:', error);
  }
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notes, setNotes] = useState('');

  const fetchContacts = async () => {
    try {
      setLoading(true);
      console.log('Fetching contacts...');
      
      // Check if we have a valid client
      if (!serviceClient) {
        throw new Error('Database client not configured. Please check environment variables.');
      }
      
      let query = serviceClient
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching contacts:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Provide specific error messages
        if (error.code === '42P01') {
          throw new Error('Contacts table not found. Please run database migrations.');
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Please check database policies or environment variables.');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to database. Please check your internet connection and Supabase configuration.');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }
      
      console.log('Fetched contacts:', data?.length || 0);
      setContacts(data || []);
      
      if (data && data.length === 0) {
        // Try to load from localStorage as fallback
        const localContacts = getLocalStorageContacts();
        if (localContacts.length > 0) {
          console.log('Loading contacts from localStorage fallback:', localContacts.length);
          setContacts(localContacts);
          toast.info(`Loaded ${localContacts.length} contact submissions from local storage (offline mode)`);
        } else {
          toast.info('No contact submissions found');
        }
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Try localStorage fallback when database fails
      console.log('Attempting localStorage fallback...');
      const localContacts = getLocalStorageContacts();
      if (localContacts.length > 0) {
        console.log('Using localStorage fallback with', localContacts.length, 'contacts');
        setContacts(localContacts);
        toast.warning(`Database unavailable. Showing ${localContacts.length} contacts from local storage.`);
      } else {
        toast.error(`Error loading contact submissions: ${errorMessage}`);
      }
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

      const { error } = await serviceClient
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

  const deleteContact = async (contactId: string) => {
    try {
      const { error } = await serviceClient
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      toast.success('Contact deleted successfully');
      fetchContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
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

  const handlePopulateTestData = () => {
    const count = populateTestContacts();
    if (count > 0) {
      toast.success(`Added ${count} test contact submissions`);
      fetchContacts();
    } else {
      toast.error('Failed to add test data');
    }
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
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No contact submissions found</p>
              <Button 
                onClick={handlePopulateTestData}
                variant="outline"
                className="text-sm"
              >
                Add Test Data for Demo
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                This will add sample contact submissions for testing
              </p>
            </div>
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
                        <div className="flex gap-1">
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
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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