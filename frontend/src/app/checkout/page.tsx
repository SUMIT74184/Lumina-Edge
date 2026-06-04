"use client";

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { UserButton } from '@clerk/nextjs';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') || 'elite';

  const [tab, setTab] = useState<'upi' | 'card'>('upi');
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Define plan configuration
  const planDetails: Record<string, { name: string; period: string; price: number; subtotal: number; gst: number; features: string[] }> = {
    solo: {
      name: "SOLO SPRINT",
      period: "Monthly Performance Bundle",
      price: 120.00,
      subtotal: 101.69,
      gst: 18.31,
      features: [
        "Core Performance Hub",
        "3D Visualization",
        "Community Support",
        "Standard Export"
      ]
    },
    elite: {
      name: "ELITE CORE",
      period: "Quarterly Performance Bundle",
      price: 250.00,
      subtotal: 211.86,
      gst: 38.14,
      features: [
        "3D Visualization",
        "Advanced Analytics",
        "Real-time Synchronization",
        "Priority Email Support"
      ]
    },
    max: {
      name: "MOMENTUM MAX",
      period: "Annual Performance Bundle",
      price: 1320.00,
      subtotal: 1118.64,
      gst: 201.36,
      features: [
        "Advanced Analytics",
        "Unlimited Modules",
        "Priority Developer Access",
        "CNS Fatigue Analysis"
      ]
    }
  };

  const selectedPlan = planDetails[plan] || planDetails.elite;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan.name,
          amount: selectedPlan.price,
          method: tab,
        }),
      });
      
      if (res.ok) {
        alert('Payment authorized successfully! Welcome to the Elite Edge.');
        router.push('/');
      } else {
        alert('Payment processing failed. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-gutter relative">
      {processing && (
        <div className="absolute inset-0 bg-background/80 z-50 flex flex-col items-center justify-center gap-4 rounded-xl">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-label-caps text-label-caps text-primary tracking-widest animate-pulse">PROCESSING TRANSACTION...</p>
        </div>
      )}

      {/* Payment Section (Left) */}
      <section className="md:col-span-7 flex flex-col gap-stack-lg">
        <header>
          <h1 className="font-headline-lg text-headline-lg mb-2 text-on-surface">Complete Checkout</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Select your preferred payment method to activate elite performance tracking.</p>
        </header>

        {/* Payment Method Toggles */}
        <div className="grid grid-cols-2 gap-stack-md">
          <button
            type="button"
            className={`flex flex-col items-start p-stack-md bg-surface-container-low border-2 ${tab === 'upi' ? 'border-primary' : 'border-outline-variant opacity-60'} rounded-lg transition-all duration-200`}
            id="tab-upi"
            onClick={() => setTab('upi')}
          >
            <span className="material-symbols-outlined text-primary mb-2">qr_code_2</span>
            <span className="font-label-caps text-label-caps">UPI / QR</span>
          </button>
          <button
            type="button"
            className={`flex flex-col items-start p-stack-md bg-surface-container-lowest border-2 ${tab === 'card' ? 'border-primary' : 'border-outline-variant opacity-60'} rounded-lg transition-all duration-200`}
            id="tab-card"
            onClick={() => setTab('card')}
          >
            <span className="material-symbols-outlined text-on-surface-variant mb-2">credit_card</span>
            <span className="font-label-caps text-label-caps">Credit / Debit Card</span>
          </button>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* UPI Input Area */}
          <div className={`${tab === 'upi' ? 'flex' : 'hidden'} flex-col gap-stack-md animate-in fade-in duration-300`} id="content-upi">
            <div className="p-stack-lg bg-surface-container-low rounded-lg border border-outline-variant/30 flex flex-col items-center gap-stack-md">
              <div className="bg-white p-4 rounded-xl shadow-2xl">
                <img alt="QR Code" className="w-40 h-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe92khM9TFgvuz2KwuZvVFL9ujbNJmUhwmNcSH0kTfciqbfWQShsjzEuqX1RFU6088aRitnwbzDZMqlRCrLpUFEHTkJoTZsrOQDnj7ahzG4fkp2-6s0W0INnZx-me4DWwl6LNp3q7KmfMXlfb6WaCITnBoScOy9ZgfOCjm2C40dHQFIJmzYjOHhGLNE8-deKh5Y5je1iUiRnUGQUCn2Vp5ytarNVQ24begXjfnMGOgB1U3UlfrjPBQSfPO5oMAPP4avpbifMEn39c" />
              </div>
              <p className="font-label-caps text-label-caps text-outline text-center">Scan to pay with any UPI app</p>
            </div>
            <div className="relative">
              <label className="font-label-caps text-label-caps text-outline-variant mb-2 block">Or Enter VPA (UPI ID)</label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-stack-md font-data-display text-data-display focus:border-primary transition-colors text-on-surface"
                placeholder="username@bankname"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required={tab === 'upi'}
              />
              <button type="button" className="absolute right-3 top-[34px] font-label-caps text-label-caps text-primary hover:text-white transition-colors">VERIFY</button>
            </div>
          </div>

          {/* Card Input Area */}
          <div className={`${tab === 'card' ? 'flex' : 'hidden'} flex-col gap-stack-md animate-in fade-in duration-300`} id="content-card">
            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-caps text-label-caps text-outline-variant">Cardholder Name</label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-stack-md font-data-display text-data-display uppercase text-on-surface"
                placeholder="EX: ALEXANDER VANCE"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required={tab === 'card'}
              />
            </div>
            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-caps text-label-caps text-outline-variant">Card Number</label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-stack-md font-data-display text-data-display text-on-surface"
                  placeholder="0000 0000 0000 0000"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required={tab === 'card'}
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant">credit_card</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-stack-md">
              <div className="flex flex-col gap-stack-sm">
                <label className="font-label-caps text-label-caps text-outline-variant">Expiry Date</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-stack-md font-data-display text-data-display text-on-surface"
                  placeholder="MM / YY"
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required={tab === 'card'}
                />
              </div>
              <div className="flex flex-col gap-stack-sm">
                <label className="font-label-caps text-label-caps text-outline-variant">CVV</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-stack-md font-data-display text-data-display text-on-surface"
                  placeholder="***"
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required={tab === 'card'}
                />
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="mt-4">
            <button type="submit" className="w-full py-5 bg-on-surface text-surface font-headline-md text-headline-md font-bold uppercase tracking-widest hover:bg-white hover:text-black active:scale-[0.98] transition-all rounded-lg shadow-lg">
              Authorize Payment
            </button>
            <div className="flex items-center justify-center gap-2 mt-stack-md text-outline">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span className="font-label-caps text-[10px] tracking-widest">SSL SECURED 256-BIT ENCRYPTION</span>
            </div>
          </div>
        </form>
      </section>

      {/* Summary Section (Right) */}
      <aside className="md:col-span-5">
        <div className="bg-surface-container rounded-lg p-stack-lg border border-outline-variant/20 sticky top-32">
          <div className="flex flex-col gap-stack-lg">
            <div>
              <h2 className="font-label-caps text-label-caps text-primary mb-4 tracking-[0.2em]">PLAN SUMMARY</h2>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">{selectedPlan.name}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{selectedPlan.period}</p>
                </div>
                <span className="font-data-display text-headline-md font-bold text-on-surface">₹{selectedPlan.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="h-px bg-outline-variant/30"></div>

            <ul className="flex flex-col gap-stack-sm">
              {selectedPlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-stack-md">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="h-px bg-outline-variant/30"></div>

            <div className="flex flex-col gap-stack-sm">
              <div className="flex justify-between font-body-sm text-body-sm text-outline">
                <span>Subtotal</span>
                <span className="font-data-display">₹{selectedPlan.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body-sm text-body-sm text-outline">
                <span>GST (18%)</span>
                <span className="font-data-display">₹{selectedPlan.gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-headline-md text-headline-md font-bold text-on-surface mt-2">
                <span>TOTAL</span>
                <span className="font-data-display">₹{selectedPlan.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-surface-container-high p-stack-md rounded flex items-start gap-stack-md border-l-2 border-primary">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="font-body-sm text-[12px] leading-relaxed text-on-surface-variant">
                By authorizing payment, you agree to the auto-renewal terms. Your next billing will be processed accordingly. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* TopNavBar (Shell) */}
      <nav className="flex justify-between items-center w-full px-margin-desktop py-stack-md bg-surface dark:bg-surface-dim sticky top-0 z-50 border-b border-outline-variant">
        <div className="flex items-center gap-stack-md">
          <Link href="/" className="font-headline-md text-headline-md font-black italic text-on-surface hover:text-primary transition-colors">
            Lumina Edge
          </Link>
          <div className="h-6 w-px bg-outline-variant mx-4"></div>
          <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">Secure Gateway</span>
        </div>
        <div className="flex items-center gap-stack-md">
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all p-2">notifications</button>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all p-2">settings</button>
          <div className="ml-2 flex items-center justify-center">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
          </div>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto px-margin-desktop py-stack-lg min-h-[calc(100vh-140px)]">
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <CheckoutForm />
        </Suspense>
      </main>

      {/* Footer (Shell) */}
      <footer className="w-full bg-surface-container-lowest dark:bg-black border-t border-outline-variant px-margin-desktop py-stack-lg flex flex-col md:flex-row justify-between items-center gap-stack-md mt-stack-lg">
        <span className="font-label-caps text-label-caps font-bold text-outline">Lumina Edge</span>
        <div className="flex gap-gutter">
          <a className="font-body-sm text-body-sm font-label-caps text-outline hover:text-primary transition-colors" href="#">Legal</a>
          <a className="font-body-sm text-body-sm font-label-caps text-outline hover:text-primary transition-colors" href="#">Support</a>
          <a className="font-body-sm text-body-sm font-label-caps text-outline hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-body-sm text-body-sm font-label-caps text-outline hover:text-primary transition-colors" href="#">Terms of Service</a>
        </div>
        <p className="font-body-sm text-body-sm font-label-caps text-outline opacity-60">© 2026 Lumina Edge Velocity. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
