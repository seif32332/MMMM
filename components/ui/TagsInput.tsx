import React, { useState } from 'react';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagsInput: React.FC<TagsInputProps> = ({ value = [], onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
      {value.map(tag => (
        <div key={tag} className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-1 rtl:ml-2 rtl:mr-0">
          <span>{tag}</span>
          <button
            type="button"
            className="ml-2 rtl:mr-2 text-gray-500 hover:text-gray-700"
            onClick={() => removeTag(tag)}
          >
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-grow bg-transparent outline-none placeholder:text-muted-foreground min-w-[100px]"
      />
    </div>
  );
};