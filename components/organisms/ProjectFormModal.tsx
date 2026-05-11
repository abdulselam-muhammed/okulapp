"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "@/components/atoms";
import { FormField, SelectField, ImageUpload, MultiImageUpload } from "@/components/molecules";
import { useProjectsStore, useToastStore, type ProjectItem } from "@/lib/stores";

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  project?: ProjectItem | null; // null = create mode, set = edit mode
}

export default function ProjectFormModal({ open, onClose, project }: ProjectFormModalProps) {
  const addProject = useProjectsStore((s) => s.addProject);
  const updateProject = useProjectsStore((s) => s.updateProject);
  const getProject = useProjectsStore((s) => s.getProject);
  const addToast = useToastStore((s) => s.addToast);

  const isEdit = !!project;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [status, setStatus] = useState("active");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [donationGoal, setDonationGoal] = useState("");
  const [donationRaised, setDonationRaised] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill when editing
  useEffect(() => {
    if (open && project) {
      setTitle(project.title);
      setDescription(project.description);
      setCoverUrl(project.cover_image_url);
      setStatus(project.status);
      setStartDate(project.start_date ? project.start_date.split("T")[0] : "");
      setEndDate(project.end_date ? project.end_date.split("T")[0] : "");
      setDonationGoal(project.donation_goal != null ? String(project.donation_goal) : "");
      setDonationRaised(String(project.donation_raised ?? 0));

      // Fetch latest images from API
      getProject(project.id).then((full) => {
        if (full?.images) {
          setGalleryUrls(full.images.map((i) => i.image_url));
        }
      });
    } else if (open && !project) {
      // Reset for create mode
      setTitle("");
      setDescription("");
      setCoverUrl(null);
      setGalleryUrls([]);
      setStatus("active");
      setStartDate("");
      setEndDate("");
      setDonationGoal("");
      setDonationRaised("");
    }
  }, [open, project, getProject]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) { addToast("Please enter a title"); return; }
    if (!description.trim()) { addToast("Please enter a description"); return; }

    const payload = {
      title,
      description,
      status: status as ProjectItem["status"],
      ...(coverUrl && { cover_image_url: coverUrl }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(donationGoal && { donation_goal: parseFloat(donationGoal) }),
      ...(donationRaised && { donation_raised: parseFloat(donationRaised) }),
      image_urls: galleryUrls,
    };

    setLoading(true);
    const success = isEdit && project
      ? await updateProject(project.id, payload)
      : await addProject(payload);
    setLoading(false);

    if (success) onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Project" : "New Project"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          id="project_title"
          label="Title"
          placeholder="Winter Shelter Drive"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon="folder_special"
        />

        <div className="space-y-2">
          <label className="block font-label text-sm font-semibold text-on-surface-variant px-1">
            Description
          </label>
          <textarea
            className="w-full px-4 py-4 bg-surface-container-low border-none rounded-md font-body text-sm text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all"
            placeholder="Describe the project..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <ImageUpload label="Cover Image" value={coverUrl} onChange={setCoverUrl} />

        <MultiImageUpload label="Gallery Images" values={galleryUrls} onChange={setGalleryUrls} />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            id="project_status"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={STATUS_OPTIONS}
            icon="flag"
          />
          <FormField
            id="project_goal"
            label="Donation Goal ($)"
            type="number"
            placeholder="5000"
            value={donationGoal}
            onChange={(e) => setDonationGoal(e.target.value)}
            icon="payments"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="project_start"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            icon="calendar_today"
          />
          <FormField
            id="project_end"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            icon="event"
          />
        </div>

        {isEdit && (
          <FormField
            id="project_raised"
            label="Donation Raised ($)"
            type="number"
            placeholder="0"
            value={donationRaised}
            onChange={(e) => setDonationRaised(e.target.value)}
            icon="volunteer_activism"
          />
        )}

        <div className="pt-2">
          <Button type="submit" fullWidth loading={loading} icon={isEdit ? "save" : "add"}>
            {isEdit ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
