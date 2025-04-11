'use client';

import { useState } from 'react';
import { Template } from '@/types/template';

interface DownloadButtonProps {
  template: Template | null;
  text: string;
  ratio: string;
  padding: number;
  textSize: number;
}

export default function DownloadButton({ template, text, ratio, padding, textSize }: DownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const [width, height] = (() => {
    const [w, h] = ratio.split(':').map(Number);
    // 使用较大尺寸以获得高质量图片
    const baseSize = 1200;
    if (w > h) {
      return [baseSize, (baseSize * h) / w];
    } else {
      return [(baseSize * w) / h, baseSize];
    }
  })();

  // 计算实际的内边距值（基于百分比）
  const actualPadding = (() => {
    const basePadding = Math.min(width, height) * 0.1; // 基础内边距为容器短边的10%
    return (basePadding * padding) / 50; // 将0-100的值映射到0-2倍基础内边距
  })();

  const handleDownload = async () => {
    if (!template || !text) {
      alert('请选择模板并输入文字内容');
      return;
    }

    setIsGenerating(true);

    try {
      // 创建Canvas元素
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法创建Canvas上下文');
      }
      
      // 获取模板颜色
      const backgroundColor = template.backgroundColor || '#ffffff';
      const textColor = template.textColor || '#000000';
      
      // 绘制圆角矩形背景
      const cornerRadius = 20; // 圆角半径
      ctx.beginPath();
      ctx.moveTo(cornerRadius, 0);
      ctx.lineTo(width - cornerRadius, 0);
      ctx.quadraticCurveTo(width, 0, width, cornerRadius);
      ctx.lineTo(width, height - cornerRadius);
      ctx.quadraticCurveTo(width, height, width - cornerRadius, height);
      ctx.lineTo(cornerRadius, height);
      ctx.quadraticCurveTo(0, height, 0, height - cornerRadius);
      ctx.lineTo(0, cornerRadius);
      ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
      ctx.closePath();
      
      // 填充背景
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      
      // 添加细边框
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // 设置文本样式
      const fontSize = Math.min(width, height) * 0.05 * textSize;
      let fontFamily = template.id === 'literary' ? 'serif' : 'sans-serif';
      
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = textColor;
      
      // 处理文本换行和段落
      const maxWidth = width - (actualPadding * 2);
      const lineHeight = fontSize * 1.8; // 1.8倍行高
      const paragraphs = text.split('\n');
      let y = actualPadding + fontSize; // 起始y坐标
      
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
      link.download = `文字图片_${template.id}_${new Date().getTime()}.png`;
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
    <button
      onClick={handleDownload}
      disabled={!template || !text || isGenerating}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
    >
      {isGenerating ? (
        <>生成中...</>
      ) : (
        <>
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载图片
        </>
      )}
    </button>
  );
} 