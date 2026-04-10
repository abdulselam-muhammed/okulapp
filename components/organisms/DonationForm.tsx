"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Icon } from "@/components/atoms";
import { useAuthStore, useToastStore } from "@/lib/stores";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const PRESET_AMOUNTS = [25, 50, 100, 250];

function CheckoutForm({ amount, note }: { amount: number; note: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);

  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;
    if (!agreed) {
      addToast("Please agree to the Terms of Service");
      return;
    }

    setLoading(true);

    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      addToast(error.message || "Payment failed", "error");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Record donation in our database
      try {
        const res = await fetch("/api/donations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            payment_method: "stripe",
            note: note || `Stripe payment ${paymentIntent.id}`,
          }),
        });

        if (res.ok) {
          addToast("Thank you for your donation!", "success");
          router.push("/donate/result?status=success");
        } else {
          addToast("Payment succeeded but failed to record. Contact support.", "error");
        }
      } catch {
        addToast("Payment succeeded but server error occurred", "error");
      }
    } else {
      addToast("Payment not completed", "error");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <label className="flex items-center gap-3 cursor-pointer group pt-4">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container"
        />
        <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
          I agree to the Terms of Service and Privacy Policy.
        </span>
      </label>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-primary text-on-primary rounded-full py-5 font-headline font-bold text-lg shadow-xl shadow-primary/10 hover:bg-primary-dim hover:scale-[1.01] transition-all flex items-center justify-center gap-3 group disabled:opacity-60 disabled:pointer-events-none"
      >
        <span>{loading ? "Processing..." : `Donate $${amount.toFixed(2)}`}</span>
        {!loading && <Icon name="favorite" className="group-hover:translate-x-1 transition-transform" />}
      </button>
      <p className="text-center text-xs text-on-surface-variant/60 mt-4 flex items-center justify-center gap-1">
        <Icon name="lock" className="text-sm" />
        Encrypted 256-bit SSL Secure Payment via Stripe
      </p>
    </form>
  );
}

export default function DonationForm() {
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);

  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [note, setNote] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentAmount, setIntentAmount] = useState<number>(0);

  async function initializePayment() {
    if (!token) {
      addToast("Please sign in to donate", "error");
      return;
    }
    if (amount < 1) {
      addToast("Amount must be at least $1", "error");
      return;
    }

    setLoadingIntent(true);
    try {
      const res = await fetch("/api/donations/create-payment-intent", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();

      if (data.success) {
        setClientSecret(data.data.clientSecret);
        setIntentAmount(amount);
      } else {
        addToast(data.error?.message || "Failed to initialize payment", "error");
      }
    } catch {
      addToast("Unable to connect to payment server", "error");
    } finally {
      setLoadingIntent(false);
    }
  }

  // Reset payment intent when amount changes
  useEffect(() => {
    if (clientSecret && amount !== intentAmount) {
      setClientSecret(null);
    }
  }, [amount, clientSecret, intentAmount]);

  function selectPreset(preset: number) {
    setAmount(preset);
    setCustomAmount("");
  }

  function handleCustomAmount(val: string) {
    const clean = val.replace(/[^\d.]/g, "");
    setCustomAmount(clean);
    const num = parseFloat(clean);
    if (!isNaN(num) && num > 0) setAmount(num);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* Left Column: Form */}
      <div className="w-full lg:w-2/3 space-y-10">
        <header>
          <span className="text-on-surface-variant font-label text-sm uppercase tracking-widest font-bold mb-2 block">Secure Checkout</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight font-headline">Complete Your Gift</h1>
          <p className="text-on-surface-variant mt-4 max-w-lg leading-relaxed">
            Your contribution directly supports the medical care, nutrition, and housing of our campus sanctuary residents.
          </p>
        </header>

        {/* Amount Selector */}
        <div className="bg-surface-container-low rounded-lg p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <Icon name="volunteer_activism" />
            </div>
            <h2 className="text-2xl font-bold font-headline text-on-background">Select Amount</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`py-4 rounded-xl font-bold text-lg transition-all ${
                  amount === preset && !customAmount
                    ? "bg-primary text-on-primary shadow-lg scale-105"
                    : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface-variant ml-1">Custom Amount</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
              <input
                type="text"
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                placeholder="Enter custom amount"
                className="w-full bg-surface-container-lowest border-none rounded-md pl-12 pr-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface-variant ml-1">Message (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Leave a note with your donation..."
              rows={2}
              className="w-full bg-surface-container-lowest border-none rounded-md px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all outline-none resize-none"
            />
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-surface-container-low rounded-lg p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <Icon name="payments" />
            </div>
            <h2 className="text-2xl font-bold font-headline text-on-background">Payment Information</h2>
          </div>

          {!clientSecret ? (
            <button
              type="button"
              onClick={initializePayment}
              disabled={loadingIntent || amount < 1}
              className="w-full bg-primary text-on-primary rounded-full py-5 font-headline font-bold text-lg shadow-xl shadow-primary/10 hover:bg-primary-dim transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loadingIntent ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <Icon name="arrow_forward" />
                </>
              )}
            </button>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#44674e",
                    colorBackground: "#ffffff",
                    colorText: "#003a28",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <CheckoutForm amount={intentAmount} note={note} />
            </Elements>
          )}
        </div>
      </div>

      {/* Right Column: Summary */}
      <aside className="w-full lg:w-1/3 lg:sticky lg:top-32">
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-2xl shadow-primary/5">
          <div className="h-48 relative">
            <img
              className="w-full h-full object-cover"
              alt="Happy dog on campus"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLKB_gPD7V4e4iimPfJ7lWzqLasIx1mfzc8oI9jBAZMJMBWU_5Iq7CmuSJcaH46oWVn2cQbKWFU_BmUwv8U3GofvrluYdt18Iyj9yfAt8HI5jehTXndHRczru2jzoMOo-x-mgEnJeXfpEZHdUGrOLpHpsV6Ze5p_n5PLuEVJth2DzAW_NitE-U6OgLpB9H7x3CsSqh0F2KrNkT_QfkGggC7ZhnUqkAizyiS8V5SbutauBoY2H7VKbzvqQz4ORqz4xGo8V-T8R9Bv0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
          </div>
          <div className="p-8 space-y-6">
            <h3 className="text-xl font-bold font-headline text-on-background">Donation Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>One-time Donation</span>
                <span className="font-bold text-on-surface">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Processing Fee</span>
                <span className="font-bold text-on-surface">$0.00</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Campus Fund Allocation</span>
                <span className="font-bold text-on-surface">100%</span>
              </div>
            </div>
            <div className="pt-6 border-t border-surface-container-highest border-dashed">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-outline">Total Amount</p>
                  <p className="text-4xl font-extrabold font-headline text-primary">${amount.toFixed(2)}</p>
                </div>
                <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-xs font-bold font-headline">USD</div>
              </div>
            </div>
            <div className="bg-surface-bright rounded-lg p-5 space-y-3">
              <div className="flex items-start gap-3">
                <Icon name="eco" className="text-secondary" filled />
                <p className="text-sm leading-relaxed text-on-surface-variant italic">
                  &quot;This donation will provide high-quality organic feed for our campus animals.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3 text-on-surface-variant/70 text-sm">
          <Icon name="shield" />
          <span>Powered by Stripe — PCI Compliant</span>
        </div>
      </aside>
    </div>
  );
}
