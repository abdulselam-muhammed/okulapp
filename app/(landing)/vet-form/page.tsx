import { Icon } from "@/components/atoms";

export default function VetFormPage() {
  return (
    <main className="flex-grow pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-semibold mb-2 block">Healthcare Administration</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-background leading-tight">Veterinary Examination Record</h1>
          <p className="mt-4 text-on-surface-variant max-w-2xl text-lg">Documenting life-saving care with precision. Ensure all fields are completed for accurate historical tracking of our sanctuary residents.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Section */}
          <form className="lg:col-span-8 space-y-8">
            {/* Section 1: Animal Identification */}
            <div className="bg-surface-container-low p-8 rounded-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Icon name="fingerprint" className="text-primary" />
                Resident Identification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Animal ID / Name</label>
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-md p-4 ring-1 ring-outline-variant/15 focus:ring-primary transition-all placeholder:text-zinc-400"
                    placeholder="e.g. CC-2024-BELLA"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Species / Breed</label>
                  <select className="w-full bg-surface-container-lowest border-none rounded-md p-4 ring-1 ring-outline-variant/15 focus:ring-primary transition-all appearance-none">
                    <option>Canine (Dog)</option>
                    <option>Feline (Cat)</option>
                    <option>Equine (Horse)</option>
                    <option>Caprine (Goat)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Clinical Assessment */}
            <div className="bg-surface-container p-8 rounded-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Icon name="stethoscope" className="text-primary" />
                Clinical Assessment
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Observed Symptoms</label>
                  <textarea
                    className="w-full bg-surface-container-lowest border-none rounded-md p-4 ring-1 ring-outline-variant/15 focus:ring-primary transition-all"
                    placeholder="Describe behavior, physical abnormalities, or appetite changes..."
                    rows={3}
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Primary Diagnosis</label>
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-md p-4 ring-1 ring-outline-variant/15 focus:ring-primary transition-all"
                      placeholder="Medical condition..."
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Vitals (Weight/Temp)</label>
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-md p-4 ring-1 ring-outline-variant/15 focus:ring-primary transition-all"
                      placeholder="e.g. 12kg / 38.5&deg;C"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Treatment & Planning */}
            <div className="bg-surface-container-high p-8 rounded-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Icon name="vaccines" className="text-primary" />
                Treatment &amp; Planning
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Vaccinations Administered</label>
                  <div className="flex flex-wrap gap-3 py-2">
                    <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                      Rabies <Icon name="close" className="text-xs" />
                    </span>
                    <span className="bg-secondary-fixed-dim text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                      Distemper <Icon name="add" className="text-xs" />
                    </span>
                    <span className="bg-secondary-fixed-dim text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                      Parvovirus <Icon name="add" className="text-xs" />
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Treatment Notes</label>
                  <textarea
                    className="w-full bg-surface-container-lowest border-none rounded-md p-4 ring-1 ring-outline-variant/15 focus:ring-primary transition-all"
                    placeholder="Medication dosage, surgical notes, or specialized diet..."
                    rows={3}
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Follow-up Date</label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-lowest border-none rounded-md p-4 ring-1 ring-outline-variant/15 focus:ring-primary transition-all"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Urgency Level</label>
                    <div className="flex gap-4 p-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          className="text-primary focus:ring-primary border-outline-variant bg-surface-container-lowest"
                          name="urgency"
                          type="radio"
                        />
                        <span>Routine</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          className="text-error focus:ring-error border-outline-variant bg-surface-container-lowest"
                          name="urgency"
                          type="radio"
                        />
                        <span>Urgent</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                className="flex-1 bg-primary text-on-primary py-4 rounded-full font-bold text-lg hover:bg-primary-dim transition-all shadow-md flex items-center justify-center gap-2"
                type="submit"
              >
                <Icon name="save" />
                Submit Medical Record
              </button>
              <button
                className="px-8 py-4 rounded-full font-bold text-on-surface-variant bg-surface-container-highest hover:bg-surface-dim transition-all"
                type="reset"
              >
                Discard Draft
              </button>
            </div>
          </form>

          {/* Sidebar Content */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Summary Card */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-outline-variant/10">
              <div className="w-full h-48 rounded-md mb-6 overflow-hidden">
                <img
                  alt="Veterinary Examination"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcXm-lQqvzr-BTyM65YDexuwe7Vu1vSlvaX0LCg_AO89HEvByBHq5CSEyl8yA3UqFuTDMGM7erqom0JA6m268dEdkpO6vOfI_puUDXGOxM3hGJfDMr8s60x7mzHKs2ebm9jo_7OTpbnOQ-_JNGPa5MkP76HZ-mbORovJe778j7AICHm8dgF14nxwYwWAiqFjeGpyZZyYNUoFfb5VgS6Ml3A6n_C1HnLAdBXew4PAA7FiBpad59WsMFaT0TgW23ZSWIOFcgGbsILKM"
                />
              </div>
              <h3 className="text-xl font-bold mb-4">Documentation Guidelines</h3>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li className="flex gap-3">
                  <Icon name="check_circle" className="text-primary text-lg" />
                  Ensure ID matches the sanctuary database.
                </li>
                <li className="flex gap-3">
                  <Icon name="check_circle" className="text-primary text-lg" />
                  All vaccination lot numbers must be recorded.
                </li>
                <li className="flex gap-3">
                  <Icon name="check_circle" className="text-primary text-lg" />
                  Photos should be uploaded for wound tracking.
                </li>
              </ul>
            </div>

            {/* Quick Contacts */}
            <div className="bg-secondary-container p-8 rounded-lg">
              <h3 className="text-lg font-bold text-on-secondary-container mb-4">Emergency Support</h3>
              <p className="text-sm text-on-secondary-container/80 mb-6 leading-relaxed">If this case requires immediate surgical intervention or external referral, contact the emergency coordinator.</p>
              <a
                className="block w-full text-center bg-on-secondary-container text-white py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
                href="tel:5550199"
              >
                Call Emergency Line
              </a>
            </div>

            {/* Stats / Mini Bento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-highest p-4 rounded-md text-center">
                <span className="block text-2xl font-extrabold text-primary">14</span>
                <span className="text-xs uppercase font-bold text-on-surface-variant">Checks Today</span>
              </div>
              <div className="bg-surface-container-highest p-4 rounded-md text-center">
                <span className="block text-2xl font-extrabold text-primary">85%</span>
                <span className="text-xs uppercase font-bold text-on-surface-variant">Health Rate</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
