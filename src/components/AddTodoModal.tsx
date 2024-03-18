import React, { useState, useEffect } from 'react';

interface AddTodoModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  initialText?: string;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  initialText = '',
}) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (isVisible) {
      setText(initialText);
    }
  }, [isVisible, initialText]);

  const handleSave = () => {
    onSubmit(text);
    setText('');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="border rounded-lg border-gray-300 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 z-50"
    >
      <input
        type="text"
        placeholder='write a task'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className='flex justify-between pt-4'>
        <button className='bg-green-700' onClick={handleSave}>{initialText ? 'Change' : 'Add Todo'}</button>
        <button className='bg-red-700' onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddTodoModal;