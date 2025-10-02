"use client";
import { Task } from "@/types/task";
import { Pagination } from "@/components/task/pagination";
import { TaskCard } from "./card/task-card";

interface TaskListProps {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskUpdate: (task: Task) => void;
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
}

export function TaskList({
  tasks,
  currentPage,
  totalPages,
  onPageChange,
  onTaskDelete,
  onEditTask,
}: TaskListProps) {
  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task List</h2>
      </div>

      <div className="grid gap-4 mb-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={onTaskDelete}
            variant="list"
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
