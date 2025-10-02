"use client";

interface TaskErrorStateProps {
  error: Error;
}

export function TaskErrorState({ error }: TaskErrorStateProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center text-red-600">
        <p className="text-lg">Failed to load tasks</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    </div>
  );
}