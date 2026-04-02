import { Navbar, Footer } from "@/components/organisms";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
