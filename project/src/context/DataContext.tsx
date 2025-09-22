import React, { createContext, useContext, useState, useEffect } from 'react';

interface Residency {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface User {
  id: string;
  username: string;
  phone: string;
  email?: string;
  role: 'user' | 'admin';
  residencyId: string;
  workingProfession?: string;
}

interface Complaint {
  id: string;
  userId: string;
  residencyId: string;
  problemName: string;
  workerType: string;
  description: string;
  photoUrl?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
  userName: string;
}

interface DataContextType {
  residencies: Residency[];
  users: User[];
  complaints: Complaint[];
  addUser: (user: User) => boolean;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt'>) => void;
  updateComplaintStatus: (id: string, status: string) => void;
  deleteComplaint: (id: string) => void;
  getUsersByResidency: (residencyId: string) => User[];
  getComplaintsByUser: (userId: string) => Complaint[];
  getComplaintsByResidency: (residencyId: string) => Complaint[];
}

const DataContext = createContext<DataContextType | null>(null);

// Sample data
const sampleResidencies: Residency[] = [
  { id: '1', name: 'Green Valley Apartments', phone: '+91 98765 43210', email: 'admin@greenvalley.com' },
  { id: '2', name: 'Sunrise Housing Society', phone: '+91 98765 43211', email: 'contact@sunrisehomes.com' },
  { id: '3', name: 'Royal Garden Complex', phone: '+91 98765 43212', email: 'info@royalgarden.com' },
];

const sampleUsers: User[] = [
  // Green Valley Apartments - Users
  { id: '1', username: 'John Smith', phone: '+91 98765 11111', email: 'john@email.com', role: 'user', residencyId: '1' },
  { id: '2', username: 'Sarah Johnson', phone: '+91 98765 11112', email: 'sarah@email.com', role: 'user', residencyId: '1' },
  { id: '3', username: 'Mike Wilson', phone: '+91 98765 11113', role: 'user', residencyId: '1' },
  { id: '4', username: 'Lisa Davis', phone: '+91 98765 11114', email: 'lisa@email.com', role: 'user', residencyId: '1' },
  { id: '5', username: 'David Brown', phone: '+91 98765 11115', role: 'user', residencyId: '1' },
  
  // Green Valley Apartments - Admins
  { id: '6', username: 'Robert Kumar', phone: '+91 98765 22221', email: 'robert@email.com', role: 'admin', residencyId: '1', workingProfession: 'Plumber' },
  { id: '7', username: 'Maria Garcia', phone: '+91 98765 22222', role: 'admin', residencyId: '1', workingProfession: 'Electrician' },
  { id: '8', username: 'James Lee', phone: '+91 98765 22223', email: 'james@email.com', role: 'admin', residencyId: '1', workingProfession: 'Carpenter' },
  { id: '9', username: 'Priya Sharma', phone: '+91 98765 22224', role: 'admin', residencyId: '1', workingProfession: 'Cleaner' },
  
  // Sunrise Housing Society - Users
  { id: '10', username: 'Amit Patel', phone: '+91 98765 33331', email: 'amit@email.com', role: 'user', residencyId: '2' },
  { id: '11', username: 'Neha Gupta', phone: '+91 98765 33332', role: 'user', residencyId: '2' },
  { id: '12', username: 'Raj Singh', phone: '+91 98765 33333', email: 'raj@email.com', role: 'user', residencyId: '2' },
  
  // Sunrise Housing Society - Admins
  { id: '13', username: 'Suresh Yadav', phone: '+91 98765 44441', role: 'admin', residencyId: '2', workingProfession: 'Security' },
  { id: '14', username: 'Kavita Reddy', phone: '+91 98765 44442', email: 'kavita@email.com', role: 'admin', residencyId: '2', workingProfession: 'Maintenance' },
];

const sampleComplaints: Complaint[] = [
  {
    id: '1',
    userId: '1',
    residencyId: '1',
    problemName: 'Water Leakage',
    workerType: 'Plumber',
    description: 'Leakage near bathroom tap, water dripping continuously',
    status: 'Pending',
    createdAt: '2025-01-21T10:30:00Z',
    userName: 'John Smith'
  },
  {
    id: '2',
    userId: '2',
    residencyId: '1',
    problemName: 'Fan Not Working',
    workerType: 'Electrician',
    description: 'Ceiling fan in bedroom stopped working suddenly',
    status: 'In Progress',
    createdAt: '2025-01-21T09:15:00Z',
    userName: 'Sarah Johnson'
  },
  {
    id: '3',
    userId: '10',
    residencyId: '2',
    problemName: 'Door Lock Issue',
    workerType: 'Carpenter',
    description: 'Main door lock is jammed, cannot open properly',
    status: 'Completed',
    createdAt: '2025-01-20T14:20:00Z',
    userName: 'Amit Patel'
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [residencies, setResidencies] = useState<Residency[]>(sampleResidencies);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [complaints, setComplaints] = useState<Complaint[]>(sampleComplaints);

  const addUser = (newUser: User): boolean => {
    const residencyUsers = users.filter(user => user.residencyId === newUser.residencyId);
    const userCount = residencyUsers.filter(user => user.role === 'user').length;
    const adminCount = residencyUsers.filter(user => user.role === 'admin').length;

    if (newUser.role === 'user' && userCount >= 15) {
      return false; // Max users reached
    }
    if (newUser.role === 'admin' && adminCount >= 15) {
      return false; // Max admins reached
    }

    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'createdAt'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: string) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === id ? { ...complaint, status: status as any } : complaint
    ));
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(complaint => complaint.id !== id));
  };

  const getUsersByResidency = (residencyId: string) => {
    return users.filter(user => user.residencyId === residencyId);
  };

  const getComplaintsByUser = (userId: string) => {
    return complaints.filter(complaint => complaint.userId === userId);
  };

  const getComplaintsByResidency = (residencyId: string) => {
    return complaints.filter(complaint => complaint.residencyId === residencyId);
  };

  return (
    <DataContext.Provider value={{
      residencies,
      users,
      complaints,
      addUser,
      addComplaint,
      updateComplaintStatus,
      deleteComplaint,
      getUsersByResidency,
      getComplaintsByUser,
      getComplaintsByResidency,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}