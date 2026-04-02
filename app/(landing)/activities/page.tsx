import Link from "next/link";
import { Icon } from "@/components/atoms";

export default function ActivitiesPage() {
  return (
    <main className="pt-32 pb-20">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-8 mb-20">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-4 block">
              Our Commitment
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface leading-tight tracking-tighter">
              Nurturing Our <br />
              <span className="text-primary italic">Campus Sanctuary</span>
            </h1>
          </div>
          <p className="max-w-md text-on-surface-variant font-body text-lg leading-relaxed mb-2">
            Discover how we manage food, water, and health resources to ensure
            every campus resident thrives in a safe, sustainable environment.
          </p>
        </div>
      </header>

      {/* Activities Bento Grid */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Daily Feeding - Large Card */}
          <div className="md:col-span-8 group bg-surface-container-lowest rounded-lg p-8 shadow-[0_20px_40px_rgba(0,58,40,0.06)] transition-all hover:translate-y-[-4px]">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 aspect-[4/3] rounded-md overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Daily feeding station with nutritious food"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpXt7ylo1EmdG92b6kXG2AMjSYYOVxpXPjVyFj_WAdqfV9qFuCrrQNlVBUaHMZqu_04PkxnmS7JC0OdX4GVUXjH2lkxihV9JVKKBZ__qqk0PM2bmDKGyqCsxrRZs-1TDUDvLqeshZlwgeDENNqhIx-hrIi0kCtUit5m30AkJH8Ie1f297n9aLVtz2R5NbmqQu_pgM3SSbyPAovkRVkznyHsvD3em382-xf8wijf8wWspl1FxE0Orn3Z1-JEQ7PuvqEVRp54Y3c808"
                />
              </div>
              <div className="w-full md:w-1/2">
                <Icon name="restaurant" className="text-primary text-4xl mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  Daily Feeding Programs
                </h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  We maintain 12 strategically placed feeding stations across
                  campus. Each station is replenished twice daily with
                  nutrient-rich food tailored to local species&apos; needs,
                  ensuring no animal goes hungry.
                </p>
                <div className="flex items-center gap-4 text-primary font-bold">
                  <span>Learn More</span>
                  <Icon name="arrow_forward" />
                </div>
              </div>
            </div>
          </div>

          {/* Water Station - Square Card */}
          <div className="md:col-span-4 bg-surface-container-low rounded-lg p-8 shadow-[0_20px_40px_rgba(0,58,40,0.06)] transition-all hover:translate-y-[-4px]">
            <div className="h-48 rounded-md overflow-hidden mb-6">
              <img
                className="w-full h-full object-cover"
                alt="Automated water station for campus animals"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLJmDSgyRMAbmUBTTUtfSVnnvKYGnFNm0dOkN70fnRtcmcL_sWgU8PSRZ3ynM3ngTYTKakkcAjJE4qG-uh9cXhlFYDoY4i5y6O4kkrKYwID862f5SbSsRNFb2uHwlSqK5KPzP4emUZXuRVo6dVi5FIy2MkkqD-W9IJkSJTYQYSd49kOf3bhVNzTr7m-Uw8HlbwAxBqvMFFEXlFbcL8TfizdsDkEWUxcdpw52QeEWyU87kEhHUA9KJETDGauGwdJ86N4yWz3Z5uc0M"
              />
            </div>
            <Icon name="water_drop" className="text-secondary text-3xl mb-4" />
            <h3 className="text-xl font-bold mb-3">Hydration Management</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Continuous maintenance of automated water stations. We ensure
              clean, filtered water is available 24/7, with daily cleaning
              protocols to prevent contamination.
            </p>
          </div>

          {/* Health Checks - Vertical Card */}
          <div className="md:col-span-4 bg-surface-container rounded-lg p-8 shadow-[0_20px_40px_rgba(0,58,40,0.06)] transition-all hover:translate-y-[-4px] flex flex-col justify-between">
            <div>
              <div className="aspect-square rounded-md overflow-hidden mb-6">
                <img
                  className="w-full h-full object-cover"
                  alt="Veterinarian examining a cat"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZhpVXK96bqiyKV10Cob-RVezBsMKbTopbcEf7wEANoLMDMBmYY00eK-Iyjncl83iRQOmdmJckPPhT0aoJpnRqCRq52KhgZxJO_wseWGgKRIKfvv8_76vbhC-8CzWESi3k1FJvzKrI5_ECHCvVjbvH5XUP7qOf7OzQAc9gNo5JWlQ0ZGqQJxOcjmxpv2pzEM4GBq4qV8_zRXzzqdc0EBA-X1Dwq-IsdyFb8MfzyRrZOknjlT7TXZHRdxMDuK3tcNcUexayzhOR4fI"
                />
              </div>
              <Icon
                name="health_and_safety"
                className="text-tertiary text-3xl mb-4"
              />
              <h3 className="text-xl font-bold mb-3">Routine Health Checks</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Bi-weekly rounds by our volunteer veterinary students to monitor
                physical well-being and administer necessary vaccinations.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant/15 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              <Icon name="event" className="text-sm" />
              Every Tuesday &amp; Thursday
            </div>
          </div>

          {/* Community Events - Wide Card */}
          <div className="md:col-span-8 bg-primary-container rounded-lg overflow-hidden shadow-[0_20px_40px_rgba(0,58,40,0.06)] transition-all hover:translate-y-[-4px] relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="p-8 flex flex-col justify-center">
                <Icon
                  name="groups"
                  className="text-on-primary-container text-4xl mb-4"
                />
                <h3 className="text-2xl font-bold text-on-primary-container mb-4">
                  Community Engagement
                </h3>
                <p className="text-on-primary-fixed-variant leading-relaxed mb-8">
                  Join our weekend workshops and &ldquo;Sanctuary
                  Saturdays&rdquo; where students can learn about animal
                  behavior and help build new shelters.
                </p>
                <Link
                  href="/activities"
                  className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold w-fit hover:bg-primary-dim transition-all"
                >
                  View Calendar
                </Link>
              </div>
              <div className="h-64 md:h-full">
                <img
                  className="w-full h-full object-cover"
                  alt="Students building shelters on campus"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-icoXiGocnyE6ZJ7gwu5hIIdAqKt8swf7Yuy4__ei_87qSPAG8dHMEhW32T7miPZntoP5A8ZTra5Ga0ZnSfV4ZtXHfvX-2j7thrP866j30deS-DM3sWFPjQuAbMF14CpDqn_x9lmXol3B-PhxqeVCx8QnHpsbs3Rx-8wlsN1-HY76s8DUkeUzEA-4zYTP8hpunjUHcL8zz6u6fTAsaBovFuBHv7Wa2u_iWpg6uuvH8gGBTCuzq3-l-5S3fn2_7vgLm0bZV6fXMB0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-32 max-w-7xl mx-auto px-8">
        <div className="bg-surface-container-high rounded-xl p-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-extrabold text-primary mb-2">
                450+
              </div>
              <div className="text-sm font-label uppercase tracking-widest text-on-surface-variant">
                Daily Meals
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary mb-2">
                12
              </div>
              <div className="text-sm font-label uppercase tracking-widest text-on-surface-variant">
                Smart Stations
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary mb-2">
                85
              </div>
              <div className="text-sm font-label uppercase tracking-widest text-on-surface-variant">
                Active Volunteers
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary mb-2">
                100%
              </div>
              <div className="text-sm font-label uppercase tracking-widest text-on-surface-variant">
                Care Coverage
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
