"use client";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/task/status-badge";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  variant?: "list" | "board";
  isDragging?: boolean;
  dragAttributes?: React.HTMLAttributes<HTMLElement>;
  dragListeners?: React.DOMAttributes<HTMLElement>;
  dragRef?: (node: HTMLElement | null) => void;
  dragStyle?: React.CSSProperties;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  variant = "list",
  isDragging = false,
  dragAttributes,
  dragListeners,
  dragRef,
  dragStyle,
}: TaskCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const cardClasses = cn(
    "rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 p-4 mb-3 min-h-[160px] hover:cursor-pointer flex flex-col",
    isDragging && "opacity-50 shadow-lg scale-105"
  );

  const titleClasses = cn(
    "font-semibold text-gray-900 dark:text-gray-100",
    variant === "list" ? "text-lg mb-2" : "text-sm line-clamp-2 flex-1"
  );

  const descriptionClasses = cn(
    "text-gray-600 dark:text-gray-300",
    variant === "list"
      ? "mb-3 line-clamp-2"
      : "text-xs line-clamp-4 flex-1 mb-3"
  );

  const buttonSize = variant === "list" ? "sm" : "sm";
  const buttonVariant = variant === "list" ? "outline" : "ghost";
  const buttonClasses =
    variant === "list"
      ? "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
      : "h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600";

  const deleteButtonClasses =
    variant === "list"
      ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
      : "h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600";

  const dateDisplay =
    variant === "list"
      ? `Created ${new Date(task.createdAt).toLocaleDateString()}`
      : new Date(task.createdAt).toLocaleDateString();

  const statusAndDateLayout =
    variant === "list"
      ? "flex items-center gap-2 mb-3"
      : "flex items-center justify-between mt-auto";

  const buttonLayout = variant === "list" ? "flex gap-2" : "flex gap-1 ml-2";

  return (
    <div
      ref={dragRef}
      style={dragStyle}
      className={cardClasses}
      {...dragAttributes}
      {...dragListeners}
    >
      <div
        className={cn(
          "flex justify-between items-start",
          variant === "list" && "flex-col sm:flex-row gap-4"
        )}
      >
        <div className="flex-1 min-w-0">
          <h3 className={titleClasses}>{task.title}</h3>
          {task.description && (
            <p className={descriptionClasses}>{task.description}</p>
          )}
          {variant === "board" && !task.description && (
            <div className="h-4"></div>
          )}

          <div className={statusAndDateLayout}>
            <StatusBadge status={task.status} />
            {variant === "list" ? (
              <Badge variant="outline">{dateDisplay}</Badge>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {dateDisplay}
              </span>
            )}
          </div>
        </div>

        <div className={buttonLayout}>
          <Button
            onClick={handleEdit}
            variant={buttonVariant}
            size={buttonSize}
            className={cn(
              buttonClasses,
              variant === "board" && "hover:text-blue-600"
            )}
          >
            <Edit className={cn("w-4 h-4", variant === "board" && "w-3 h-3")} />
            {variant === "list" && <span className="ml-1">Edit</span>}
          </Button>
          <Button
            onClick={handleDelete}
            variant={buttonVariant}
            size={buttonSize}
            className={cn(
              deleteButtonClasses,
              variant === "board" && "hover:text-red-600"
            )}
          >
            <Trash2
              className={cn("w-4 h-4", variant === "board" && "w-3 h-3")}
            />
            {variant === "list" && <span className="ml-1">Delete</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
