
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  placeholder: string;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, placeholder, disabled }) => {
  return (
    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder={placeholder}
      rows={4}
      disabled={disabled}
      className="w-full p-3 bg-base-200 border-2 border-base-300 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors disabled:opacity-50"
    />
  );
};
