import React from 'react';
import { Building, Phone, Mail, Users, UserCheck, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function ResidencyInfo() {
  const { user } = useAuth();
  const { residencies, getUsersByResidency } = useData();

  if (!user) return null;

  const residency = residencies.find(r => r.id === user.residencyId);
  const residencyUsers = getUsersByResidency(user.residencyId);
  const users = residencyUsers.filter(u => u.role === 'user');
  const admins = residencyUsers.filter(u => u.role === 'admin');

  if (!residency) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Residency not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Residency Information</h1>
        <p className="text-gray-600 mt-2">Details about your residential community</p>
      </div>

      {/* Residency Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Building className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{residency.name}</h2>
              <p className="text-gray-600">Residential Community</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{residency.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{residency.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Residents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Residents</h3>
                <p className="text-sm text-gray-600">{users.length} users</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {users.map((resident) => (
                <div key={resident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{resident.username}</p>
                      <p className="text-sm text-gray-600">{resident.phone}</p>
                      {resident.email && (
                        <p className="text-sm text-gray-500">{resident.email}</p>
                      )}
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    User
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admins/Workers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Admins & Workers</h3>
                <p className="text-sm text-gray-600">{admins.length} admins</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{admin.username}</p>
                      <p className="text-sm text-gray-600">{admin.phone}</p>
                      {admin.email && (
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      Admin
                    </span>
                    {admin.workingProfession && (
                      <p className="text-xs text-gray-600 mt-1">{admin.workingProfession}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{residencyUsers.length}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{users.length}</div>
            <div className="text-sm text-gray-600">Residents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{admins.length}</div>
            <div className="text-sm text-gray-600">Staff Members</div>
          </div>
        </div>
      </div>
    </div>
  );
}