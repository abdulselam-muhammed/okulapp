"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Icon } from "@/components/atoms";
import { InvoiceModal } from "@/components/organisms";
import { useAuthStore, useToastStore } from "@/lib/stores";
import { downloadInvoice, type InvoiceData } from "@/lib/helpers/invoice";

interface Donation {
  id: number;
  donor_id: number;
  amount: number;
  payment_method: string | null;
  note: string | null;
  created_at: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

const PAYMENT_STYLES: Record<string, string> = {
  stripe: "bg-secondary-fixed text-on-secondary-fixed",
  credit_card: "bg-primary-container text-on-primary-container",
  bank_transfer: "bg-secondary-container text-on-secondary-container",
  cash: "bg-tertiary-container text-on-tertiary-container",
  paypal: "bg-secondary-fixed text-on-secondary-fixed",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getInitials(donation: Donation): string {
  if (donation.first_name && donation.last_name) {
    return (donation.first_name.charAt(0) + donation.last_name.charAt(0)).toUpperCase();
  }
  return "D" + String(donation.donor_id).charAt(0);
}

function getDonorName(donation: Donation): string {
  if (donation.first_name && donation.last_name) {
    return `${donation.first_name} ${donation.last_name}`;
  }
  return `Donor #${donation.donor_id}`;
}

function formatPaymentMethod(method: string | null): string {
  if (!method) return "N/A";
  return method
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function exportToCSV(donations: Donation[]) {
  const headers = ["ID", "Donor Name", "Email", "Amount", "Payment Method", "Note", "Date"];
  const rows = donations.map((d) => [
    d.id,
    getDonorName(d),
    d.email || "",
    d.amount,
    d.payment_method || "",
    (d.note || "").replace(/,/g, ";").replace(/\n/g, " "),
    new Date(d.created_at).toISOString(),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `donations-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DonationsPage() {
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  function toInvoiceData(d: Donation): InvoiceData {
    return {
      id: d.id,
      donor_name: getDonorName(d),
      donor_email: d.email ?? null,
      amount: Number(d.amount),
      payment_method: d.payment_method,
      note: d.note,
      created_at: d.created_at,
    };
  }

  const fetchData = useCallback(async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [donationsRes, balanceRes] = await Promise.all([
        fetch("/api/donations", { headers }),
        fetch("/api/donations/balance", { headers }),
      ]);

      if (!donationsRes.ok) throw new Error("Failed to load donations");
      if (!balanceRes.ok) throw new Error("Failed to load balance");

      const donationsData = await donationsRes.json();
      const balanceData = await balanceRes.json();

      setDonations(donationsData.data ?? []);
      setBalance(Number(balanceData.data?.balance ?? 0));
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to load donation data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchData();
    addToast("Donations refreshed", "success");
  }

  // Live calculations
  const stats = useMemo(() => {
    const total = donations.reduce((sum, d) => sum + Number(d.amount), 0);
    const count = donations.length;
    const avg = count > 0 ? total / count : 0;

    // This month vs last month for growth calculation
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonth = donations
      .filter((d) => new Date(d.created_at) >= thisMonthStart)
      .reduce((sum, d) => sum + Number(d.amount), 0);
    const lastMonth = donations
      .filter((d) => {
        const date = new Date(d.created_at);
        return date >= lastMonthStart && date < thisMonthStart;
      })
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const monthlyGrowth =
      lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : thisMonth > 0 ? 100 : 0;

    // Fund allocation: % of donations still available (not spent on purchases)
    const fundAllocation = total > 0 ? Math.max(0, Math.min(100, (balance / total) * 100)) : 0;

    // Stripe vs other payment methods
    const stripeCount = donations.filter((d) => d.payment_method === "stripe").length;

    // Unique donors
    const uniqueDonors = new Set(donations.map((d) => d.donor_id)).size;

    return { total, count, avg, monthlyGrowth, fundAllocation, stripeCount, uniqueDonors, thisMonth };
  }, [donations, balance]);

  return (
    <>
    <InvoiceModal open={!!invoiceData} onClose={() => setInvoiceData(null)} data={invoiceData} />

    <section className="pt-24 px-10 pb-20 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
            Financial Overview
          </span>
          <h2 className="text-4xl font-extrabold text-on-background font-headline tracking-tight">
            Donations Dashboard
          </h2>
          <p className="text-on-surface-variant max-w-md font-body leading-relaxed">
            Track incoming donations, monitor fund balances, and review financial activity.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-5 py-3 bg-surface-container-lowest text-on-surface rounded-full font-bold flex items-center gap-2 hover:bg-surface-container-high transition-all shadow-sm disabled:opacity-60"
          >
            <Icon name="refresh" className={`text-lg ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => exportToCSV(donations)}
            disabled={donations.length === 0}
            className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10 disabled:opacity-60"
          >
            <Icon name="download" className="text-lg" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface">{formatCurrency(balance)}</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
          </div>
          <p className="text-xs text-on-surface-variant mt-1">Available to spend</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Donations</p>
          <span className="text-3xl font-bold text-on-surface">{stats.count}</span>
          <p className="text-xs text-on-surface-variant mt-1">{stats.uniqueDonors} unique donors</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Donations Sum</p>
          <span className="text-3xl font-bold text-on-surface">{formatCurrency(stats.total)}</span>
          <p className="text-xs text-on-surface-variant mt-1">{stats.stripeCount} via Stripe</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Avg Donation</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface">{formatCurrency(stats.avg)}</span>
            <Icon name="trending_up" className="text-primary text-sm" />
          </div>
          <p className="text-xs text-on-surface-variant mt-1">{formatCurrency(stats.thisMonth)} this month</p>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,58,40,0.05)]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Donor</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Payment</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Note</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Date</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-right">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center text-on-surface-variant">
                      <Icon name="volunteer_activism" className="text-4xl text-on-surface-variant/30 mb-3 block" />
                      <p>No donations yet. Share the donate page to get started!</p>
                    </td>
                  </tr>
                ) : (
                  donations.map((donation, i) => (
                    <tr key={donation.id} className={`hover:bg-surface-bright transition-colors group ${i % 2 === 1 ? "bg-surface-container-low/10" : ""}`}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
                            {getInitials(donation)}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{getDonorName(donation)}</p>
                            {donation.email && (
                              <p className="text-xs text-on-surface-variant">{donation.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-on-surface text-lg">
                          {formatCurrency(Number(donation.amount))}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {donation.payment_method ? (
                          <span className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${PAYMENT_STYLES[donation.payment_method] || "bg-surface-container-high text-on-surface-variant"}`}>
                            {donation.payment_method === "stripe" && <Icon name="bolt" className="text-xs" filled />}
                            {formatPaymentMethod(donation.payment_method)}
                          </span>
                        ) : (
                          <span className="text-sm text-on-surface-variant">—</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant max-w-[240px] truncate">
                        {donation.note || "—"}
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setInvoiceData(toInvoiceData(donation))}
                            className="p-2 hover:bg-primary/10 rounded-full transition-all"
                            title="View invoice"
                          >
                            <Icon name="receipt_long" className="text-stone-400 group-hover:text-primary text-lg" />
                          </button>
                          <button
                            onClick={() => downloadInvoice(toInvoiceData(donation))}
                            className="p-2 hover:bg-secondary/10 rounded-full transition-all"
                            title="Download PDF"
                          >
                            <Icon name="download" className="text-stone-400 group-hover:text-secondary text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Impact Section — REAL DATA */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Icon name="volunteer_activism" className="text-primary text-2xl" filled />
          <h3 className="text-2xl font-bold text-on-surface font-headline">Impact Overview</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)] text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="pie_chart" className="text-primary text-2xl" />
            </div>
            <p className="text-3xl font-bold text-on-surface mb-1">{stats.fundAllocation.toFixed(0)}%</p>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Available Funds</p>
            <p className="text-xs text-on-surface-variant mt-2">
              {formatCurrency(balance)} of {formatCurrency(stats.total)} still available
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)] text-center">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="groups" className="text-secondary text-2xl" />
            </div>
            <p className="text-3xl font-bold text-on-surface mb-1">{stats.uniqueDonors}</p>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Unique Donors</p>
            <p className="text-xs text-on-surface-variant mt-2">
              {stats.count} total contributions
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)] text-center">
            <div className="w-14 h-14 rounded-full bg-tertiary-container flex items-center justify-center mx-auto mb-4">
              <Icon name="trending_up" className="text-on-tertiary-container text-2xl" />
            </div>
            <p className={`text-3xl font-bold mb-1 ${stats.monthlyGrowth >= 0 ? "text-primary" : "text-error"}`}>
              {stats.monthlyGrowth >= 0 ? "+" : ""}{stats.monthlyGrowth.toFixed(0)}%
            </p>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Monthly Growth</p>
            <p className="text-xs text-on-surface-variant mt-2">
              {formatCurrency(stats.thisMonth)} this month
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="flex justify-center py-10">
        <div className="max-w-xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 rounded-full mb-4">
            <Icon name="info" className="text-secondary text-sm" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Financial Transparency</span>
          </div>
          <p className="text-sm text-on-surface-variant italic font-body">
            All donations are tracked in real-time. Stripe payments are processed securely and recorded automatically.
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
