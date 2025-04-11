'use client';

import { useEffect } from 'react';
import { Template } from '@/types/template';

// 预定义的模板
const TEMPLATES: Template[] = [
  {
    id: 'business',
    name: '简约',
    description: '适合商业文案、引言分享',
    thumbnail: '',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    fontFamily: 'sans',
    style: {
      container: 'bg-white border border-gray-200 shadow-sm',
      text: 'text-gray-800 font-medium',
    },
  },
  {
    id: 'literary',
    name: '文艺',
    description: '适合文学摘录、诗句分享',
    thumbnail: '',
    backgroundColor: '#f8f5f0',
    textColor: '#5c4b37',
    fontFamily: 'serif',
    style: {
      container: 'bg-[#f8f5f0] border border-amber-100 shadow-sm',
      text: 'text-[#5c4b37] font-serif',
    },
  },
  {
    id: 'social',
    name: '活力',
    description: '适合社交媒体、朋友圈文案',
    thumbnail: '',
    backgroundColor: '#f0f9ff',
    textColor: '#0369a1',
    fontFamily: 'sans',
    style: {
      container: 'bg-[#f0f9ff] border border-blue-100 shadow-sm',
      text: 'text-[#0369a1] font-medium',
    },
  },
];

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  selectedTemplate: Template | null;
}

export default function TemplateSelector({ onSelect, selectedTemplate }: TemplateSelectorProps) {
  useEffect(() => {
    // 默认选择第一个模板
    if (!selectedTemplate) {
      onSelect(TEMPLATES[0]);
    }
  }, [selectedTemplate, onSelect]);

  return (
    <div className="flex gap-2">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          className={`flex-1 p-3 rounded-md cursor-pointer transition-all ${
            selectedTemplate?.id === template.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => onSelect(template)}
        >
          {template.name}
        </button>
      ))}
    </div>
  );
} 