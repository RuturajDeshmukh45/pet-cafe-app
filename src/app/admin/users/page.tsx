'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Shield, User, Loader2, CheckCircle2, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== 'Admin') {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setError('');
    setSuccess('');
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`User status updated to ${nextStatus}`);
        fetchUsers();
      } else {
        setError(data.error || 'Failed to update user status.');
      }
    } catch (e) {
      setError('Something went wrong.');
    }
  };

  const handleChangeRole = async (userId: string, nextRole: string) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roleName: nextRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`User role updated to ${nextRole}`);
        fetchUsers();
      } else {
        setError(data.error || 'Failed to update user role.');
      }
    } catch (e) {
      setError('Something went wrong.');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">Manage user accounts, toggle active status, and modify user roles.</p>
      </div>

      {success && (
        <div className="p-3 bg-green-500/10 text-green-600 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="glass-panel rounded-2xl border border-border shadow-md overflow-hidden">
        <div className="overflow-x-auto text-sm">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4">Name / Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{u.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'Active'
                          ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        u.status === 'Active'
                          ? 'bg-red-500/5 hover:bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-green-500/5 hover:bg-green-500/10 text-green-500 border-green-500/20'
                      }`}
                    >
                      {u.status === 'Active' ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-red-400" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-green-400" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
