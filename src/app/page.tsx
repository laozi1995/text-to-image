'use client';

import { useState, useEffect } from 'react';
import TemplateSelector from '@/components/TemplateSelector';
import Preview from '@/components/Preview';
import { Template } from '@/types/template';

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [text, setText] = useState<string>('');
  const [ratio, setRatio] = useState<string>('3:4');
  const [padding, setPadding] = useState<number>(50);
  const [textSize, setTextSize] = useState<number>(0.8);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleDownload = async () => {
    if (!selectedTemplate || !text) {
      alert('请选择模板并输入文字内容');
      return;
    }

    setIsGenerating(true);

    try {
      // 获取宽高比例
      const [w, h] = ratio.split(':').map(Number);
      const baseSize = 1200; // 使用较大尺寸以获得高质量图片
      const width = w > h ? baseSize : (baseSize * w) / h;
      const height = w > h ? (baseSize * h) / w : baseSize;
      
      // 计算实际的内边距
      const basePadding = Math.min(width, height) * 0.1;
      const actualPadding = (basePadding * padding) / 50;
      
      // 创建Canvas元素
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法创建Canvas上下文');
      }
      
      // 获取模板颜色
      const backgroundColor = selectedTemplate.backgroundColor || '#ffffff';
      const textColor = selectedTemplate.textColor || '#000000';
      
      // 绘制背景
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      
      // 设置文本样式
      const fontSize = Math.min(width, height) * 0.05 * textSize;
      let fontFamily = selectedTemplate.id === 'literary' ? 'serif' : 'sans-serif';
      
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = textColor;
      
      // 处理文本换行和段落
      const maxWidth = width - (actualPadding * 2);
      const lineHeight = fontSize * 1.8;
      const paragraphs = text.split('\n');
      let y = actualPadding + fontSize;
      
      // 遍历每个段落
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        if (!paragraph.trim()) {
          y += lineHeight / 2; // 空行处理
          continue;
        }
        
        // 特别处理中文文本 - 单字符换行
        let line = '';
        for (let j = 0; j < paragraph.length; j++) {
          const char = paragraph[j];
          const testLine = line + char;
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && line) {
            ctx.fillText(line, actualPadding, y);
            line = char;
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        
        // 绘制最后一行
        if (line) {
          ctx.fillText(line, actualPadding, y);
          y += lineHeight;
        }
        
        // 段落间距
        if (i < paragraphs.length - 1) {
          y += fontSize * 0.3; // 段落之间添加额外间距
        }
      }
      
      // 生成图片并下载
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `文字图片_${selectedTemplate.id}_${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('生成图片失败', error);
      alert('生成图片失败，请重试: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">文本输入</h2>
            <textarea
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="输入你想要转换的文字..."
              value={text}
              onChange={handleTextChange}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">模板选择</h2>
            <TemplateSelector 
              onSelect={setSelectedTemplate} 
              selectedTemplate={selectedTemplate} 
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">比例设置</h2>
            <div className="flex space-x-2">
              {['1:1', '3:4', '4:3', '9:16', '16:9'].map((item) => (
                <button 
                  key={item}
                  onClick={() => setRatio(item)}
                  className={`flex-1 p-2 rounded-md transition-all ${
                    ratio === item 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-3">
              <h2 className="text-lg font-medium mb-2">内边距调整 ({padding})</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 font-medium">0</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500 font-medium">100</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-3">
              <h2 className="text-lg font-medium mb-2">字体大小 ({textSize.toFixed(1)}x)</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 font-medium">0.7x</span>
                <input
                  type="range"
                  min="0.7"
                  max="3.8"
                  step="0.1"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500 font-medium">3.8x</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">预览效果</h2>
            <button
              onClick={handleDownload}
              disabled={!selectedTemplate || !text || isGenerating}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isGenerating ? '生成中...' : '下载图片'}
            </button>
          </div>
          <div className="flex items-center justify-center">
            <Preview 
              template={selectedTemplate}
              text={text}
              ratio={ratio}
              padding={padding}
              textSize={textSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 