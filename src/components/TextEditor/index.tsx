'use client';

import { ChangeEvent } from 'react';

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  ratio: string;
  setRatio: (ratio: string) => void;
  padding: number;
  setPadding: (padding: number) => void;
  textSize: number;
  setTextSize: (textSize: number) => void;
}

export default function TextEditor({ text, setText, ratio, setRatio, padding, setPadding, textSize, setTextSize }: TextEditorProps) {
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div>
      <textarea
        rows={6}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="输入你想要转换的文字..."
        value={text}
        onChange={handleTextChange}
      />
    </div>
  );
} 