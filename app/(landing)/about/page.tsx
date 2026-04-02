import { Icon } from "@/components/atoms";

export default function AboutPage() {
  return (
    <main className="pt-32">
      {/* Hero Section: Editorial Asymmetry */}
      <section className="max-w-7xl mx-auto px-8 mb-20 md:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="uppercase text-xs font-bold tracking-widest text-on-surface-variant mb-4 block">
              Our Story &bull; Hakk&#305;m&#305;zda
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-on-background leading-[1.1] tracking-tighter mb-8">
              Creating a digital sanctuary for our{" "}
              <span className="text-primary italic">campus friends.</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl">
              What started as a small student initiative has blossomed into a
              sophisticated ecosystem for animal welfare. We believe that every
              cat and dog on campus deserves consistent care, clean water, and a
              community that watches over them.
            </p>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl rotate-3 translate-x-4">
              <img
                alt="Campus cats"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy2qTNSgJ34mF3HgPhk9cJuDMu9MKzXmmv8_RTl6G8amZESKtIAw6XlwPhM3NMWuXeqFFpH2rLhJff2Y8fqMoPi9r4FeXB7Mn40zO52dZf8DztpV3PjbMOJvWUpJQcUWBNFau1K0k5qr1oQxeO8bAJhzNkdK8CQ-zCa4UuouSJfQfxWCZRvDsY7yrqJ63RLSvwqsaotf9HuofwXLt17z4q-CDyu4Oqi6OT0kc-cDIn9athr-JpyT0n4Md8Z_8DHwzCBF4j5IAWjGc"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-surface-bright p-6 rounded-lg shadow-xl hidden md:block max-w-[240px]">
              <p className="text-sm font-medium italic text-primary">
                &ldquo;Nurturing the silent residents of our academic halls since
                2021.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision: Glassmorphism Bento */}
      <section className="bg-surface-container-low py-20 md:py-32 rounded-t-[3rem] md:rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-surface-container-lowest p-10 md:p-16 rounded-lg flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center mb-8">
                  <Icon name="volunteer_activism" className="text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-on-surface-variant text-lg leading-relaxed">
                  To eliminate hunger and dehydration among campus animals
                  through smart automation, data-driven food station management,
                  and a dedicated network of student volunteers. We bridge the
                  gap between technology and compassion.
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-outline-variant/15 flex items-center gap-4">
                <span className="text-4xl font-extrabold text-primary/10">
                  01
                </span>
                <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">
                  Sustainable Care
                </span>
              </div>
            </div>
            {/* Vision */}
            <div className="bg-secondary-container p-10 md:p-16 rounded-lg flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-12 h-12 bg-on-secondary-fixed-variant/20 rounded-full flex items-center justify-center mb-8">
                  <Icon
                    name="visibility"
                    className="text-on-secondary-fixed"
                  />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-on-secondary-container">
                  Our Vision
                </h2>
                <p className="text-on-secondary-fixed-variant text-lg leading-relaxed">
                  A campus environment where animal-human coexistence is
                  seamless, safe, and technologically integrated&mdash;serving as
                  a blueprint for universities worldwide to honor their
                  biological residents.
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-outline-variant/15 flex items-center gap-4">
                <span className="text-4xl font-extrabold text-on-secondary-container/10">
                  02
                </span>
                <span className="text-xs font-bold uppercase tracking-tighter text-on-secondary-fixed-variant">
                  Global Standard
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section: Soft Profile Cards */}
      <section className="py-24 md:py-40 max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <span className="uppercase text-xs font-bold tracking-widest text-on-surface-variant mb-4 block">
            The Guardians
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-on-background">
            The Hearts Behind the System
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Team Member 1 */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full p-1 border-2 border-dashed border-primary/30 mb-6 group overflow-hidden">
              <img
                alt="Team lead"
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHtp38-8zVnDdGshIstgavGt4gXe9vR-IC30T7UXavYg9xJQ8RFVHC6A_NTAp-_sRz-bi_BdVfyybMlxyNaQzDDEHZwM3rlKYTvjk9UzMc00VQZNC-yg2HFedcKvsonYFV8SoawkYq5ZBFfjF8FvFHZjMoQQkZRUdHaMfs_B6OU_t2d96hfg6fVmMaNbHsosA89YjYMCUGpcH9SZ7VfRsAuZZsk-Rz8R8S3swt1x6FF4L58iegDnwVJID7t0gzekT8FNoHfXo79AE"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">Dr. Selen Aras</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Project Lead &amp; Visionary
            </p>
            <div className="flex gap-4">
              <Icon
                name="language"
                className="text-on-surface-variant text-lg cursor-pointer hover:text-primary"
              />
              <Icon
                name="mail"
                className="text-on-surface-variant text-lg cursor-pointer hover:text-primary"
              />
            </div>
          </div>
          {/* Team Member 2 */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full p-1 border-2 border-dashed border-primary/30 mb-6 group overflow-hidden">
              <img
                alt="Engineer"
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxXSnxZGq4iWSrai8zELsOBWquR4gDG8YBtLElJw1Evqy_7PxnA4rljuriYLwktAWBILbDEG56qq9DEgXWM3UvHx0xXag9fM1mjorRkwFsvNIC8Ng8MO6uyOc8-_N3lR0O2mGvomUWGb7GgTNSK1v4Xf1jnTZxGgAlVapBik_jY80nTbdRGY8zRDNMRp92ORrB9GnM3wNyQSckR-4C_59aWN1utd8FZBX5JvU8eYN2RXdD-BIJ5YfE2v2x_U0LXYC0Phqyc_2seMg"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">Mert Y&#305;lmaz</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              IoT Systems Engineer
            </p>
            <div className="flex gap-4">
              <Icon
                name="terminal"
                className="text-on-surface-variant text-lg cursor-pointer hover:text-primary"
              />
              <Icon
                name="mail"
                className="text-on-surface-variant text-lg cursor-pointer hover:text-primary"
              />
            </div>
          </div>
          {/* Team Member 3 */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full p-1 border-2 border-dashed border-primary/30 mb-6 group overflow-hidden">
              <img
                alt="Operations"
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9Rl4aPHao8sG7FQPWZ5QOIv70ETEQqDI7af6cTEHTjXZF_sU2lp3fNYBal9e7nkG5v7AOtQjFXrhakadnAIimuXVz2iJvpWrX_wSL8Uj58EWFkG2RX3mBZjtPJZNp-7asvbQwMFK7W_j5y2YTWHS-ZwJz3Thkt4319uQ9TiDz2TPz1ixtYT1pIMC1gpoi8YZDYKiNqgWKeOsQEOQyAhq1Y6R2-D5IW6Yj-Qt9F4t0WQCWh-4Qb6aeZoF_KxNOLnophPMF9JzW22M"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">Ay&#351;e Demir</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Volunteer Coordinator
            </p>
            <div className="flex gap-4">
              <Icon
                name="groups"
                className="text-on-surface-variant text-lg cursor-pointer hover:text-primary"
              />
              <Icon
                name="mail"
                className="text-on-surface-variant text-lg cursor-pointer hover:text-primary"
              />
            </div>
          </div>
          {/* Team Member 4 */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full p-1 border-2 border-dashed border-primary/30 mb-6 group overflow-hidden">
              <img
                alt="Design"
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyXnuik9HkNlAxAok8S87JvTJsQgmRn2SqgyS9vpV2zfAExt9vfb_HMvHuGNkmsscTwZcoY3A_ROjVsBwjVO2BAqe8QL2orU2ijZww4eusfj0xvZm5Shmanext9N5lLOqfBUk2FbSV-fcANBvs5uJmg06XAhxyGSfmOaSoxc0lWWkH0hewMh7ROYKYtdVPlQ8WUvjdUmrNZvg3mkk-Mi3gEm4Rpn6kPUNelJDY_lyxN3_1JoHm_FWm5r-WjO6qwECLlqpQ0ZfqBiA"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">Can &Ouml;zkan</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Experience Designer
            </p>
            <div className="flex gap-4">
              <Icon
                name="palette"
                className="text-on-surface-variant text-lg cursor-pointer hover:text-primary"
              />
              <Icon
                name="mail"
                className="text-on-surface-variant text-lg cursor-pointer hover:text-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values: Tonal Shifts */}
      <section className="mb-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-surface-container-high rounded-lg p-12 md:p-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h4 className="text-2xl font-bold mb-4 text-primary">
                Transparency
              </h4>
              <p className="text-on-surface-variant">
                We track every gram of food and every liter of water, ensuring
                donor contributions go exactly where promised.
              </p>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-4 text-primary">
                Innovation
              </h4>
              <p className="text-on-surface-variant">
                Using low-energy sensors and smart scales to automate what used
                to be a manual, error-prone task.
              </p>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-4 text-primary">Empathy</h4>
              <p className="text-on-surface-variant">
                Designing with the animal&apos;s natural behavior in mind,
                placing stations in safe, quiet campus corners.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
