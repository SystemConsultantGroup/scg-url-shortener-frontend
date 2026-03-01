"use client";

import AnimatedInput from "@/components/ui/AnimatedInput";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import MagneticButton from "@/components/ui/MagneticButton";
import Modal from "@/components/ui/Modal";
import TextReveal from "@/components/ui/TextReveal";
import UrlForm from "@/components/ui/UrlForm";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  ChartBar,
  Link as LinkIcon,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import { ReactLenis } from "lenis/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LinkData = {
  urlId: number;
  slug: string;
  targetUrl: string;
  totalClicks: number;
  createdAt: string;
};

type UserData = {
  email: string;
  name: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkData[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Sort State
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  // Modal States
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [deletingLink, setDeletingLink] = useState<LinkData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit Form States
  const [newSlug, setNewSlug] = useState("");
  const [newTargetUrl, setNewTargetUrl] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [userData, linksResponse] = await Promise.all([
        api.get<{ user: UserData }>("/api/v1/user"),
        api.get<{
          data: LinkData[];
          meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        }>(`/api/v1/urls?page=${page}&limit=5&sort=${sort}`),
      ]);
      setUser(userData.user);
      setLinks(linksResponse.data);
      setMeta(linksResponse.meta);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const handleEditClick = (link: LinkData) => {
    setEditingLink(link);
    setNewSlug(link.slug);
    setNewTargetUrl(link.targetUrl);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    setIsProcessing(true);
    try {
      await api.patch(`/api/v1/urls/${editingLink.urlId}`, {
        slug: newSlug,
        targetUrl: newTargetUrl,
      });
      await fetchData();
      setEditingLink(null);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLink) return;
    setIsProcessing(true);
    try {
      await api.delete(`/api/v1/urls/${deletingLink.urlId}`);
      await fetchData();
      setDeletingLink(null);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ReactLenis root>
      <div className="min-h-screen bg-soft-gray p-8 selection:bg-foreground selection:text-background">
        <nav className="mb-20 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-foreground"
          >
            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="text-sm font-bold tracking-widest uppercase text-foreground">
            {user?.name || "Dashboard"}
          </div>
        </nav>

        <main className="mx-auto max-w-6xl">
          <div className="mb-24">
            <TextReveal>
              <h1 className="font-display text-[8vw] leading-none tracking-tighter text-foreground md:text-[6vw]">
                Overview.
              </h1>
            </TextReveal>
            <p className="mt-6 max-w-md text-xl text-zinc-500">
              Manage your links and access analytics. Keep it simple.
            </p>
          </div>

          <div className="grid gap-16 lg:grid-cols-[1fr,1.5fr]">
            <div className="space-y-12">
              <div className="rounded-3xl bg-background p-8 shadow-sm">
                <h2 className="mb-8 text-2xl font-bold tracking-tight">
                  Create New
                </h2>
                <UrlForm onSubmit={() => fetchData()} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold">{meta.total} Active</span>
                <select
                  className="rounded-lg border-none bg-zinc-100 py-1 pl-3 pr-8 text-xs font-bold uppercase tracking-wider text-zinc-500 focus:ring-0 dark:bg-zinc-800"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1); // Reset to page 1 on sort change
                  }}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-clicks">Most Clicks</option>
                  <option value="least-clicks">Least Clicks</option>
                </select>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-zinc-400">
                  Loading...
                </div>
              ) : links.length === 0 ? (
                <div className="py-12 text-center text-zinc-400">
                  No links found.
                </div>
              ) : (
                <div className="space-y-4">
                  {links.map((link) => (
                    <div
                      key={link.urlId}
                      onClick={() => router.push(`/analytics/${link.slug}`)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-background p-6 transition-all hover:bg-white hover:shadow-lg dark:hover:bg-zinc-800"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="mb-1 font-display text-2xl font-bold">
                            /{link.slug}
                          </h3>
                          <p className="text-sm text-zinc-400 truncate max-w-xs">
                            {link.targetUrl}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="block text-3xl font-bold">
                            {link.totalClicks}
                          </span>
                          <span className="text-xs uppercase tracking-wide text-zinc-400">
                            Clicks
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 border-t border-zinc-100 overflow-hidden transition-all duration-300 ease-out max-h-0 opacity-0 mt-0 pt-0 group-hover:max-h-20 group-hover:mt-6 group-hover:pt-4 group-hover:opacity-100 dark:border-zinc-700">
                        <span className="text-xs font-medium text-zinc-400">
                          Created{" "}
                          {new Date(link.createdAt).toLocaleDateString()}
                        </span>
                        <div
                          className="ml-auto flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              router.push(`/analytics/${link.slug}`)
                            }
                            className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            title="Analytics"
                          >
                            <ChartBar weight="bold" />
                          </button>
                          <button
                            onClick={() => handleEditClick(link)}
                            className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            title="Edit"
                          >
                            <PencilSimple weight="bold" />
                          </button>
                          <button
                            onClick={() => setDeletingLink(link)}
                            className="rounded p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete"
                          >
                            <Trash weight="bold" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination Controls */}
                  {meta.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-8">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100"
                      >
                        Prev
                      </button>
                      <span className="text-sm font-medium text-zinc-500">
                        {page} / {meta.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(meta.totalPages, p + 1))
                        }
                        disabled={page === meta.totalPages}
                        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingLink}
        onClose={() => setEditingLink(null)}
        title="Edit Link"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          <AnimatedInput
            label="Slug"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            icon={<LinkIcon className="h-5 w-5" />}
            prefix="scg.sh/"
          />
          <AnimatedInput
            label="Target URL"
            value={newTargetUrl}
            onChange={(e) => setNewTargetUrl(e.target.value)}
            icon={<LinkIcon className="h-5 w-5" />}
          />
          <div className="flex justify-end pt-4">
            <MagneticButton className="w-full bg-foreground text-background">
              {isProcessing ? "Saving..." : "Save Changes"}
            </MagneticButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingLink}
        onClose={() => setDeletingLink(null)}
        onConfirm={handleDelete}
        title="Delete Link"
        description={`Are you sure you want to delete /${deletingLink?.slug}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isProcessing}
      />
    </ReactLenis>
  );
}
