"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
  viewMode: "list" | "board";
}

export function EmptyState({ viewMode }: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg mb-4">
        {viewMode === "board" ? "No tasks in your board yet" : "No tasks found"}
      </p>
      <Button
        onClick={() => router.push("/tasks/create")}
        variant="outline"
      >
        Create your first task
      </Button>
    </div>
  );
}
