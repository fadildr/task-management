import useSWR from "swr"
import { getAllTasks } from "@/services/taskApi"
import type { PaginatedTasksResponse, TaskStatus } from "@/types/task"

export function useTasks(page: number, limit: number, status?: TaskStatus) {
  const key = ["tasks", page, limit, status ?? "ALL"] as const
  const { data, error, isLoading, mutate } = useSWR<PaginatedTasksResponse>(key, () => getAllTasks(page, limit, status))

  return {
    tasks: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    isError: !!error,
    error: error as Error | undefined,
    mutate,
  }
}
