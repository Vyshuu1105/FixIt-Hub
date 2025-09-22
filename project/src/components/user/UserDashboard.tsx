import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import ComplaintCard from './ComplaintCard';

export default function UserDashboard() {
  const { user } = useAuth();
  const { getComplaintsByUser, getUsersByResidency, residencies } = useData();

  if (!user) return null;

  const userComplaints = getComplaintsByUser(user.id);
  const residencyUsers = getUsersByResidency(user.residencyId);
  const residency = residencies.find(r => r.id === user.residencyId);

  const pendingComplaints = userComplaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = userComplaints.filter(c => c.status === 'In Progress').length;
  const completedComplaints = userComplaints.filter(c => c.status === 'Completed').length;

  const stats = [
    { label: 'Total Complaints', value: userComplaints.length, icon: FileText, color: 'blue' },
    { label: 'Pending', value: pendingComplaints, icon: Clock, color: 'yellow' },
    { label: 'In Progress', value: inProgressComplaints, icon: AlertCircle, color: 'orange' },
    { label: 'Completed', value: completedComplaints, icon: CheckCircle, color: 'green' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
        <p className="text-gray-600 mt-2">Manage your complaints and track their status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/raise-complaint"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Raise New Complaint
          </Link>
          <Link
            to="/residency"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Users className="h-5 w-5 mr-2" />
            View Residency ({residencyUsers.length} members)
          </Link>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Your Complaints</h2>
          <p className="text-gray-600 mt-1">Track the status of your reported issues</p>
        </div>
        <div className="p-6">
          {userComplaints.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints yet</h3>
              <p className="text-gray-600 mb-6">When you raise a complaint, it will appear here</p>
              <Link
                to="/raise-complaint"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Raise Your First Complaint
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}