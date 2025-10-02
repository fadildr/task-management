"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateTask, getTaskById } from "@/services/taskApi";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "@/components/task";
import { UpdateTaskDto, Task } from "@/types/task";
import { Button } from "@/components/ui/button";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const taskId = params?.id as string;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTaskById(taskId);
        setTask(fetchedTask);
      } catch (err) {
        console.error("Failed to fetch task:", err);
        setError("Failed to load task. Please try again.");
        toast({
          title: "Failed to load task",
          description: "An error occurred while loading the task.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId, toast]);

  const handleSubmit = async (payload: UpdateTaskDto) => {
    try {
      await updateTask(taskId, payload);
      toast({
        title: "Task updated successfully",
      });
      router.push("/tasks");
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">Loading task...</div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center text-red-600">
            {error || "Task not found"}
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" onClick={() => router.push("/tasks")}>
              Back to Tasks
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/tasks")}>
          ← Back to Tasks
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
        <TaskForm mode="edit" initialTask={task} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
