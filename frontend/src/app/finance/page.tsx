"use client";

import { useFetch, useMutation } from '@/hooks/useApi';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import TrialGuard from '@/components/TrialGuard';
import Link from 'next/link';
import { useSidebar } from '@/context/SidebarContext';

interface FinanceTransaction {
  id: string;
  amount: number;
  transaction_type: 'INCOME' | 'EXPENSE';
  category: string;
  transaction_date: string;
  notes?: string;
}

interface TransactionsResponse {
  content: FinanceTransaction[];
}

interface FinanceSummary {
  totalIncome?: number;
  totalExpense?: number;
  netSavings?: number;
}

export default function FinanceDashboard() {
  const { isCollapsed } = useSidebar();
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const { data: summary, loading: summaryLoading } = useFetch<FinanceSummary>(`/finance/summary?month=${currentMonth}`);
  const { data: transactions, loading: txLoading, refetch: refetchTx } = useFetch<TransactionsResponse>(`/finance/transactions`);
  const { mutate: createTransaction, loading: creating } = useMutation('/finance/transactions', 'POST');
  const { mutate: updateTransactionMutation, loading: updating } = useMutation('/finance/transactions', 'PUT');
  const { mutate: deleteTransactionMutation, loading: deleting } = useMutation('/finance/transactions', 'DELETE');

  const [form, setForm] = useState({ 
    amount: '', 
    type: 'EXPENSE', 
    category: '', 
    date: new Date().toISOString().split('T')[0], 
    notes: '' 
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    
    const payload = {
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      notes: form.notes
    };

    if (editingId) {
      await updateTransactionMutation(payload, `/finance/transactions/${editingId}`);
      setEditingId(null);
    } else {
      await createTransaction(payload);
    }
    
    refetchTx();
    setForm({ amount: '', type: 'EXPENSE', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
  };

  const handleEdit = (tx: FinanceTransaction) => {
    setEditingId(tx.id);
    setForm({
      amount: tx.amount.toString(),
      type: tx.transaction_type,
      category: tx.category,
      date: tx.transaction_date,
      notes: tx.notes || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransactionMutation(null, `/finance/transactions/${id}`);
      refetchTx();
    }
  };

  return (
    <TrialGuard>
      <div className="min-h-screen bg-background text-on-background">
        <Sidebar />
        <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300 p-8 md:p-margin-desktop`}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-headline-xl text-primary">Finance Module</h1>
            <Link 
              href="/history?tab=finance" 
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-full transition-all font-label-caps border border-outline-variant shadow-sm group"
            >
              <span className="material-symbols-outlined text-[18px] text-primary group-hover:rotate-12 transition-transform">history</span>
              <span>Analytics & History</span>
            </Link>
          </div>

          {/* Summary Section */}
          <section className="mb-12">
            <h2 className="font-headline-lg text-primary-container mb-4">Monthly Summary ({currentMonth})</h2>
            {summaryLoading ? (
              <div className="h-20 bg-surface-container animate-pulse rounded-xl"></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
                  <span className="text-xs font-label-caps text-outline">TOTAL INCOME</span>
                  <div className="text-2xl font-bold text-primary mt-2">₹{summary?.totalIncome?.toLocaleString() || '0.00'}</div>
                </div>
                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
                  <span className="text-xs font-label-caps text-outline">TOTAL EXPENSE</span>
                  <div className="text-2xl font-bold text-error mt-2">₹{summary?.totalExpense?.toLocaleString() || '0.00'}</div>
                </div>
                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
                  <span className="text-xs font-label-caps text-outline">NET SAVINGS</span>
                  <div className="text-2xl font-bold text-on-surface mt-2">₹{summary?.netSavings?.toLocaleString() || '0.00'}</div>
                </div>
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Transaction Form */}
            <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant shadow-sm">
              <h2 className="font-headline-md text-primary mb-6">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Amount (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">₹</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={form.amount} 
                        onChange={e => setForm({...form, amount: e.target.value})} 
                        required 
                        className="w-full bg-surface-container pl-8 pr-3 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-data-display" 
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={form.date} 
                        onChange={e => setForm({...form, date: e.target.value})} 
                        required 
                        className="w-full bg-surface-container px-3 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm appearance-none [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100" 
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Transaction Type</label>
                  <div className="relative">
                    <select 
                      value={form.type} 
                      onChange={e => setForm({...form, type: e.target.value})} 
                      className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer font-bold"
                    >
                      <option value="EXPENSE">EXPENSE</option>
                      <option value="INCOME">INCOME</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">expand_more</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Category</label>
                  <input 
                    type="text" 
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})} 
                    required 
                    className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant" 
                    placeholder="e.g. Food, Rent, Salary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Notes</label>
                  <input 
                    type="text" 
                    value={form.notes} 
                    onChange={e => setForm({...form, notes: e.target.value})} 
                    className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant" 
                    placeholder="Optional notes"
                  />
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
                        setForm({ amount: '', type: 'EXPENSE', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
                      }}
                      className="px-4 bg-surface-container-high text-on-surface font-bold py-2 rounded hover:bg-surface-container-highest transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Transactions List */}
            <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <h2 className="font-headline-md text-primary mb-4">Recent Transactions</h2>
              {txLoading ? (
                <p className="text-outline animate-pulse">Loading transactions...</p>
              ) : (
                <div className="overflow-y-auto max-h-[400px] space-y-2 pr-2">
                  {transactions?.content && transactions.content.length > 0 ? (
                    transactions.content.map((tx) => (
                      <div key={tx.id} className="flex justify-between items-center p-4 bg-surface-container rounded-lg border border-outline-variant group">
                        <div>
                          <div className="font-bold text-on-surface">{tx.category}</div>
                          <div className="text-xs text-outline mt-1">{tx.transaction_date} {tx.notes && `• ${tx.notes}`}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`font-data-display font-bold ${tx.transaction_type === 'EXPENSE' ? 'text-error' : 'text-primary'}`}>
                            {tx.transaction_type === 'EXPENSE' ? '-' : '+'}₹{tx.amount}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(tx)} className="material-symbols-outlined text-sm p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container-high">edit</button>
                            <button onClick={() => handleDelete(tx.id)} disabled={deleting} className="material-symbols-outlined text-sm p-1 text-on-surface-variant hover:text-error rounded hover:bg-surface-container-high">delete</button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-outline text-sm">No transactions logged yet.</p>
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
