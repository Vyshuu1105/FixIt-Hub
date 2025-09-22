import React from 'react';
import { Clock, AlertCircle, CheckCircle, User, Calendar, Camera } from 'lucide-react';

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

interface ComplaintCardProps {
  complaint: Complaint;
  showUser?: boolean;
}

export default function ComplaintCard({ complaint, showUser = false }: ComplaintCardProps) {
  const getStatusIcon = () => {
    switch (complaint.status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'In Progress':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  const getStatusBadge = () => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (complaint.status) {
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'In Progress':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'Completed':
        return `${baseClasses} bg-green-100 text-green-800`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{complaint.problemName}</h3>
            <span className={getStatusBadge()}>
              {complaint.status}
            </span>
          </div>
        </div>
        {complaint.photoUrl && (
          <div className="flex items-center text-gray-500">
            <Camera className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span className="font-medium">Worker Type:</span>
          <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {complaint.workerType}
          </span>
        </div>

        {showUser && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">Reported by:</span>
            <span className="ml-1">{complaint.userName}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(complaint.createdAt)}</span>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {complaint.description}
          </p>
        </div>

        {complaint.photoUrl && (
          <div className="mt-3">
            <img
              src={complaint.photoUrl}
              alt="Complaint"
              className="rounded-lg max-h-48 object-cover border border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}