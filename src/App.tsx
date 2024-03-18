import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { addTodo, toggleTodo, deleteTodo, updateTodo, reorderTodos } from './features/todosSlice';
import AddTodoModal from './components/AddTodoModal';
import FilterSelect from './components/FilterSelect';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';


function App() {
  const todos = useAppSelector((state) => state.todos.todos);
  const filter = useAppSelector((state) => state.todos.filter);
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<{ id: number; text: string } | null>(null);


  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'uncompleted') return !todo.completed;
    return true;
  });

  const handleEditTodo = (todo: { id: number; text: string }) => {
    setEditingTodo(todo);
    setIsModalVisible(true);
  };

  const handleSaveEditedTodo = (text: string) => {
    if (editingTodo) {
      dispatch(updateTodo({ ...editingTodo, text }));
      setEditingTodo(null);
    } else {
      dispatch(addTodo(text));
    }
  };
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    dispatch(reorderTodos({
      startIndex: result.source.index,
      endIndex: result.destination.index,
    }));
  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='relative max-w-screen-xl mx-auto p-10'>
        <button className='bg-green-700 mb-2' onClick={() => {
          setEditingTodo(null);
          setIsModalVisible(true);
        }}>Add Todo</button>
        <FilterSelect />
        <Droppable droppableId="todos">
          {(provided: DroppableProvided) => (
            <ul className="w-full max-w-full" {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTodos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                  {(provided: DraggableProvided) => (
                    <li className='flex items-center py-1 gap-4 justify-between' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => dispatch(toggleTodo(todo.id))}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="break-words overflow-hidden line-clamp-2 overflow-hidden" >{todo.text}</p>
                      </div>
                      <div className='flex gap-2'>
                        <button className='bg-blue-700' onClick={() => handleEditTodo({ id: todo.id, text: todo.text })}>Edit</button>
                        <button className='bg-red-700' onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
      <AddTodoModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSaveEditedTodo}
        initialText={editingTodo?.text || ''}
      />
    </DragDropContext>
  );
}

export default App;