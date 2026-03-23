"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { fetchProjects } from "@/lib/projects";

export default function VoiceIndexPage() {
  const router = useRouter();

  useEffect(() => {
    async function resolveProject() {
      try {
        const projects = await fetchProjects(1);
        if (projects[0]) {
          router.replace(`/voice/${projects[0].id}`);
          return;
        }
      } catch {}

      router.replace("/projects");
    }

    resolveProject();
  }, [router]);

  return null;
}
