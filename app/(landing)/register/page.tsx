import { RegisterForm } from "@/components/organisms";

export default function RegisterPage() {
  return (
    <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-20">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Branding Column */}
          <div className="hidden lg:block space-y-8 pr-12">
            <div className="space-y-4">
              <span className="text-on-surface-variant font-label uppercase tracking-widest text-xs font-bold">
                Join the Sanctuary
              </span>
              <h1 className="text-5xl font-extrabold text-on-surface font-headline leading-tight tracking-tighter">
                Every paw finds a home on our campus.
              </h1>
              <p className="text-lg text-on-surface-variant/80 font-body leading-relaxed">
                Become a part of the Campus Care network. Whether you are a
                student volunteer or a professional veterinarian, your presence
                matters to our animal residents.
              </p>
            </div>
            <div className="relative rounded-lg overflow-hidden h-80 editorial-shadow">
              <img
                alt="Happy dogs playing in campus park"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCosruIFuFBwptOZsLuIJg9VQWIxrReYkX8FH5H53lzuqB5zCfKgyYZKcwzELx6aj3RnjztMYBAJyyr4Dkqc-AkB_yi5Xjkc0MRNzIyzCypch_P7zkFOb_hblq9NZUMuPNl0p4MHitmEwaG1D0fuBnsLEb9HOTQ3ULMKwwMekKcWQiMKsiHNr5tqoiUQ6Pz6S3bA4VRovkx9jLuNFm9Lkh0YvOpFSuVixPTFXKOvCsspO5r4u_kirER0c3hU343ytf0Yynv1t2JEXY"
              />
            </div>
          </div>

          {/* Register Form */}
          <RegisterForm />
        </div>
      </main>
  );
}
