import { HeroBanner } from "@/components/organisms";

interface AuthTemplateProps {
  children: React.ReactNode;
  heroTitle?: string;
  heroBadge?: string;
  heroHeading?: string;
  heroDescription?: string;
  heroImage?: string;
}

export default function AuthTemplate({
  children,
  heroTitle = "Campus Care",
  heroBadge = "Community Driven",
  heroHeading = "Every paw has a place in our story.",
  heroDescription = "Welcome back to the sanctuary management portal. Your dedication keeps our campus companions safe, healthy, and happy.",
  heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAq5Jmx6YPljJKigNRHAWGGsTuf3o14Je8WuAvhCk0m-maBEqv406egQjSRK1Za4B5zNXllkCUECtrzjxXwUL7RdC711zcwCQKijhTKB6arxjmZpwSCcaJ0PCM-ChiU1CnG3fzGEs9AKVlgf8TtggIXdCBK9mlzWhYIJ0PaAf0kveah7z5lcditagWLbXqHrBUvsnm9mt4CMlMVfRIH_hagG4cs_R4mavnoXegL_g7I0YFsD3-DdRayFykMDdVoIm7q-aC8lhCYvBw",
}: AuthTemplateProps) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow">
        {/* Left: Hero */}
        <HeroBanner
          title={heroTitle}
          badge={heroBadge}
          heading={heroHeading}
          description={heroDescription}
          imageUrl={heroImage}
          imageAlt="Campus Sanctuary"
        />

        {/* Right: Content */}
        <section className="p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-surface-container-lowest">
          {children}
        </section>
      </div>

      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-surface-container-high rounded-full blur-[120px] -z-10 opacity-60" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary-container rounded-full blur-[100px] -z-10 opacity-40" />
    </main>
  );
}
