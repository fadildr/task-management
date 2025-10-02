"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTasks } from "@/hooks/use-tasks";
import { deleteTask } from "@/services/taskApi";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskStatus } from "@/types/task";
import { KanbanBoard } from "@/components/task/board/kanban-board";
import { TaskHeader } from "@/components/task/task-header";
import { TaskList } from "@/components/task/task-list";
import { EmptyState } from "@/components/task/state/empty-state";
import { TaskLoadingState } from "@/components/task/state/task-loading-state";
import { TaskErrorState } from "@/components/task/state/task-error-state";
import { ConfirmDeleteDialog } from "@/components/task/confirm-delete-dialog";

export default function TaskListPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "board">("board");
  const limit = 10;
  const router = useRouter();

  const statusFilter = status === "all" ? undefined : status;
  const {
    tasks = [],
    totalPages = 1,
    error,
    isLoading,
    mutate,
  } = useTasks(page, limit, statusFilter);

  const handleDelete = async () => {
    if (!deleteTaskId) return;

    try {
      await deleteTask(deleteTaskId);
      toast({
        title: "Task deleted successfully",
        description: "The task has been removed from your list.",
      });
      setDeleteTaskId(null);
      mutate();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete task",
        description:
          "An error occurred while deleting the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTaskUpdate = () => {
    mutate();
  };

  const handleCreateTask = () => {
    router.push("/tasks/create");
  };

  const handleEditTask = (task: Task) => {
    router.push(`/tasks/edit/${task.id}`);
  };

  if (isLoading) {
    return <TaskLoadingState />;
  }

  if (error) {
    return <TaskErrorState error={error} />;
  }

  if (tasks.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <TaskHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          status={status}
          setStatus={setStatus}
          setPage={setPage}
        />
        <EmptyState viewMode={viewMode} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <TaskHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        status={status}
        setStatus={setStatus}
        setPage={setPage}
      />

      {viewMode === "board" && tasks.length > 0 && (
        <KanbanBoard
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={setDeleteTaskId}
          onCreateTask={handleCreateTask}
          onEditTask={handleEditTask}
        />
      )}

      {viewMode === "list" && tasks.length > 0 && (
        <TaskList
          tasks={tasks}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onTaskDelete={setDeleteTaskId}
          onTaskUpdate={handleTaskUpdate}
          onCreateTask={handleCreateTask}
          onEditTask={handleEditTask}
        />
      )}

      {tasks.length === 0 && <EmptyState viewMode={viewMode} />}

      <ConfirmDeleteDialog
        open={!!deleteTaskId}
        onOpenChange={(open) => !open && setDeleteTaskId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
