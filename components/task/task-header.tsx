"use client";

import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@/types/task";
import { useRouter } from "next/navigation";

interface TaskHeaderProps {
  viewMode: "list" | "board";
  setViewMode: (mode: "list" | "board") => void;
  status: TaskStatus | "all";
  setStatus: (status: TaskStatus | "all") => void;
  setPage: (page: number) => void;
}

export function TaskHeader({
  viewMode,
  setViewMode,
  status,
  setStatus,
  setPage,
}: TaskHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="flex gap-1">
          <Button
            variant={viewMode === "board" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("board")}
            className="flex items-center gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            Board
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            List
          </Button>
        </div>
        {
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as TaskStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={TaskStatus.TO_DO}>To Do</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>
                In Progress
              </SelectItem>
              <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
            </SelectContent>
          </Select>
        }
        <Button
          onClick={() => router.push("/tasks/create")}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>
    </div>
  );
}
