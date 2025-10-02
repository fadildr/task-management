"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Task,
  TaskStatus,
  type CreateTaskDto,
  type UpdateTaskDto,
} from "@/types/task";

type Props = {
  mode: "create" | "edit";
  initialTask?: Task;
  onSubmit: (payload: CreateTaskDto | UpdateTaskDto) => Promise<void>;
};

export function TaskForm({ mode, initialTask, onSubmit }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(
    initialTask?.description ?? ""
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialTask?.status ?? TaskStatus.TO_DO
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = title.trim().length > 0;

  const payload = useMemo<CreateTaskDto | UpdateTaskDto>(() => {
    if (mode === "create") {
      const p: CreateTaskDto = {
        title: title.trim(),
        description: description.trim() || undefined,
      };
      return p;
    }
    // For edit, send only changed fields
    const p: UpdateTaskDto = {};
    if (initialTask?.title !== title) p.title = title.trim();
    if ((initialTask?.description ?? "") !== (description ?? ""))
      p.description = description || null;
    if (initialTask?.status !== status) p.status = status;
    return p;
  }, [mode, title, description, status, initialTask]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValid) {
      setError("Title is required.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid w-full max-w-2xl gap-4 p-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
          rows={5}
        />
      </div>

      {mode === "edit" && (
        <div className="grid gap-2">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as TaskStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TaskStatus.TO_DO}>TO_DO</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>
                IN_PROGRESS
              </SelectItem>
              <SelectItem value={TaskStatus.DONE}>DONE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting || !isValid}>
          {submitting
            ? mode === "create"
              ? "Saving…"
              : "Updating…"
            : mode === "create"
            ? "Save Task"
            : "Update Task"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
