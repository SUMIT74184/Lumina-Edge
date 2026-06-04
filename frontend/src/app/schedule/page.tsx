"use client";

import { useFetch, useMutation } from '@/hooks/useApi';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import TrialGuard from '@/components/TrialGuard';
import Link from 'next/link';
import { useSidebar } from '@/context/SidebarContext';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  status: string;
}

export default function ScheduleDashboard() {
  const { isCollapsed } = useSidebar();
  const today = new Date().toISOString().split('T')[0];
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState({ start: today, end: endOfMonth });
  const { data: events, loading, refetch } = useFetch<CalendarEvent[]>(
    `/time/events?startDate=${dateRange.start}&endDate=${dateRange.end}`
  );
  const { mutate: createEvent, loading: creating } = useMutation('/time/events', 'POST');
  const { mutate: updateEventMutation, loading: updating } = useMutation('/time/events', 'PUT');
  const { mutate: deleteEventMutation, loading: deleting } = useMutation('/time/events', 'DELETE');

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: today,
    startTime: '09:00',
    endDate: today,
    endTime: '10:00',
    isAllDay: false,
    status: 'INCOMPLETE'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    const startISO = `${form.startDate}T${form.startTime}:00.000Z`;
    const endISO = `${form.endDate}T${form.endTime}:00.000Z`;

    const payload = {
      title: form.title,
      description: form.description,
      startTime: startISO,
      endTime: endISO,
      isAllDay: form.isAllDay,
      status: form.status
    };

    if (editingId) {
      await updateEventMutation(payload, `/time/events/${editingId}`);
      setEditingId(null);
    } else {
      await createEvent(payload);
    }
    
    refetch();
    setForm({
      ...form,
      title: '',
      description: ''
    });
  };

  const handleEdit = (ev: CalendarEvent) => {
    setEditingId(ev.id);
    const startObj = new Date(ev.startTime);
    const endObj = new Date(ev.endTime);
    
    setForm({
      title: ev.title,
      description: ev.description || '',
      startDate: startObj.toISOString().split('T')[0],
      startTime: startObj.toISOString().substring(11, 16),
      endDate: endObj.toISOString().split('T')[0],
      endTime: endObj.toISOString().substring(11, 16),
      isAllDay: ev.isAllDay,
      status: ev.status || 'INCOMPLETE'
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEventMutation(null, `/time/events/${id}`);
      refetch();
    }
  };

  return (
    <TrialGuard>
      <div className="min-h-screen bg-background text-on-background">
        <Sidebar />

        <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300 p-8 md:p-margin-desktop`}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-headline-xl text-primary">Time Module</h1>
            <Link 
              href="/history?tab=time" 
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-full transition-all font-label-caps border border-outline-variant shadow-sm group"
            >
              <span className="material-symbols-outlined text-[18px] text-primary group-hover:rotate-12 transition-transform">history</span>
              <span>Analytics & History</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add Event Form */}
            <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <h2 className="font-headline-md text-primary mb-4">{editingId ? 'Edit Event' : 'Add Event'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Title</label>
                  <input 
                    type="text" 
                    value={form.title} 
                    onChange={e => setForm({...form, title: e.target.value})} 
                    required 
                    className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Description</label>
                  <textarea 
                    value={form.description} 
                    onChange={e => setForm({...form, description: e.target.value})} 
                    className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-20 placeholder:text-outline-variant" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Start Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={form.startDate} 
                        onChange={e => setForm({...form, startDate: e.target.value})} 
                        className="w-full bg-surface-container px-3 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm appearance-none [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Start Time</label>
                    <input 
                      type="time" 
                      value={form.startTime} 
                      onChange={e => setForm({...form, startTime: e.target.value})} 
                      className="w-full bg-surface-container px-3 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">End Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={form.endDate} 
                        onChange={e => setForm({...form, endDate: e.target.value})} 
                        className="w-full bg-surface-container px-3 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm appearance-none [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">End Time</label>
                    <input 
                      type="time" 
                      value={form.endTime} 
                      onChange={e => setForm({...form, endTime: e.target.value})} 
                      className="w-full bg-surface-container px-3 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm" 
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 flex-1">
                    <input 
                      type="checkbox" 
                      checked={form.isAllDay} 
                      onChange={e => setForm({...form, isAllDay: e.target.checked})} 
                      id="isAllDay"
                      className="w-5 h-5 bg-surface-container border-2 border-outline-variant rounded text-primary focus:ring-0 cursor-pointer accent-primary transition-all"
                    />
                    <label htmlFor="isAllDay" className="text-sm font-label-caps text-on-surface-variant cursor-pointer select-none">All Day Event</label>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Task Status</label>
                    <div className="relative">
                      <select 
                        value={form.status} 
                        onChange={e => setForm({...form, status: e.target.value})} 
                        className="w-full bg-surface-container px-4 py-2 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer font-bold text-sm"
                      >
                        <option value="INCOMPLETE">Incomplete</option>
                        <option value="MIDWAY">Midway</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant text-sm">expand_more</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={creating || updating} 
                    className="flex-1 bg-primary text-on-primary font-bold py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {creating || updating ? 'Saving...' : editingId ? 'Update' : 'Save'}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm({
                          title: '', description: '', startDate: today, startTime: '09:00', endDate: today, endTime: '10:00', isAllDay: false, status: 'INCOMPLETE'
                        });
                      }}
                      className="px-4 bg-surface-container-high text-on-surface font-bold py-2 rounded hover:bg-surface-container-highest transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Events List */}
            <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-md text-primary">Timeline</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <input 
                      type="date" 
                      value={dateRange.start} 
                      onChange={e => setDateRange({...dateRange, start: e.target.value})} 
                      className="bg-surface-container text-xs px-2 py-1.5 rounded-md border border-outline-variant text-on-surface focus:outline-none focus:border-primary appearance-none [&::-webkit-calendar-picker-indicator]:opacity-50" 
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={dateRange.end} 
                      onChange={e => setDateRange({...dateRange, end: e.target.value})} 
                      className="bg-surface-container text-xs px-2 py-1.5 rounded-md border border-outline-variant text-on-surface focus:outline-none focus:border-primary appearance-none [&::-webkit-calendar-picker-indicator]:opacity-50" 
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <p className="text-outline animate-pulse">Loading events...</p>
              ) : (
                <div className="flex-1 overflow-y-auto max-h-[400px] space-y-2 pr-2">
                  {events && events.length > 0 ? (
                    events.map((ev) => (
                      <div key={ev.id} className="p-4 bg-surface-container rounded-lg border border-outline-variant group relative">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-1">
                            <div className="font-bold text-on-surface">{ev.title}</div>
                            {ev.status === 'COMPLETED' && <span className="text-[10px] font-label-caps bg-primary/20 text-primary px-2 py-0.5 rounded-full w-fit">COMPLETED</span>}
                            {ev.status === 'MIDWAY' && <span className="text-[10px] font-label-caps bg-tertiary/20 text-tertiary px-2 py-0.5 rounded-full w-fit">MIDWAY</span>}
                            {ev.status === 'INCOMPLETE' && <span className="text-[10px] font-label-caps bg-error/20 text-error px-2 py-0.5 rounded-full w-fit">INCOMPLETE</span>}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(ev)} className="material-symbols-outlined text-sm p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container-high">edit</button>
                            <button onClick={() => handleDelete(ev.id)} disabled={deleting} className="material-symbols-outlined text-sm p-1 text-on-surface-variant hover:text-error rounded hover:bg-surface-container-high">delete</button>
                          </div>
                        </div>
                        {ev.description && <p className="text-sm text-outline mt-1">{ev.description}</p>}
                        <div className="text-[10px] font-label-caps text-primary mt-2">
                          {new Date(ev.startTime).toLocaleString()} - {new Date(ev.endTime).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-outline text-sm">No events scheduled in this range.</p>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </TrialGuard>
  );
}
