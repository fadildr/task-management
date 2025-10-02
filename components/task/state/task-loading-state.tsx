"use client";

import { Loading } from "@/components/ui/loading";

export function TaskLoadingState() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>
      <Loading message="Loading tasks..." />
    </div>
  );
}