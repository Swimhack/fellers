import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Calendar, User, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface LocalContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  details: string;
  timestamp: string;
}

const AdminContactsLocal = () => {
  const [contacts, setContacts] = useState<LocalContact[]>([]);

  const loadLocalContacts = () => {
    try {
      const stored = localStorage.getItem('contact_submissions');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sort by timestamp, newest first
        const sorted = parsed.sort((a: LocalContact, b: LocalContact) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setContacts(sorted);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error('Error loading local contacts:', error);
      setContacts([]);
    }
  };

  useEffect(() => {
    loadLocalContacts();
    
    // Listen for storage changes (new submissions)
    const handleStorageChange = () => {
      loadLocalContacts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also refresh every 5 seconds to catch same-tab changes
    const interval = setInterval(loadLocalContacts, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const exportToCSV = () => {
    if (contacts.length === 0) return;
    
    const headers = ['Name', 'Phone', 'Email', 'Location', 'Details', 'Submitted'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        `"${contact.name}"`,
        `"${contact.phone}"`,
        `"${contact.email || 'No email provided'}"`,
        `"${contact.location}"`,
        `"${contact.details}"`,
        `"${format(new Date(contact.timestamp), 'yyyy-MM-dd HH:mm:ss')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearContacts = () => {
    if (confirm('Are you sure you want to clear all contact submissions? This cannot be undone.')) {
      localStorage.removeItem('contact_submissions');
      setContacts([]);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Contact Submissions (Local Storage)</CardTitle>
            <div className="flex gap-2">
              <Button onClick={loadLocalContacts} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              {contacts.length > 0 && (
                <>
                  <Button onClick={exportToCSV} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={clearContacts} variant="destructive" size="sm">
                    Clear All
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No contact submissions found in local storage</p>
              <p className="text-sm mt-2">Submissions will appear here when customers fill out the contact form</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Total submissions: {contacts.length} | 
                Latest: {contacts.length > 0 ? formatDate(contacts[0].timestamp) : 'None'}
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4" />
                            {formatDate(contact.timestamp)}
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
                            {contact.email && (
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
                        <TableCell>
                          <div className="max-w-xs truncate" title={contact.details}>
                            {contact.details}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContactsLocal;