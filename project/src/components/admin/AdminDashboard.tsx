import React, { useState } from 'react';
import { Users, FileText, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import ComplaintCard from '../user/ComplaintCard';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { getComplaintsByResidency, getUsersByResidency, updateComplaintStatus, deleteComplaint, residencies } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!user) return null;

  const complaints = getComplaintsByResidency(user.residencyId);
  const residencyUsers = getUsersByResidency(user.residencyId);
  const residency = residencies.find(r => r.id === user.residencyId);

  const filteredComplaints = statusFilter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === statusFilter);

  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const completedComplaints = complaints.filter(c => c.status === 'Completed').length;

  const stats = [
    { label: 'Total Complaints', value: complaints.length, icon: FileText, color: 'blue' },
    { label: 'Pending', value: pendingComplaints, icon: Clock, color: 'yellow' },
    { label: 'In Progress', value: inProgressComplaints, icon: AlertCircle, color: 'orange' },
    { label: 'Completed', value: completedComplaints, icon: CheckCircle, color: 'green' },
  ];

  const handleStatusUpdate = (complaintId: string, newStatus: string) => {
    updateComplaintStatus(complaintId, newStatus);
  };

  const handleDeleteComplaint = (complaintId: string) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      deleteComplaint(complaintId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome, {user.username} • {user.workingProfession} at {residency?.name}
        </p>
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

      {/* Quick Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Residency Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Residents</p>
              <p className="text-lg font-semibold">{residencyUsers.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Users</p>
              <p className="text-lg font-semibold">{residencyUsers.filter(u => u.role === 'user').length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-lg font-semibold">{residencyUsers.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Manage Complaints</h2>
              <p className="text-gray-600 mt-1">Update status and manage resident complaints</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Complaints</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {statusFilter === 'all' ? 'No complaints yet' : `No ${statusFilter.toLowerCase()} complaints`}
              </h3>
              <p className="text-gray-600">
                {statusFilter === 'all' 
                  ? 'Complaints from residents will appear here' 
                  : `There are no complaints with ${statusFilter.toLowerCase()} status`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="relative">
                  <ComplaintCard complaint={complaint} showUser={true} />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleDeleteComplaint(complaint.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}