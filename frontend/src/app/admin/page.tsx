"use client";

import Sidebar from '@/components/Sidebar';
import TrialGuard from '@/components/TrialGuard';
import { useSidebar } from '@/context/SidebarContext';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useFetch, useMutation } from '@/hooks/useApi';
import { useEffect, useState } from 'react';

interface AdminMetrics {
  totalTransactions: number;
  totalEvents: number;
  totalWorkouts: number;
  globalARR: number;
}

interface AdminAnalytics {
  totalUsers: number;
  totalTransactions: number;
  totalEvents: number;
  totalWorkouts: number;
  totalNutritionLogs: number;
  totalActivityEvents: number;
}

interface UserDto {
  id: string;
  userId: string;
  email: string;
  status: string;
  joinedAt: string;
}

const ADMIN_EMAIL = 'jaiprakashray747@gmail.com';

export default function AdminPanel() {
  const { isCollapsed } = useSidebar();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Data fetching via proper hooks (with X-User-Id header)
  const { data: metrics, loading: metricsLoading } = useFetch<AdminMetrics>('/admin/metrics');
  const { data: analytics, loading: analyticsLoading } = useFetch<AdminAnalytics>('/admin/analytics');
  const { data: users, loading: usersLoading, refetch: refetchUsers } = useFetch<UserDto[]>('/admin/users');

  // Mutations
  const { mutate: addMemberMutate, loading: addingMember } = useMutation<UserDto>('/admin/users', 'POST');
  const { mutate: suspendMutate, loading: suspending } = useMutation<UserDto>('/admin/users', 'PUT');
  const { mutate: enableMutate, loading: enabling } = useMutation<UserDto>('/admin/users', 'PUT');

  // Add member form
  const [newEmail, setNewEmail] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Action loading per-user
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || user?.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin text-primary material-symbols-outlined text-4xl">sync</div>
      </div>
    );
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);
    if (!newEmail.trim()) return;

    try {
      await addMemberMutate({ email: newEmail.trim() });
      setAddSuccess(`Member "${newEmail}" added successfully!`);
      setNewEmail('');
      refetchUsers();
    } catch (err: any) {
      setAddError(err?.message || 'Failed to add member');
    }
  };

  const handleSuspend = async (id: string) => {
    setActionLoadingId(id);
    try {
      await suspendMutate(null, `/admin/users/${id}/suspend`);
      refetchUsers();
    } catch (err) {
      console.error('Suspend failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleEnable = async (id: string) => {
    setActionLoadingId(id);
    try {
      await enableMutate(null, `/admin/users/${id}/enable`);
      refetchUsers();
    } catch (err) {
      console.error('Enable failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <TrialGuard>
      <div className="min-h-screen bg-background text-on-background">
        <Sidebar />
        <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-8 md:p-margin-desktop transition-all duration-300`}>
          <header className="mb-12">
            <h1 className="font-headline-xl text-primary mb-2">Admin Control Center</h1>
            <p className="text-outline">System-wide metrics, user management, and analytics.</p>
          </header>

          {/* Metrics Cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-tertiary mb-2 text-3xl">payments</span>
              <div className="text-xs font-label-caps text-outline">TOTAL TRANSACTIONS</div>
              <div className="text-3xl font-data-display mt-2 text-on-surface">
                {metricsLoading ? '...' : metrics?.totalTransactions || 0}
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">account_balance</span>
              <div className="text-xs font-label-caps text-outline">GLOBAL ARR</div>
              <div className="text-3xl font-data-display mt-2 text-primary">
                {metricsLoading ? '...' : `₹${metrics?.globalARR?.toLocaleString() || 0}`}
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-tertiary mb-2 text-3xl">event</span>
              <div className="text-xs font-label-caps text-outline">TOTAL EVENTS</div>
              <div className="text-3xl font-data-display mt-2 text-on-surface">
                {metricsLoading ? '...' : metrics?.totalEvents || 0}
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-tertiary mb-2 text-3xl">fitness_center</span>
              <div className="text-xs font-label-caps text-outline">TOTAL WORKOUTS</div>
              <div className="text-3xl font-data-display mt-2 text-on-surface">
                {metricsLoading ? '...' : metrics?.totalWorkouts || 0}
              </div>
            </div>
          </section>

          {/* Analytics Overview */}
          <section className="mb-12">
            <h2 className="font-headline-md text-on-surface mb-6">Platform Analytics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Users', value: analytics?.totalUsers, icon: 'group', color: 'text-primary' },
                { label: 'Transactions', value: analytics?.totalTransactions, icon: 'receipt_long', color: 'text-tertiary' },
                { label: 'Calendar Events', value: analytics?.totalEvents, icon: 'calendar_month', color: 'text-primary' },
                { label: 'Workouts', value: analytics?.totalWorkouts, icon: 'fitness_center', color: 'text-tertiary' },
                { label: 'Nutrition Logs', value: analytics?.totalNutritionLogs, icon: 'restaurant', color: 'text-primary' },
                { label: 'Activity Events', value: analytics?.totalActivityEvents, icon: 'touch_app', color: 'text-tertiary' },
              ].map((metric, i) => (
                <div key={i} className="bg-surface-container p-4 rounded-xl border border-outline-variant text-center">
                  <span className={`material-symbols-outlined ${metric.color} text-2xl mb-2 block`}>{metric.icon}</span>
                  <div className="text-xl font-data-display text-on-surface">
                    {analyticsLoading ? '...' : metric.value || 0}
                  </div>
                  <div className="text-[10px] font-label-caps text-outline mt-1">{metric.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Add Member Section */}
          <section className="mb-12 bg-surface-container-low p-6 rounded-xl border border-outline-variant">
            <h2 className="font-headline-md text-on-surface mb-4">Add New Member</h2>
            <form onSubmit={handleAddMember} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-label-caps text-outline mb-2 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  placeholder="user@example.com"
                  className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                />
              </div>
              <button
                type="submit"
                disabled={addingMember}
                className="bg-primary text-on-primary font-bold py-3 px-6 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                {addingMember ? (
                  <><span className="material-symbols-outlined text-sm animate-spin">sync</span> Adding...</>
                ) : (
                  <><span className="material-symbols-outlined text-sm">person_add</span> Add Member</>
                )}
              </button>
            </form>
            {addError && (
              <div className="mt-3 text-error text-sm bg-error/10 px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span> {addError}
              </div>
            )}
            {addSuccess && (
              <div className="mt-3 text-primary text-sm bg-primary/10 px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span> {addSuccess}
              </div>
            )}
          </section>

          {/* User Management */}
          <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-on-surface">User Management</h2>
              <button
                onClick={() => refetchUsers()}
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
                    <td className="py-4 text-on-surface">
                      {user?.primaryEmailAddress?.emailAddress || 'admin@lumina.edge'}{' '}
                      <span className="ml-2 bg-tertiary/20 text-tertiary px-2 py-1 rounded text-[10px] font-label-caps">ADMIN</span>
                    </td>
                    <td className="py-4"><span className="bg-primary/20 text-primary px-2 py-1 rounded text-[10px] font-label-caps">ACTIVE</span></td>
                    <td className="py-4 text-outline">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}</td>
                    <td className="py-4 text-right pr-2 text-outline text-xs italic">Protected</td>
                  </tr>

                  {/* Fetched Users */}
                  {users?.map((u) => (
                    <tr key={u.id} className={`border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors ${u.status === 'SUSPENDED' ? 'opacity-60' : ''}`}>
                      <td className="py-4 pl-2 font-mono text-tertiary">{u.userId?.substring(0, 12) || u.id.substring(0, 12)}</td>
                      <td className="py-4 text-on-surface">{u.email}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-label-caps ${
                          u.status === 'ACTIVE' ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 text-outline">{u.joinedAt}</td>
                      <td className="py-4 text-right pr-2">
                        {u.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleSuspend(u.id)}
                            disabled={actionLoadingId === u.id}
                            className="bg-error/10 hover:bg-error/20 text-error px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 ml-auto"
                          >
                            {actionLoadingId === u.id ? (
                              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                            ) : (
                              'Suspend'
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnable(u.id)}
                            disabled={actionLoadingId === u.id}
                            className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 ml-auto"
                          >
                            {actionLoadingId === u.id ? (
                              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                            ) : (
                              'Activate'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {(!users || users.length === 0) && !usersLoading && (
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
