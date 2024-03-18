import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
  filter: 'all' | 'completed' | 'uncompleted';
}
const loadTasks = () => {
  try {
    const serializedTasks = localStorage.getItem('tasks');
    if (serializedTasks === null) return [];
    return JSON.parse(serializedTasks);
  } catch (err) {
    return [];
  }
};
const initialState: TodosState = {
  todos: loadTasks(),
  filter: 'all',
};


const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now(),
        text: action.payload,
        completed: false,
      };
      state.todos.push(newTodo)
      localStorage.setItem('tasks', JSON.stringify(state.todos));
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('tasks', JSON.stringify(state.todos));
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.todos));
    },
    updateTodo: (state, action: PayloadAction<{ id: number; text: string }>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index].text = action.payload.text;
        localStorage.setItem('tasks', JSON.stringify(state.todos));
      }
    },
    setFilter: (state, action: PayloadAction<'all' | 'completed' | 'uncompleted'>) => {
      state.filter = action.payload;
    },
    reorderTodos: (state, action: PayloadAction<{startIndex: number, endIndex: number}>) => {
      const result = Array.from(state.todos);
      const [removed] = result.splice(action.payload.startIndex, 1);
      result.splice(action.payload.endIndex, 0, removed);
    
      state.todos = result;
      localStorage.setItem('tasks', JSON.stringify(state.todos));
    },
    
  }
  
});

export const { addTodo, toggleTodo, updateTodo, deleteTodo, setFilter, reorderTodos } = todosSlice.actions;
export default todosSlice.reducer;
