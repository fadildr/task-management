import useSWR from "swr"
import { getTaskById } from "@/services/taskApi"
import type { Task } from "@/types/task"

export function useTask(id?: string) {
  const shouldFetch = Boolean(id)
  const { data, error, isLoading, mutate } = useSWR<Task>(shouldFetch ? ["task", id] : null, () =>
    getTaskById(id as string),
  )

  return {
    task: data,
    isLoading,
    isError: !!error,
    error: error as Error | undefined,
    mutate,
  }
}
