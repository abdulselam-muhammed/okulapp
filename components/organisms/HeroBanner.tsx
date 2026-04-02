interface HeroBannerProps {
  title: string;
  badge?: string;
  heading: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
}

export default function HeroBanner({
  title,
  badge,
  heading,
  description,
  imageUrl,
  imageAlt = "",
}: HeroBannerProps) {
  return (
    <section className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-primary text-on-primary">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          alt={imageAlt}
          className="w-full h-full object-cover"
          src={imageUrl}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10" />

      {/* Logo / Title */}
      <div className="relative z-20">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight">
          {title}
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-20 space-y-6">
        {badge && (
          <div className="inline-block px-4 py-1 rounded-full bg-primary-container/20 backdrop-blur-md border border-outline-variant/30 text-xs font-label uppercase tracking-widest text-on-primary">
            {badge}
          </div>
        )}
        <h2 className="font-headline text-5xl font-bold leading-tight">
          {heading}
        </h2>
        <p className="font-body text-lg text-on-primary/80 max-w-md">
          {description}
        </p>
      </div>
    </section>
  );
}
