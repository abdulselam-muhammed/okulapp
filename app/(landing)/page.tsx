import Link from "next/link";
import { Icon } from "@/components/atoms";

export default function HomePage() {
  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="relative px-8 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase text-on-surface-variant bg-surface-container-highest rounded-full">
            Gelece&#287;i Birlikte Besliyoruz
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-on-surface leading-[1.1] mb-8 tracking-tight">
            Kamp&uuml;s&uuml;m&uuml;z&uuml;n Sessiz{" "}
            <span className="text-primary italic">Sakinleri</span> Bize Emanet.
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            Campus Care, &uuml;niversite s&#305;n&#305;rlar&#305;m&#305;z i&ccedil;indeki hayvan
            dostlar&#305;m&#305;z&#305;n d&uuml;zenli beslenme ve su ihtiya&ccedil;lar&#305;n&#305;
            modern teknolojiyle y&ouml;neten, topluluk destekli bir ya&#351;am projesidir.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/support"
              className="flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-dim transition-all"
            >
              <Icon name="volunteer_activism" /> Destek Ol
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 border-2 border-outline-variant text-on-surface px-8 py-4 rounded-full font-bold text-lg hover:bg-surface-container-low transition-all"
            >
              <Icon name="info" /> Proje Detaylar&#305;
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/20 rotate-2 hover:rotate-0 transition-transform duration-500">
            <img
              alt="Kamp&uuml;s kedisi"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDATXm7MqZGyoKN2DxjCOmQoojEEBfR30g2Ua96AhUVtnx6aSHAEaCEev2GLsNUX--ysWvMwhkjiX_x62EQj48CwEfCVzQcCMAvxEKNDZ0qnyMh80rYmFTJCyg30E7onm-yIZJ3FFT94KaQtHgpx38qdN6U2cs5-U879zaZGUFz6ux5lm-gx0MgXbdw8WB723rJ-_VmClpJE7GEoXuEiuw445Q6w_2a1-MbZR2dLeZBEv_5v5gPOmycanyZjLqzx1kYv2Yb--cucN8"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 bg-surface-container-lowest p-8 rounded-lg shadow-xl border border-surface-container max-w-[240px]">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <Icon name="water_drop" />
              </div>
              <span className="font-bold text-2xl text-on-surface">120L</span>
            </div>
            <p className="text-sm text-on-surface-variant">
              G&uuml;nl&uuml;k taze su da&#287;&#305;t&#305;m&#305; kapasitesi
            </p>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-container rounded-full flex items-center justify-center -z-10 animate-pulse"></div>
        </div>
      </section>

      {/* Stats Section (Bento Grid) */}
      <section className="mt-20 px-8 py-24 bg-surface-container-low rounded-[4rem] max-w-[90rem] mx-auto">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-on-surface mb-4">
            Etkimiz Rakamlarla
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Kamp&uuml;s ekosistemini korumak i&ccedil;in her g&uuml;n binlerce ad&#305;m
            at&#305;yor, her istasyonumuzu titizlikle takip ediyoruz.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="md:col-span-2 bg-surface-container-lowest p-10 rounded-lg flex flex-col justify-between group hover:bg-primary-container transition-colors">
            <Icon name="pets" className="text-4xl text-primary mb-6" />
            <div>
              <h3 className="text-6xl font-extrabold text-on-surface mb-2">
                450+
              </h3>
              <p className="text-lg font-medium text-on-surface-variant group-hover:text-on-primary-container">
                D&uuml;zenli Beslenen Hayvan
              </p>
            </div>
          </div>
          <div className="bg-secondary-container p-10 rounded-lg flex flex-col justify-between">
            <Icon
              name="location_on"
              className="text-4xl text-on-secondary-container mb-6"
            />
            <div>
              <h3 className="text-5xl font-extrabold text-on-secondary-container mb-2">
                24
              </h3>
              <p className="font-medium text-on-secondary-container/80">
                Aktif &#304;stasyon
              </p>
            </div>
          </div>
          <div className="bg-surface-container-highest p-10 rounded-lg flex flex-col justify-between">
            <Icon name="groups" className="text-4xl text-on-surface mb-6" />
            <div>
              <h3 className="text-5xl font-extrabold text-on-surface mb-2">
                120
              </h3>
              <p className="font-medium text-on-surface-variant">
                G&ouml;n&uuml;ll&uuml; &Ouml;&#287;renci
              </p>
            </div>
          </div>
          <div className="md:col-span-2 bg-white/50 backdrop-blur-md p-10 rounded-lg border border-outline-variant/20 flex items-center gap-8">
            <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border-4 border-white">
              <img
                alt="G&ouml;n&uuml;ll&uuml;"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPo1GF0IctCA3MUmRdl308C7nwMj-ELIf8jcZSxpz_IvN9qcGrCNWJd0GZ9-3jF9fbUO6sMq6HVlIjjCD0uHhw22Vrz0XOJNj8NfNxm2tJO_Nkbe6w_oIbOapYrpAN4VO3ie2Ka_udOlBw8coj7MNKv6CrV0dV3f8af81iukfOlmhGeHqaa1oVFM6jVkA9upym-SLtVysZ1tbWOVOCFetWQl5a69myktiAD88q7PxW-byZ3RtRziEpAzik0ml4bb9dj4TRuK8A624"
              />
            </div>
            <div>
              <p className="italic text-on-surface-variant mb-2">
                &ldquo;Kamp&uuml;s sadece bizim de&#287;il, onlar&#305;n da evi. Campus
                Care ile her sabah onlar&#305; tok g&ouml;rmek paha bi&ccedil;ilemez.&rdquo;
              </p>
              <p className="font-bold text-on-surface">
                &mdash; Melis Y., G&ouml;n&uuml;ll&uuml;
              </p>
            </div>
          </div>
          <div className="md:col-span-2 bg-primary p-10 rounded-lg flex flex-col justify-center items-center text-center text-on-primary">
            <h3 className="text-3xl font-bold mb-4">
              Bir Kap Mama, Bir D&uuml;nya Mutluluk
            </h3>
            <p className="mb-8 opacity-90">
              Ayl&#305;k d&uuml;zenli ba&#287;&#305;&#351;lar&#305;n&#305;zla sistemin
              s&uuml;rd&uuml;r&uuml;lebilirli&#287;ine katk&#305;da bulunun.
            </p>
            <Link
              href="/register"
              className="bg-on-primary text-primary px-10 py-4 rounded-full font-extrabold hover:bg-surface transition-all"
            >
              &#350;imdi Kat&#305;l
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Detail Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <img
                alt="Besleme istasyonu"
                className="rounded-lg w-full h-64 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA54ECLD5wcfU-cZTTEU7k3q2ba6haTKlkt0zu9QL6coGciJY3CMky1goyzHo2nRkRjo8t0UEeB0XOG1MFK_iilU1fuylkZicSTL3kS3HTPrff0sMNbH53ayil4ktnhgb-X7y4mYhXdXGcxusnEIlaz52ACiHlaQCx9EB0HMNT5mFn7-hRh5IIURgZ08I7JO_K4f2yKgEAnCcT6gXyhyUFr5H0KhiBSVUqFR5zXb_zTkYBBStzGSJaWMcfwGehJhxgo1B3hi-ysLc8"
              />
              <img
                alt="Kamp&uuml;s kedisi"
                className="rounded-lg w-full h-48 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgVr2q9VF-KJdqvwRdczAGuMZPMtobgdC-V1rhXUfVvIyrVe61bdA7h2yN1qc_ejHoAZ_8zk6RVgUR6nieypLb-SHoHQFIPdzk9Lnkpt3dmkRdhb5-FXqDO7wOp4K5BVKga7UGQjvTlEDQhl5fp7ShYlwAzeKmvr-VKIQ7BdBRfCtnhPhQOZL2aPHyGIvutoZbzQAO7ctrPe-mcgsx1QInQn6t-SNHjGjdjLHbNIw00gB_3FffPPqZ_pLeeHL0hnEE5UaMZi8hWSQ"
              />
            </div>
            <div className="space-y-4">
              <img
                alt="Besleme"
                className="rounded-lg w-full h-48 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMDytS8vP_Q0_3ol_j6VacbFcCQZd77jJzEut8ccbX_JzNaL0xY5USCM_tUh8y3_METqagPLsyo0X8f5ydzLmojMcquqYFHdlKsRD3iv2cZonZ2nCR3sVUDojJ3Fd2AvJ0GjOksa5HPL2rKpDZ7kcqMvMqKEwCin5ogIbiCIYEcS1TbpFzeRXgL1g89PbK-2etkI4i4rK4y0NnhDPK3c7CrpTJ1G1D9MHn1gDmJwrkayMQ0dRUokMlXX87R6s8jfXy8XUmxFlhW80"
              />
              <img
                alt="Kamp&uuml;s"
                className="rounded-lg w-full h-64 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChQhT-bThxCCrJp79wQ33jyZdye40_e1M3_5o_w24PkxNmz_0uuBw-HH9C28UJBqspYJtHtYmmMc0j5ZsflFAOzSOhERzfCM8K2hfKSWLzq9a0NJFu1ZqLoRA-1ABeQBmo0knEF4Pyl4qnPgnxxgbFfQMr9vPqjlspfidgjMmZiYBTuX1UaZTe73ODv9fi6JmnEnwl1m-BgOJIkJtAUndREMtyq1xxe-jkNQcq9ozWSGndPN8FC-qGJvJFh2-thXE1vtc3EOCnxh0"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-2 text-secondary font-bold mb-4">
              <span className="w-8 h-[2px] bg-secondary"></span>
              Misyonumuz
            </div>
            <h2 className="text-4xl font-bold text-on-surface mb-6 leading-tight">
              G&#305;da G&uuml;venli&#287;i ve Sa&#287;l&#305;kl&#305; Ya&#351;am Alanlar&#305;
            </h2>
            <div className="space-y-6 text-on-surface-variant leading-relaxed">
              <p>
                &Uuml;niversite kamp&uuml;sleri, binlerce &ouml;&#287;renci ve personelin
                yan&#305; s&#305;ra &ccedil;ok say&#305;da can dostumuza da ev sahipli&#287;i
                yapmaktad&#305;r. Ancak d&uuml;zensiz besleme al&#305;&#351;kanl&#305;klar&#305;
                hem hayvan sa&#287;l&#305;&#287;&#305;n&#305; hem de kamp&uuml;s hijyenini
                olumsuz etkileyebilmektedir.
              </p>
              <div className="flex gap-4 items-start bg-surface-container p-6 rounded-lg">
                <Icon
                  name="check_circle"
                  className="text-primary"
                  filled
                />
                <div>
                  <p className="font-bold text-on-surface mb-1">
                    Veri Odakl&#305; Y&ouml;netim
                  </p>
                  <p className="text-sm">
                    Hangi b&ouml;lgede ka&ccedil; can oldu&#287;unu ve ne zaman
                    beslendiklerini dijital olarak takip ediyoruz.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-surface-container p-6 rounded-lg">
                <Icon
                  name="check_circle"
                  className="text-primary"
                  filled
                />
                <div>
                  <p className="font-bold text-on-surface mb-1">
                    Ak&#305;ll&#305; &#304;stasyonlar
                  </p>
                  <p className="text-sm">
                    Otomatik dolum ve temizlik sistemleriyle suyun her zaman taze
                    kalmas&#305;n&#305; sa&#287;l&#305;yoruz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
