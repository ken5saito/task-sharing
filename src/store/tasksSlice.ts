import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Task = {
  id: number;
  title: string;
  category: string;
  assignee: string;
  memo: string;
  completed: boolean;
};

const initialState: Task[] = [];

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    toggleCompleted: (state, action: PayloadAction<number>) => {
      const task = state.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    addTask: (state, action: PayloadAction<Omit<Task, "id">>) => {
      const maxId = state.length > 0 ? Math.max(...state.map((t) => t.id)) : 0;
      state.push({ ...action.payload, id: maxId + 1 });
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const idx = state.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state[idx] = action.payload;
      }
    },
  },
});

export const { toggleCompleted, addTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
