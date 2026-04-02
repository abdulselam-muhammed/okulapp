import { Navbar, Footer } from "@/components/organisms";

interface LandingTemplateProps {
  children: React.ReactNode;
}

export default function LandingTemplate({ children }: LandingTemplateProps) {
  return (
    <div className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
