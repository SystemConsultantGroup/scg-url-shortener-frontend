"use client";

import AnimatedInput from "@/components/ui/AnimatedInput";
import MagneticButton from "@/components/ui/MagneticButton";
import { api } from "@/lib/api";
import { ArrowRight, CheckCircle, Copy, Link } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useState } from "react";

interface UrlFormProps {
  onSubmit?: (slug: string, targetUrl: string) => void;
}

export default function UrlForm({ onSubmit }: UrlFormProps) {
  const [slug, setSlug] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [slugError, setSlugError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateSlug = (value: string) => {
    if (!value) {
      setSlugError("Slug is required");
      return false;
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
      setSlugError("Alphanumeric only");
      return false;
    }
    setSlugError("");
    return true;
  };

  const validateUrl = (value: string) => {
    if (!value) {
      setUrlError("URL is required");
      return false;
    }
    try {
      new URL(value);
      setUrlError("");
      return true;
    } catch {
      setUrlError("Invalid URL");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isSlugValid = validateSlug(slug);
    const isUrlValid = validateUrl(targetUrl);

    if (!isSlugValid || !isUrlValid) return;

    setIsSubmitting(true);

    try {
      await api.post("/urls", { targetUrl, slug });
      setIsSubmitting(false);
      setShowSuccess(true);
      onSubmit?.(slug, targetUrl);

      setTimeout(() => {
        setShowSuccess(false);
        setSlug("");
        setTargetUrl("");
      }, 3000);
    } catch (error) {
      console.error("Failed to create short link:", error);
      setUrlError("Failed to create. Try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatedInput
          label="Custom Slug"
          placeholder="my-link"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugError("");
          }}
          onBlur={(e) => validateSlug(e.target.value)}
          icon={<Link className="h-5 w-5" />}
          prefix="scg.sh/"
          error={slugError}
          maxLength={50}
        />

        <AnimatedInput
          label="Target URL"
          placeholder="https://example.com"
          value={targetUrl}
          onChange={(e) => {
            setTargetUrl(e.target.value);
            setUrlError("");
          }}
          onBlur={(e) => validateUrl(e.target.value)}
          icon={<Link className="h-5 w-5" />}
          error={urlError}
        />

        <div className="pt-4">
          <MagneticButton
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-foreground text-background"
          >
            {isSubmitting ? (
              "Creating..."
            ) : (
              <span className="flex items-center gap-2">
                Create Link <ArrowRight />
              </span>
            )}
          </MagneticButton>
        </div>
      </form>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center justify-between rounded-lg bg-emerald-50 p-4 text-emerald-900"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5" weight="fill" />
            <span className="font-medium">/{slug}</span>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(`/${slug}`)}
            className="rounded p-2 hover:bg-emerald-100"
          >
            <Copy className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
