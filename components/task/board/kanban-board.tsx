"use client";
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragMoveEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus } from "@/types/task";
import { updateTask } from "@/services/taskApi";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { TaskCard } from "../card/task-card";

interface SortableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

function SortableTaskCard({ task, onEdit, onDelete }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TaskCard
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
      variant="board"
      isDragging={isDragging}
      dragAttributes={attributes}
      dragListeners={listeners}
      dragRef={setNodeRef}
      dragStyle={style}
    />
  );
}

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragOver?: boolean;
  isDragging?: boolean;
}

function KanbanColumn({
  status,
  tasks,
  onEdit,
  onDelete,
  isDragOver,
  isDragging,
}: KanbanColumnProps) {
  const { attributes, listeners, setNodeRef } = useSortable({ id: status });

  const columnColors = {
    [TaskStatus.TO_DO]: "border-blue-200 bg-blue-50 dark:bg-blue-900/20",
    [TaskStatus.IN_PROGRESS]:
      "border-orange-200 bg-orange-50 dark:bg-orange-900/20",
    [TaskStatus.DONE]: "border-green-200 bg-green-50 dark:bg-green-900/20",
  };

  const columnHeaders = {
    [TaskStatus.TO_DO]: "To Do",
    [TaskStatus.IN_PROGRESS]: "In Progress",
    [TaskStatus.DONE]: "Done",
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 min-w-[300px] max-w-[400px] rounded-lg border-2 p-4",
        columnColors[status],
        "transition-colors duration-200",
        isDragOver &&
          isDragging &&
          "border-dashed border-4 border-gray-400 bg-gray-100 dark:bg-gray-800"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {columnHeaders[status]}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 h-[700px] overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <p className="text-sm">Drop tasks here</p>
            </div>
          )}
          {isDragOver && isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg border-2 border-dashed border-blue-400 z-10">
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Drag Here
                </p>
                <p className="text-sm text-blue-500 dark:text-blue-300">
                  Drop task to move to {columnHeaders[status]}
                </p>
              </div>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
}

export function KanbanBoard({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onEditTask,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksByStatus = {
    [TaskStatus.TO_DO]: tasks.filter(
      (task) => task.status === TaskStatus.TO_DO
    ),
    [TaskStatus.IN_PROGRESS]: tasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS
    ),
    [TaskStatus.DONE]: tasks.filter((task) => task.status === TaskStatus.DONE),
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { over } = event;
    if (over) {
      // Check if hovering over a column
      if (Object.values(TaskStatus).includes(over.id as TaskStatus)) {
        setDragOverColumn(over.id as string);
      } else {
        // Check if hovering over a task within a column
        const overTask = tasks.find((task) => task.id === over.id);
        if (overTask) {
          setDragOverColumn(overTask.status);
        }
      }
    } else {
      setDragOverColumn(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) {
      setActiveId(null);
      return;
    }

    // Check if dropped on a different status column
    let newStatus: TaskStatus | null = null;

    if (
      over.id === TaskStatus.TO_DO ||
      tasksByStatus[TaskStatus.TO_DO].some((task) => task.id === over.id)
    ) {
      newStatus = TaskStatus.TO_DO;
    } else if (
      over.id === TaskStatus.IN_PROGRESS ||
      tasksByStatus[TaskStatus.IN_PROGRESS].some((task) => task.id === over.id)
    ) {
      newStatus = TaskStatus.IN_PROGRESS;
    } else if (
      over.id === TaskStatus.DONE ||
      tasksByStatus[TaskStatus.DONE].some((task) => task.id === over.id)
    ) {
      newStatus = TaskStatus.DONE;
    }

    if (newStatus && newStatus !== activeTask.status) {
      try {
        const updatedTask = await updateTask(activeTask.id, {
          status: newStatus,
        });
        onTaskUpdate(updatedTask);
        toast({
          title: "Task moved successfully",
          description: `"${activeTask.title}" moved to ${newStatus.replace(
            "_",
            " "
          )}`,
        });
      } catch (error) {
        console.error("Failed to update task status:", error);
        toast({
          title: "Failed to move task",
          description:
            "An error occurred while moving the task. Please try again.",
          variant: "destructive",
        });
      }
    }

    setActiveId(null);
    setDragOverColumn(null);
  };

  const activeTask = activeId
    ? tasks.find((task) => task.id === activeId)
    : null;

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4 justify-center">
          {Object.values(TaskStatus).map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onEdit={onEditTask}
              onDelete={onTaskDelete}
              isDragOver={dragOverColumn === status}
              isDragging={!!activeId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="opacity-90 transform rotate-2">
              <TaskCard
                task={activeTask}
                onEdit={onEditTask}
                onDelete={onTaskDelete}
                variant="board"
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
