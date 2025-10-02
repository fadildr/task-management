"use client";

import { useRouter } from "next/navigation";
import { createTask } from "@/services/taskApi";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "@/components/task";
import { CreateTaskDto, UpdateTaskDto } from "@/types/task";
import { Button } from "@/components/ui/button";

export default function CreateTaskPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (payload: CreateTaskDto | UpdateTaskDto) => {
    try {
      const createPayload = payload as CreateTaskDto;
      await createTask(createPayload);
      toast({
        title: "Task created successfully",
      });
      router.push("/tasks");
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/tasks")}>
          ← Back to Tasks
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
        <TaskForm mode="create" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
