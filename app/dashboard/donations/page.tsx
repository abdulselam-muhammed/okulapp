"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms";
import { useAuthStore, useToastStore } from "@/lib/stores";

interface Donation {
  id: number;
  donor_id: number;
  amount: number;
  payment_method: string | null;
  note: string | null;
  created_at: string;
  first_name?: string;
  last_name?: string;
}

const PAYMENT_STYLES: Record<string, string> = {
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
    return donation.first_name.charAt(0) + donation.last_name.charAt(0);
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

export default function DonationsPage() {
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    async function fetchData() {
      setLoading(true);
      try {
        const [donationsRes, balanceRes] = await Promise.all([
          fetch("/api/donations", { headers }),
          fetch("/api/donations/balance", { headers }),
        ]);

        if (!donationsRes.ok) {
          const err = await donationsRes.json();
          throw new Error(err.error?.message || "Failed to load donations");
        }
        if (!balanceRes.ok) {
          const err = await balanceRes.json();
          throw new Error(err.error?.message || "Failed to load balance");
        }

        const donationsData = await donationsRes.json();
        const balanceData = await balanceRes.json();

        setDonations(donationsData.data ?? []);
        setBalance(balanceData.data?.balance ?? 0);
      } catch (err) {
        addToast(
          err instanceof Error ? err.message : "Failed to load donation data",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token, addToast]);

  const totalDonationsAmount = donations.reduce(
    (sum, d) => sum + Number(d.amount),
    0
  );

  return (
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
            Track incoming donations, monitor fund balances, and review
            financial activity across the organization.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10">
            <Icon name="download" className="text-lg" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Total Balance
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface">
              {formatCurrency(balance)}
            </span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Total Donations
          </p>
          <span className="text-3xl font-bold text-on-surface">
            {donations.length}
          </span>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Donations Sum
          </p>
          <span className="text-3xl font-bold text-on-surface">
            {formatCurrency(totalDonationsAmount)}
          </span>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Avg Donation
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface">
              {donations.length > 0
                ? formatCurrency(totalDonationsAmount / donations.length)
                : "$0.00"}
            </span>
            <Icon name="trending_up" className="text-primary text-sm" />
          </div>
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
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Donor Name
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Amount
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Payment Method
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Note
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-16 text-center text-on-surface-variant"
                    >
                      No donations found.
                    </td>
                  </tr>
                ) : (
                  donations.map((donation, i) => (
                    <tr
                      key={donation.id}
                      className={`hover:bg-surface-bright transition-colors group ${
                        i % 2 === 1 ? "bg-surface-container-low/10" : ""
                      }`}
                    >
                      {/* Donor Name with Avatar */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
                            {getInitials(donation)}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">
                              {getDonorName(donation)}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              ID: {donation.donor_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-8 py-5">
                        <span className="font-bold text-on-surface text-lg">
                          {formatCurrency(Number(donation.amount))}
                        </span>
                      </td>

                      {/* Payment Method Badge */}
                      <td className="px-8 py-5">
                        {donation.payment_method ? (
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-full ${
                              PAYMENT_STYLES[donation.payment_method] ||
                              "bg-surface-container-high text-on-surface-variant"
                            }`}
                          >
                            {formatPaymentMethod(donation.payment_method)}
                          </span>
                        ) : (
                          <span className="text-sm text-on-surface-variant">
                            --
                          </span>
                        )}
                      </td>

                      {/* Note */}
                      <td className="px-8 py-5 text-sm text-on-surface-variant max-w-[200px] truncate">
                        {donation.note || "--"}
                      </td>

                      {/* Date */}
                      <td className="px-8 py-5 text-sm text-on-surface-variant">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-5 text-right">
                        <button
                          className="p-2 hover:bg-surface-container-high rounded-full transition-all"
                          title="View details"
                        >
                          <Icon
                            name="visibility"
                            className="text-stone-400 group-hover:text-primary"
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Impact Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Icon name="volunteer_activism" className="text-primary text-2xl" />
          <h3 className="text-2xl font-bold text-on-surface font-headline">
            Impact Overview
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)] text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="pie_chart" className="text-primary text-2xl" />
            </div>
            <p className="text-3xl font-bold text-on-surface mb-1">85%</p>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Fund Allocation
            </p>
            <p className="text-xs text-on-surface-variant mt-2">
              Directly supports animal rescue operations and veterinary care
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)] text-center">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="pets" className="text-secondary text-2xl" />
            </div>
            <p className="text-3xl font-bold text-on-surface mb-1">127</p>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Animals Helped
            </p>
            <p className="text-xs text-on-surface-variant mt-2">
              Total animals rescued and treated through donation funding
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)] text-center">
            <div className="w-14 h-14 rounded-full bg-tertiary-container flex items-center justify-center mx-auto mb-4">
              <Icon
                name="trending_up"
                className="text-on-tertiary-container text-2xl"
              />
            </div>
            <p className="text-3xl font-bold text-on-surface mb-1">+23%</p>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Monthly Growth
            </p>
            <p className="text-xs text-on-surface-variant mt-2">
              Donation volume increase compared to the previous month
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="flex justify-center py-10">
        <div className="max-w-xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 rounded-full mb-4">
            <Icon name="info" className="text-secondary text-sm" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">
              Financial Transparency
            </span>
          </div>
          <p className="text-sm text-on-surface-variant italic font-body">
            All donations are tracked and audited. Financial reports are
            generated monthly for full transparency.
          </p>
        </div>
      </div>
    </section>
  );
}
