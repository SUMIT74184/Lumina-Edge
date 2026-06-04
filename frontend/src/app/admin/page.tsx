"use client";

import Sidebar from '@/components/Sidebar';
import TrialGuard from '@/components/TrialGuard';
import { useSidebar } from '@/context/SidebarContext';
import { useUser } from '@clerk/nextjs';

import { useFetch } from '@/hooks/useApi';

import { useEffect, useState } from 'react';

interface AdminMetrics {
  totalTransactions: number;
  totalEvents: number;
  totalWorkouts: number;
  globalARR: number;
}

interface UserDto {
  id: string;
  email: string;
  status: string;
  joined: string;
}

export default function AdminPanel() {
  const { isCollapsed } = useSidebar();
  const { user } = useUser();
  const { data: metrics, loading } = useFetch<AdminMetrics>('/admin/metrics');
  
  const [users, setUsers] = useState<UserDto[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/admin/users');
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id: string, action: 'suspend' | 'enable') => {
    setActionLoading(id);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/admin/users/${id}/${action}`, {
        method: 'PUT'
      });
      if (res.ok) {
        await fetchUsers(); // Refresh the list
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };


  return (
    <TrialGuard>
      <div className="min-h-screen bg-background text-on-background">
        <Sidebar />
        <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-8 md:p-margin-desktop transition-all duration-300`}>
          <header className="mb-12">
            <h1 className="font-headline-xl text-primary mb-2">Admin Control Center</h1>
            <p className="text-outline">System-wide metrics and user overview.</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-tertiary mb-2 text-3xl">payments</span>
              <div className="text-xs font-label-caps text-outline">TOTAL TRANSACTIONS</div>
              <div className="text-3xl font-data-display mt-2 text-on-surface">
                {loading ? '...' : metrics?.totalTransactions || 0}
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">account_balance</span>
              <div className="text-xs font-label-caps text-outline">GLOBAL ARR</div>
              <div className="text-3xl font-data-display mt-2 text-primary">
                {loading ? '...' : `₹${metrics?.globalARR?.toLocaleString() || 0}`}
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-tertiary mb-2 text-3xl">event</span>
              <div className="text-xs font-label-caps text-outline">TOTAL EVENTS</div>
              <div className="text-3xl font-data-display mt-2 text-on-surface">
                {loading ? '...' : metrics?.totalEvents || 0}
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-tertiary mb-2 text-3xl">fitness_center</span>
              <div className="text-xs font-label-caps text-outline">TOTAL WORKOUTS</div>
              <div className="text-3xl font-data-display mt-2 text-on-surface">
                {loading ? '...' : metrics?.totalWorkouts || 0}
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-on-surface">User Management</h2>
              <button 
                onClick={() => fetchUsers()} 
                className="text-primary hover:text-primary-fixed transition-colors"
                title="Refresh Users"
              >
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant text-outline font-label-caps text-xs">
                    <th className="pb-3 pl-2">USER ID</th>
                    <th className="pb-3">EMAIL</th>
                    <th className="pb-3">STATUS</th>
                    <th className="pb-3">JOINED</th>
                    <th className="pb-3 text-right pr-2">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {/* Current Admin User */}
                  <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors bg-surface-container-high/30">
                    <td className="py-4 pl-2 font-mono text-tertiary">{user?.id?.substring(0, 12) || 'usr_...'}</td>
                    <td className="py-4 text-on-surface">{user?.primaryEmailAddress?.emailAddress || 'admin@lumina.edge'} <span className="ml-2 bg-tertiary/20 text-tertiary px-2 py-1 rounded text-[10px] font-label-caps">ADMIN</span></td>
                    <td className="py-4"><span className="bg-primary/20 text-primary px-2 py-1 rounded text-[10px] font-label-caps">ACTIVE</span></td>
                    <td className="py-4 text-outline">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}</td>
                    <td className="py-4 text-right pr-2 text-outline text-xs italic">Protected</td>
                  </tr>
                  
                  {/* Fetched Users */}
                  {users.map((u) => (
                    <tr key={u.id} className={`border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors ${u.status === 'SUSPENDED' ? 'opacity-60' : ''}`}>
                      <td className="py-4 pl-2 font-mono text-tertiary">usr_{u.id}</td>
                      <td className="py-4 text-on-surface">{u.email}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-label-caps ${
                          u.status === 'ACTIVE' ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 text-outline">{u.joined}</td>
                      <td className="py-4 text-right pr-2 flex justify-end gap-2">
                        {u.status === 'ACTIVE' ? (
                          <button 
                            onClick={() => toggleStatus(u.id, 'suspend')}
                            disabled={actionLoading === u.id}
                            className="bg-error/10 hover:bg-error/20 text-error px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            {actionLoading === u.id ? <span className="material-symbols-outlined text-[14px] animate-spin">sync</span> : 'Suspend'}
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleStatus(u.id, 'enable')}
                            disabled={actionLoading === u.id}
                            className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            {actionLoading === u.id ? <span className="material-symbols-outlined text-[14px] animate-spin">sync</span> : 'Enable'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && !usersLoading && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-outline">No additional users found.</td>
                    </tr>
                  )}
                  {usersLoading && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-outline animate-pulse">Loading users...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </TrialGuard>
  );
}
