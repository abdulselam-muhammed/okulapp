import { Icon } from "@/components/atoms";

export default function DonatePage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Checkout Form */}
        <div className="w-full lg:w-2/3 space-y-10">
          <header>
            <span className="text-on-surface-variant font-label text-sm uppercase tracking-widest font-bold mb-2 block">Secure Checkout</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight font-headline">Complete Your Gift</h1>
            <p className="text-on-surface-variant mt-4 max-w-lg leading-relaxed">Your contribution directly supports the medical care, nutrition, and housing of our campus sanctuary residents.</p>
          </header>

          <div className="bg-surface-container-low rounded-lg p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <Icon name="payments" />
              </div>
              <h2 className="text-2xl font-bold font-headline text-on-background">Payment Information</h2>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cardholder Name */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">Cardholder Name</label>
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-md px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all outline-none"
                  placeholder="Full name as it appears on card"
                  type="text"
                />
              </div>

              {/* Card Number */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">Card Number</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-md px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all outline-none"
                    placeholder="0000 0000 0000 0000"
                    type="text"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <Icon name="credit_card" className="text-outline-variant" />
                  </div>
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">Expiry Date</label>
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-md px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all outline-none"
                  placeholder="MM / YY"
                  type="text"
                />
              </div>

              {/* CVV */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">CVV</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-md px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all outline-none"
                    placeholder="&bull;&bull;&bull;"
                    type="password"
                  />
                  <Icon name="help" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant cursor-help" />
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container bg-surface-container-lowest"
                    type="checkbox"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">I agree to the Terms of Service and Privacy Policy.</span>
                </label>
              </div>

              <div className="md:col-span-2 pt-6">
                <button
                  className="w-full bg-primary text-on-primary rounded-full py-5 font-headline font-bold text-lg shadow-xl shadow-primary/10 hover:bg-primary-dim hover:scale-[1.01] transition-all flex items-center justify-center gap-3 group"
                  type="submit"
                >
                  <span>Confirm Donation</span>
                  <Icon name="favorite" className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-xs text-on-surface-variant/60 mt-4 flex items-center justify-center gap-1">
                  <Icon name="lock" className="text-sm" />
                  Encrypted 256-bit SSL Secure Payment
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <aside className="w-full lg:w-1/3 sticky top-32">
          <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-2xl shadow-primary/5">
            <div className="h-48 relative">
              <img
                className="w-full h-full object-cover"
                alt="Happy dog on campus"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLKB_gPD7V4e4iimPfJ7lWzqLasIx1mfzc8oI9jBAZMJMBWU_5Iq7CmuSJcaH46oWVn2cQbKWFU_BmUwv8U3GofvrluYdt18Iyj9yfAt8HI5jehTXndHRczru2jzoMOo-x-mgEnJeXfpEZHdUGrOLpHpsV6Ze5p_n5PLuEVJth2DzAW_NitE-U6OgLpB9H7x3CsSqh0F2KrNkT_QfkGggC7ZhnUqkAizyiS8V5SbutauBoY2H7VKbzvqQz4ORqz4xGo8V-T8R9Bv0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
            </div>
            <div className="p-8 space-y-6">
              <h3 className="text-xl font-bold font-headline text-on-background">Donation Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>One-time Donation</span>
                  <span className="font-bold text-on-surface">$50.00</span>
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
                    <p className="text-4xl font-extrabold font-headline text-primary">$50.00</p>
                  </div>
                  <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-xs font-bold font-headline">
                    USD
                  </div>
                </div>
              </div>
              <div className="bg-surface-bright rounded-lg p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="eco" className="text-secondary" filled />
                  <p className="text-sm leading-relaxed text-on-surface-variant italic">&quot;This donation will provide high-quality organic feed for the campus goats for an entire week.&quot;</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                <img alt="Visa" className="h-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApDPm6CHZ94AhUFiYE7g34UTdqKga2SZ22kgjuPf3ePoE2dM_0Yif8bF4MapNxB6oAUmBOSut5T-D_4lr11dX-MhjePqDGL1TffFUytqbrOSUrugtNyCiH2lU6jnENZij4efRom3_043DBN4yHMR5PFUQ6TQhVCapyHDKZXe1dwRfp_jDzo25xoImJHX-kw6vHzWUHMnOQBhGC8tQNMC0UU6XMHde5VBarQ6G8zU5vjTE6ymDkrCTouZC5m0Wc6o1m-xzjeo-o7Cc" />
                <img alt="Mastercard" className="h-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdnk12WRPKRyxKdLR7MsGPJ07uT6m64gQw1IyCDWR5nDA6BV_78rC2HR00WYWOPcTd0kZRFOPHgRTTvGfSQY5TpRbvkLuw3k9-mAJMIgdNxjqcCYIRRJx--xNYvx5ZfgxQHX0-dmLaRsNbdw7CTvfsKBk-IueE1xPcgeQDbmqfRjnbKMzZ9d-gJLc5lKemaXzQi6nbBRO4Yzaz65PsPzzAEr9m-LTg0BULpj2IMyvRgvKCTrk_UAsvdzc5qqJ8O26bMti5E-SEoho" />
                <img alt="PayPal" className="h-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4FpWrSjanTSj6siSWHAyu0798sRpz7oDpIKek7TnCx5guKgudJcZGClRSaSgIXX9ao1EEzaH_Bf9TlUzZ6uNCx2Y77kUkhyp-syLEvi4ZIxrmHyaDv3AWqxR4ylOhlLiThER-Xoq08qWCZ4_yQAwwanJL7cdI4K94twywwjTKh07Zn9wXdlZfmkw8vmAXq1c7AU_3tXvAoGqs65R0erHPnIMuWfyIRUh0AhlcoJ_DuRLftR8ZDEzgQdiisRF0b2wZFg_MlP3zYxs" />
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3 text-on-surface-variant/70 text-sm">
            <Icon name="shield" />
            <span>Trusted by 2,000+ Alumni &amp; Students</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
