import type { Task, PaginatedTasksResponse, TaskStatus, CreateTaskDto, UpdateTaskDto } from "@/types/task"

const API_URL = process.env.NEXT_PUBLIC_API_URL

function ensureApiUrl() {
  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not set. Please add it to your Environment Variables.")
    throw new Error("API URL not configured")
  }
  return API_URL
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    try {
      const data = await res.json()
      if (data?.message) message = data.message
      if (data?.error) message = data.error
    } catch {
      // ignore json parse error
    }
    throw new Error(message)
  }
  // some endpoints might return 204 No Content (e.g., delete)
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export async function getAllTasks(page: number, limit: number, status?: TaskStatus): Promise<PaginatedTasksResponse> {
  const base = ensureApiUrl()
  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("limit", String(limit))
  if (status) params.set("status", status)
  const res = await fetch(`${base}/tasks?${params.toString()}`, { cache: "no-store" })
  return handleResponse<PaginatedTasksResponse>(res)
}

export async function getTaskById(id: string): Promise<Task> {
  const base = ensureApiUrl()
  const res = await fetch(`${base}/tasks/${id}`, { cache: "no-store" })
  return handleResponse<Task>(res)
}

export async function createTask(taskData: CreateTaskDto): Promise<Task> {
  const base = ensureApiUrl()
  const res = await fetch(`${base}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  })
  return handleResponse<Task>(res)
}

export async function updateTask(id: string, taskData: UpdateTaskDto): Promise<Task> {
  const base = ensureApiUrl()
  const res = await fetch(`${base}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  })
  return handleResponse<Task>(res)
}

export async function deleteTask(id: string): Promise<void> {
  const base = ensureApiUrl()
  const res = await fetch(`${base}/tasks/${id}`, { method: "DELETE" })
  await handleResponse<void>(res)
}
