import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setFilter } from '../features/todosSlice';

const FilterSelect: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(state => state.todos.filter);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilter(event.target.value as 'all' | 'completed' | 'uncompleted'));
  };

  return (
    <select value={filter} onChange={handleChange}>
      <option value="all">All</option>
      <option value="completed">Completed</option>
      <option value="uncompleted">Uncompleted</option>
    </select>
  );
};

export default FilterSelect;