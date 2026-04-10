import { jsPDF } from "jspdf";

export interface InvoiceData {
  id: number;
  donor_name: string;
  donor_email: string | null;
  amount: number;
  payment_method: string | null;
  note: string | null;
  created_at: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const primaryColor: [number, number, number] = [68, 103, 78]; // #44674e
  const textColor: [number, number, number] = [0, 58, 40]; // #003a28
  const mutedColor: [number, number, number] = [53, 105, 83]; // #356953

  // ─── HEADER ──────────────────────────────────────────
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CAMPUS CARE", margin, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Animal Welfare Sanctuary", margin, 28);
  doc.text("hello@campuscare.edu  |  campuscare.edu", margin, 34);

  // Invoice label on right
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - margin, 22, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`#DON-${String(data.id).padStart(6, "0")}`, pageWidth - margin, 30, { align: "right" });

  // ─── INVOICE META ────────────────────────────────────
  let y = 55;
  doc.setTextColor(...textColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE DATE", margin, y);
  doc.text("STATUS", pageWidth - margin - 40, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(formatDate(data.created_at), margin, y + 6);

  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("PAID", pageWidth - margin - 40, y + 6);

  // ─── DONOR INFO ──────────────────────────────────────
  y = 80;
  doc.setTextColor(...mutedColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("BILLED TO", margin, y);

  doc.setTextColor(...textColor);
  doc.setFontSize(13);
  doc.text(data.donor_name, margin, y + 8);

  if (data.donor_email) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedColor);
    doc.text(data.donor_email, margin, y + 14);
  }

  // ─── DIVIDER ─────────────────────────────────────────
  y = 110;
  doc.setDrawColor(200, 220, 210);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  // ─── ITEMS HEADER ────────────────────────────────────
  y += 10;
  doc.setTextColor(...mutedColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPTION", margin, y);
  doc.text("AMOUNT", pageWidth - margin, y, { align: "right" });

  // ─── LINE ITEM ───────────────────────────────────────
  y += 10;
  doc.setTextColor(...textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Charitable Donation", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.text("Supporting animal welfare at Campus Care", margin, y + 6);

  if (data.payment_method) {
    doc.text(`Payment method: ${data.payment_method}`, margin, y + 11);
  }

  doc.setTextColor(...textColor);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(data.amount), pageWidth - margin, y, { align: "right" });

  // ─── TOTAL BOX ───────────────────────────────────────
  y = 160;
  doc.setDrawColor(200, 220, 210);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;
  doc.setTextColor(...mutedColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", pageWidth - margin - 40, y);
  doc.text(formatCurrency(data.amount), pageWidth - margin, y, { align: "right" });

  y += 7;
  doc.text("Processing Fee", pageWidth - margin - 40, y);
  doc.text("$0.00", pageWidth - margin, y, { align: "right" });

  y += 10;
  doc.setDrawColor(200, 220, 210);
  doc.line(pageWidth - margin - 50, y - 3, pageWidth - margin, y - 3);

  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL", pageWidth - margin - 40, y + 4);

  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text(formatCurrency(data.amount), pageWidth - margin, y + 4, { align: "right" });

  // ─── NOTE ────────────────────────────────────────────
  if (data.note) {
    y = 200;
    doc.setTextColor(...mutedColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("NOTE", margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    const noteLines = doc.splitTextToSize(data.note, pageWidth - margin * 2);
    doc.text(noteLines, margin, y + 6);
  }

  // ─── FOOTER ──────────────────────────────────────────
  const footerY = 275;
  doc.setDrawColor(200, 220, 210);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setTextColor(...mutedColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Thank you for your generous contribution. Your donation directly supports the care and welfare",
    pageWidth / 2,
    footerY + 6,
    { align: "center" }
  );
  doc.text(
    "of animals at our campus sanctuary.",
    pageWidth / 2,
    footerY + 10,
    { align: "center" }
  );

  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}  |  This is an official receipt`,
    pageWidth / 2,
    footerY + 16,
    { align: "center" }
  );

  return doc;
}

export function downloadInvoice(data: InvoiceData): void {
  const doc = generateInvoicePDF(data);
  doc.save(`invoice-DON-${String(data.id).padStart(6, "0")}.pdf`);
}

export function previewInvoiceURL(data: InvoiceData): string {
  const doc = generateInvoicePDF(data);
  return doc.output("datauristring");
}
