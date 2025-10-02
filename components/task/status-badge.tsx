import { Badge } from "@/components/ui/badge"
import { TaskStatus } from "@/types/task"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: TaskStatus }) {
  const color = {
    [TaskStatus.TO_DO]: "bg-blue-100 text-blue-700",
    [TaskStatus.IN_PROGRESS]: "bg-orange-100 text-orange-700",
    [TaskStatus.DONE]: "bg-green-100 text-green-700",
  }[status]

  return <Badge className={cn("rounded-md", color)}>{status.replace("_", " ")}</Badge>
}
