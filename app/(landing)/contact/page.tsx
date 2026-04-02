import { Icon } from "@/components/atoms";

export default function ContactPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mb-20">
        <span className="text-on-surface-variant font-label text-xs font-bold uppercase tracking-widest block mb-4">Connect With Us</span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-8 max-w-3xl">
          Let&apos;s make our campus a <span className="text-primary italic">haven</span> for everyone.
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Whether you have questions about our feeding stations, want to report a maintenance issue, or simply want to share your animal encounters, we&apos;re here to listen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form Card */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.06)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <h2 className="text-3xl font-bold mb-8 relative z-10">Send a Message</h2>
          <form className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Full Name</label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant/60"
                  placeholder="John Doe"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">University Email</label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant/60"
                  placeholder="john@university.edu"
                  type="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-1">Subject</label>
              <select className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-on-surface">
                <option>Station Maintenance Request</option>
                <option>Volunteer Inquiry</option>
                <option>Feedback &amp; Suggestions</option>
                <option>General Inquiry</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-1">Message</label>
              <textarea
                className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant/60"
                placeholder="Tell us how we can help..."
                rows={5}
              ></textarea>
            </div>
            <button
              className="w-full md:w-auto px-10 py-4 bg-primary text-on-primary rounded-full font-bold text-lg hover:bg-primary-dim transition-all flex items-center justify-center gap-3 group"
              type="submit"
            >
              Send Message
              <Icon name="send" className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Contact Info & Map Bento */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-8">
          {/* Quick Contact Stats */}
          <div className="bg-secondary-container/40 p-8 rounded-lg backdrop-blur-sm border border-outline-variant/10">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-on-secondary shrink-0">
                <Icon name="hub" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-secondary-container">Campus HQ</h3>
                <p className="text-on-secondary-fixed-variant leading-relaxed">Central Student Union, Room 402, Green Campus West</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary shrink-0">
                <Icon name="support_agent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-primary-container">Emergency Hotline</h3>
                <p className="text-on-primary-fixed-variant leading-relaxed">Available 24/7 for injured animal reports.<br /><span className="font-bold">+1 (555) 012-3456</span></p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-surface-container rounded-lg p-4 h-[400px] relative overflow-hidden group">
            <div className="absolute inset-4 rounded-md overflow-hidden bg-zinc-200">
              <img
                alt="Campus Map"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA07wqFBcl46lEVlFyuRIrJABo77E8momLgU-r0_WlKQgJprcm-EwExEIdpv_YnjcN-TmS3yKgILN6KTIv_yGC2OZvt0QYLK3CLbfNZU3yiS23_o0NLOedOPbfK3D0eWjdrh7mueID-E6es96t67gGzaeWHyUvBW6jFyHqsmA5pm4ezJHc-2jw3PbQxbVFSJuDbqF7fvBWqiHF6TDr8lH24rNBkO3ndQAiCwRTDm7CdVhNXVO3_VOJedsVSuma83oOE0ICx88zvDg8"
              />
              {/* Marker Overlays (Simulated) */}
              <div className="absolute top-1/4 left-1/3 group/marker cursor-pointer">
                <div className="relative">
                  <Icon name="location_on" className="text-primary text-4xl" filled />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-lg opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">Main Food Station</div>
                </div>
              </div>
              <div className="absolute bottom-1/3 right-1/4 group/marker cursor-pointer">
                <div className="relative">
                  <Icon name="location_on" className="text-secondary text-4xl" filled />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-lg opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">Library Water Point</div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 bg-surface-container-lowest/90 backdrop-blur-md p-4 rounded-lg flex justify-between items-center shadow-lg">
              <span className="font-bold text-sm">Station Interactive Map</span>
              <a className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:underline" href="#">
                Open Full View
                <Icon name="open_in_new" className="text-sm" />
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a className="flex-1 bg-surface-container-high py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-primary-container transition-colors group" href="#">
              <Icon name="camera" className="text-on-surface-variant group-hover:text-primary" />
              <span className="font-bold text-sm">Instagram</span>
            </a>
            <a className="flex-1 bg-surface-container-high py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-secondary-container transition-colors group" href="#">
              <Icon name="share" className="text-on-surface-variant group-hover:text-secondary" />
              <span className="font-bold text-sm">X / Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
