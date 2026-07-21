import api from "./api";

export async function getTasks() {
  const response = await api.get("/tasks");
  return response.data.data;
}

export async function createTask(taskData) {
  const response = await api.post("/tasks", {
    task: taskData,
  });

  return response.data.data;
}

export async function updateTask(id, taskData) {
  if (!id) {
    throw new Error("Task ID is missing");
  }

  const response = await api.patch(`/tasks/${id}`, {
    task: taskData,
  });

  return response.data.data;
}

export async function deleteTask(id) {
  if (!id) {
    throw new Error("Task ID is missing");
  }

  await api.delete(`/tasks/${id}`);
}