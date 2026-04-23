'use client';

import { useState } from 'react';
import AdminLayout from '../layout';
import { Search, Filter, MoreVertical, UserCheck, UserX, Eye } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'owner' | 'manager' | 'staff' | 'viewer';
  email_verified: boolean;
  last_login_at: string | null;
  created_at: string;
  status: 'active' | 'suspended' | 'pending';
  suspended_at?: string;
  suspension_reason?: string;
  org_count: number;
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@nexus.app',
    name: 'System Admin',
    role: 'admin',
    email_verified: true,
    last_login_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    status: 'active',
    org_count: 0,
  },
  {
    id: '2',
    email: 'john.doe@acme.com',
    name: 'John Doe',
    role: 'owner',
    email_verified: true,
    last_login_at: '2024-01-14T15:45:00Z',
    created_at: '2024-01-10T09:00:00Z',
    status: 'active',
    org_count: 1,
  },
  {
    id: '3',
    email: 'jane.smith@startup.io',
    name: 'Jane Smith',
    role: 'manager',
    email_verified: true,
    last_login_at: '2024-01-13T11:20:00Z',
    created_at: '2024-01-08T14:30:00Z',
    status: 'active',
    org_count: 1,
  },
  {
    id: '4',
    email: 'suspended@example.com',
    name: 'Suspended User',
    role: 'viewer',
    email_verified: true,
    last_login_at: '2024-01-10T08:15:00Z',
    created_at: '2024-01-05T12:00:00Z',
    status: 'suspended',
    suspended_at: '2024-01-12T10:00:00Z',
    suspension_reason: 'Violation of terms',
    org_count: 0,
  },
];

export default function AdminUsersPage() {
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleImpersonate = (userId: string) => {
    // TODO: Implement impersonation
    console.log('Impersonating user:', userId);
  };

  const handleSuspend = (userId: string) => {
    // TODO: Implement suspension
    console.log('Suspending user:', userId);
  };

  const handleActivate = (userId: string) => {
    // TODO: Implement activation
    console.log('Activating user:', userId);
  };

  const handleDelete = (userId: string) => {
    // TODO: Implement deletion
    console.log('Deleting user:', userId);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nexus-text-primary">
              User Management
            </h1>
            <p className="text-nexus-text-secondary mt-1">
              Manage users, roles, and permissions across the platform
            </p>
          </div>

          <button className="btn btn-primary">
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-nexus-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input sm:w-40"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input sm:w-40"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-nexus-bg-secondary border-b border-nexus-border">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider">
                    Organizations
                  </th>
                  <th className="text-right p-4 text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nexus-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-nexus-bg-secondary">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-nexus-blue-light rounded-full flex items-center justify-center">
                          <span className="text-nexus-blue font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-nexus-text-primary">
                            {user.name}
                          </div>
                          <div className="text-sm text-nexus-text-secondary">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' ? 'bg-nexus-red text-white' :
                        user.role === 'owner' ? 'bg-nexus-violet text-white' :
                        user.role === 'manager' ? 'bg-nexus-blue text-white' :
                        user.role === 'staff' ? 'bg-nexus-green text-white' :
                        'bg-nexus-amber text-white'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-nexus-green text-white' :
                        user.status === 'suspended' ? 'bg-nexus-red text-white' :
                        'bg-nexus-amber text-white'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-nexus-text-secondary">
                      {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-4 text-sm text-nexus-text-secondary">
                      {user.org_count}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleImpersonate(user.id)}
                          className="p-1 text-nexus-text-secondary hover:text-nexus-text-primary"
                          title="Impersonate"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleSuspend(user.id)}
                            className="p-1 text-nexus-text-secondary hover:text-nexus-red"
                            title="Suspend"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(user.id)}
                            className="p-1 text-nexus-text-secondary hover:text-nexus-green"
                            title="Activate"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1 text-nexus-text-secondary hover:text-nexus-red"
                          title="Delete"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-nexus-text-secondary">No users found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-nexus-text-secondary">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary" disabled>
              Previous
            </button>
            <button className="btn btn-secondary">
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}