import Link from "next/link";
import { Icon } from "@/components/atoms";

export default function SupportPage() {
  return (
    <main className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 mb-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="editorial-kicker text-on-surface-variant font-bold text-xs">Destek Ol / Support Us</p>
            <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface leading-tight tracking-tighter">
              Onların Kahramanı <span className="text-primary italic">Siz Olun.</span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-lg">
              Kampüsümüzdeki dostlarımızın mama, su ve sağlık ihtiyaçlarını hep birlikte karşılıyoruz. Küçük bir yardım, büyük bir değişime dönüşebilir.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
              <img
                alt="Campus Cat"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFrCfEVxOi8H68xUfNSFTi0eOtKw5ydG92AeZc_vAjT9Mb__2rc8vKjfz9-mH_oiyNL6L30EFkzwPLzH5AAWBv4A4d1efOkC7oWFCLJHRBNrAFdSA6Z1Q2vvTMQVCKIu6Eqs1Ux3jSrdKoYqSDXMRlPVgjwL8D6dgafUHOGpuWO6-4Bb7kmW89M8BMZUyQPd5AUNMngLROzF1Wg2FSoPfQ742GEyC1oEq6YBVGMWSz_R1mucB6E_z2gPOoplKzr_Oa7nga75UDBKM"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -left-6 bg-secondary-container p-6 rounded-lg shadow-xl hidden md:block">
              <div className="flex items-center gap-4">
                <Icon name="favorite" className="text-on-secondary-container text-4xl" />
                <div>
                  <p className="text-on-secondary-container font-bold text-xl">1.2k+</p>
                  <p className="text-on-secondary-container/80 text-xs font-medium">Mutlu Dostumuz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Contribution Options */}
      <section className="max-w-7xl mx-auto px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* Monetary Donation */}
          <div className="md:col-span-2 bg-surface-container-low rounded-lg p-10 flex flex-col justify-between transition-all hover:bg-surface-container-high group">
            <div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon name="payments" className="text-on-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Maddi Destek</h2>
              <p className="text-on-surface-variant text-lg mb-8 max-w-md">Mama istasyonlarımızın bakımı, tıbbi yardımlar ve acil müdahaleler için fon sağlıyoruz.</p>
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="px-6 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/30 font-bold hover:bg-primary hover:text-on-primary transition-all">₺100</button>
                <button className="px-6 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/30 font-bold hover:bg-primary hover:text-on-primary transition-all">₺250</button>
                <button className="px-6 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/30 font-bold hover:bg-primary hover:text-on-primary transition-all">₺500</button>
                <button className="px-6 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/30 font-bold hover:bg-primary hover:text-on-primary transition-all">Diğer</button>
              </div>
            </div>
            <Link href="/donate" className="w-fit bg-primary text-on-primary px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:shadow-xl transition-all">
              Hemen Bağış Yap <Icon name="arrow_forward" />
            </Link>
          </div>

          {/* Food Donation */}
          <div className="bg-secondary-container rounded-lg p-10 flex flex-col items-center text-center transition-all hover:translate-y-[-4px]">
            <div className="w-20 h-20 bg-white/40 backdrop-blur rounded-full flex items-center justify-center mb-8">
              <Icon name="restaurant" className="text-secondary text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Mama Bağışı</h2>
            <p className="text-on-secondary-container/80 mb-8">Güvenilir markalardan seçtiğiniz mamaları istasyonlarımıza ulaştırabilirsiniz.</p>
            <div className="mt-auto">
              <Link href="/contact" className="text-secondary font-bold underline underline-offset-4 hover:text-on-secondary-container transition-colors">İhtiyaç Listesini Gör</Link>
            </div>
          </div>

          {/* Volunteer */}
          <div className="bg-surface-container-lowest rounded-lg p-10 flex flex-col transition-all border border-outline-variant/10 hover:shadow-2xl">
            <Icon name="volunteer_activism" className="text-primary text-5xl mb-6" />
            <h2 className="text-2xl font-bold mb-4">Gönüllü Ol</h2>
            <p className="text-on-surface-variant mb-8">Haftalık besleme turlarımıza katılabilir veya etkinliklerimizde bize yardımcı olabilirsiniz.</p>
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <Icon name="check_circle" className="text-primary text-lg" />
                Haftalık Besleme
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <Icon name="check_circle" className="text-primary text-lg" />
                Farkındalık Etkinlikleri
              </div>
              <Link href="/register" className="block w-full mt-6 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all text-center">Başvuru Formu</Link>
            </div>
          </div>

          {/* Impact Card */}
          <div className="md:col-span-2 bg-gradient-to-r from-primary to-primary-dim rounded-lg p-10 text-on-primary relative overflow-hidden">
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center h-full">
              <div>
                <h2 className="text-3xl font-bold mb-4">Nasıl Bir Değişim Yaratıyoruz?</h2>
                <p className="text-on-primary/80 mb-6">Her ay 40&apos;tan fazla mama istasyonunu dolduruyor ve 200&apos;den fazla kampüs dostumuzun sağlık taramasını yapıyoruz.</p>
                <div className="flex gap-10">
                  <div>
                    <p className="text-4xl font-black">500kg+</p>
                    <p className="text-xs uppercase tracking-widest opacity-70">Aylık Mama</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black">150+</p>
                    <p className="text-xs uppercase tracking-widest opacity-70">Aktif Gönüllü</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  alt="Volunteers"
                  className="rounded-lg shadow-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA-WQBJJNQFqshK7k6brszxFB1TlDhiYoUB_FU8XblDJ0dZgqptiKf3kaUAjj6gdRJSBSGRA8HCwrnphjw16Br7W08C2Cmll02gu3Pq0hfwbPxQb003bYiBuYlgw8lxgp8yNgduRQJkthDDnPX0dy6xcN93FJBrcRuSsRSrSQ-93AWOiYpCmw-pFLIl8-CUDCBXeEku5P8a1kvY4AQh8IixgYRsqMj1GtQdGYSnuhXD12un7yuw8k6wMS55qsVnMz45kD8nrCllBI"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-8">
        <div className="bg-surface-container-low rounded-xl p-12 text-center relative">
          <h2 className="text-4xl font-bold mb-6">Onlara Bir Gelecek Sunun</h2>
          <p className="text-lg text-on-surface-variant mb-10 max-w-xl mx-auto">Sizin desteğinizle kampüsümüz her canlı için daha yaşanabilir bir yer haline geliyor. Şimdi bir adım atın.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/donate" className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-dim shadow-xl transition-all">Support Now / Şimdi Destek Ol</Link>
            <Link href="/contact" className="bg-surface-container-lowest text-primary px-10 py-4 rounded-full font-bold text-lg border border-primary hover:bg-primary-container transition-all">İletişime Geç</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
