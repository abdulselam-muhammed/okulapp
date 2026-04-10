"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/atoms";

function ResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "success";
  const isSuccess = status === "success";

  const transactionId = `#CC-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="flex justify-center">
      {isSuccess ? (
        <section className="bg-surface-container-low p-8 md:p-12 rounded-lg flex flex-col items-center text-center relative overflow-hidden max-w-xl w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="relative z-10 w-full">
            <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold mb-6 block">Transaction Successful</span>
            <div className="w-24 h-24 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20">
              <Icon name="check_circle" className="text-5xl" filled />
            </div>
            <h1 className="text-4xl font-extrabold text-on-surface mb-4 leading-tight font-headline">Thank you for your donation</h1>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              Your generous contribution directly supports the well-being of our campus animals. A confirmation email has been sent to your inbox.
            </p>
            <div className="bg-surface-container-lowest p-6 rounded-lg mb-10 text-left border border-outline-variant/15">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-label text-on-surface-variant">Transaction ID</span>
                <span className="text-sm font-bold font-headline text-on-surface">{transactionId}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-label text-on-surface-variant">Status</span>
                <span className="text-sm font-bold font-headline text-primary">Completed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-label text-on-surface-variant">Date</span>
                <span className="text-sm font-bold font-headline text-on-surface">{today}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:bg-primary-dim transition-all hover:scale-105 shadow-md">
                Return to Home
              </Link>
              <Link href="/donate" className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-full font-bold hover:bg-secondary-fixed-dim transition-all">
                Donate Again
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-surface-container p-8 md:p-12 rounded-lg flex flex-col items-center text-center relative overflow-hidden max-w-xl w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-error/5 to-transparent pointer-events-none" />
          <div className="relative z-10 w-full">
            <span className="text-error font-label text-xs uppercase tracking-widest font-bold mb-6 block">Action Required</span>
            <div className="w-24 h-24 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-error/10">
              <Icon name="error" className="text-5xl" filled />
            </div>
            <h2 className="text-4xl font-extrabold text-on-surface mb-4 leading-tight font-headline">Payment could not be processed</h2>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              We were unable to complete your transaction. This might be due to incorrect card details or a temporary connection issue.
            </p>
            <div className="bg-error-container/20 p-6 rounded-lg mb-10 text-left border border-error/15">
              <div className="flex items-start gap-4">
                <Icon name="info" className="text-error mt-1" />
                <div>
                  <h4 className="font-bold text-on-surface text-sm mb-1 font-headline">What to do:</h4>
                  <p className="text-sm text-on-surface-variant">Verify your card details and billing information, then try again. If the issue persists, contact your bank or our support team.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate" className="bg-secondary text-on-secondary px-8 py-3 rounded-full font-bold hover:bg-secondary-dim transition-all hover:scale-105 shadow-md">
                Try Again
              </Link>
              <Link href="/contact" className="bg-surface-container-lowest text-on-surface px-8 py-3 rounded-full font-bold hover:bg-surface-bright transition-all border border-outline-variant/15">
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function DonateResultPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <ResultContent />
      </Suspense>

      {/* Supportive Visual Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group relative aspect-[4/3] rounded-lg overflow-hidden">
          <img
            alt="Happy golden retriever"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDATXm7MqZGyoKN2DxjCOmQoojEEBfR30g2Ua96AhUVtnx6aSHAEaCEev2GLsNUX--ysWvMwhkjiX_x62EQj48CwEfCVzQcCMAvxEKNDZ0qnyMh80rYmFTJCyg30E7onm-yIZJ3FFT94KaQtHgpx38qdN6U2cs5-U879zaZGUFz6ux5lm-gx0MgXbdw8WB723rJ-_VmClpJE7GEoXuEiuw445Q6w_2a1-MbZR2dLeZBEv_5v5gPOmycanyZjLqzx1kYv2Yb--cucN8"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/60 to-transparent flex flex-col justify-end p-6">
            <p className="text-on-primary font-headline font-bold">Your Impact</p>
            <p className="text-on-primary/80 text-xs">Directly funding medical checks for campus rescues.</p>
          </div>
        </div>
        <div className="group relative aspect-[4/3] rounded-lg overflow-hidden">
          <img
            alt="Gentle cat"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB6ifVwlS6owZCm5ptcbp9OnSmtY4iHT_ZmAkPKJ0b2VjBe6KKxNjQX2j0qypve12YBAg7tcil_EqWhQ5jkZ8uPF9Q-QO64xmY62G5Bb0dSp_Vw5DrE_VMXc5IE-ADarjGy0ilSYDneXGet2Fd8yD_wza600po9sRsO4kdPqnjUqZqjxeaqUGr_4TZeMXy2HtgBBbIAfgTqMGthuxVNIZAaiITaA8MI3W6g-KTtWhrmAQDCMO-OjSZ-ExoU3Yk000QFnLimOATRFA"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/60 to-transparent flex flex-col justify-end p-6">
            <p className="text-on-primary font-headline font-bold">Safe Haven</p>
            <p className="text-on-primary/80 text-xs">Creating a permanent sanctuary for our feline residents.</p>
          </div>
        </div>
        <div className="group relative aspect-[4/3] rounded-lg overflow-hidden">
          <img
            alt="Puppy playing"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvovB6aXPJzlcuG4AwvBGHgIy6dMSlEzpd1_ZRCfZgSaKWPJurNPPX_HXubzikUhZ3qA56laEeudckQsT31DWgohhAz6IDEMZgIQWl4bMLwMT7oPGx2QPCEcGt96tXVyYn-5geWpkSFAmPzL9uzZMfwPsP2_NHX4ySv9lmASBeZsytusmM8nnYPwomKWFzeDaUDzNGaXqIW-xAg_9BwLfqPBo2XVZzFTNfGRBViWS4avpq2MWUT02ujQi6jZ0cuonOhWN3uEhOKm4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/60 to-transparent flex flex-col justify-end p-6">
            <p className="text-on-primary font-headline font-bold">Community Support</p>
            <p className="text-on-primary/80 text-xs">Engaging students in compassionate animal care education.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
