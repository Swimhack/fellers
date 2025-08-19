// Test contact data for populating localStorage when database is unavailable
// This helps with testing the admin contact submissions functionality

export const createTestContactData = () => {
  const testContacts = [
    {
      id: "test-1",
      name: "John Smith",
      phone: "555-123-4567",
      email: "john@example.com",
      location: "Houston, TX",
      details: "Need heavy-duty towing for my semi-truck that broke down on I-45",
      status: "new" as const,
      notes: null,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      contacted_at: null,
      contacted_by: null
    },
    {
      id: "test-2", 
      name: "Sarah Johnson",
      phone: "555-987-6543",
      email: "sarah.j@email.com",
      location: "Katy, TX",
      details: "Car accident on Highway 6, need immediate towing service",
      status: "contacted" as const,
      notes: "Contacted customer, dispatching truck #3",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      contacted_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      contacted_by: "Admin"
    },
    {
      id: "test-3",
      name: "Mike Rodriguez", 
      phone: "555-456-7890",
      email: null,
      location: "Spring, TX",
      details: "Construction equipment needs transport to job site",
      status: "completed" as const,
      notes: "Job completed successfully, equipment delivered",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      contacted_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      contacted_by: "Admin"
    },
    {
      id: "test-4",
      name: "Lisa Chen",
      phone: "555-321-0987", 
      email: "lisa.chen@company.com",
      location: "The Woodlands, TX",
      details: "Fleet vehicle broke down, need priority towing service",
      status: "new" as const,
      notes: null,
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      contacted_at: null,
      contacted_by: null
    }
  ];

  return testContacts;
};

export const populateTestContacts = () => {
  try {
    const testContacts = createTestContactData();
    localStorage.setItem('contactSubmissions', JSON.stringify(testContacts));
    console.log('✅ Test contact data populated in localStorage');
    return testContacts.length;
  } catch (error) {
    console.error('❌ Failed to populate test contact data:', error);
    return 0;
  }
};

// Function to clear test data
export const clearTestContacts = () => {
  try {
    localStorage.removeItem('contactSubmissions');
    console.log('✅ Test contact data cleared from localStorage');
  } catch (error) {
    console.error('❌ Failed to clear test contact data:', error);
  }
};
