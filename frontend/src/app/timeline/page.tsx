"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { fetchProjects } from "@/lib/projects";

export default function TimelineIndexPage() {
  const router = useRouter();

  useEffect(() => {
    async function resolveProject() {
      try {
        const projects = await fetchProjects(1);
        if (projects[0]) {
          router.replace(`/timeline/${projects[0].id}`);
          return;
        }
      } catch {}

      router.replace("/projects");
    }

    resolveProject();
  }, [router]);

  return null;
}
