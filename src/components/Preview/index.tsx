'use client';

import { useRef, useMemo } from 'react';
import { Template } from '@/types/template';

interface PreviewProps {
  template: Template | null;
  text: string;
  ratio: string;
  padding: number;
  textSize: number;
}

export default function Preview({ template, text, ratio, padding, textSize }: PreviewProps) {
  // 根据比例计算宽高
  const [width, height] = useMemo(() => {
    const [w, h] = ratio.split(':').map(Number);
    const baseSize = 400;
    if (w > h) {
      return [baseSize, (baseSize * h) / w];
    } else {
      return [(baseSize * w) / h, baseSize];
    }
  }, [ratio]);

  // 计算实际的内边距值
  const actualPadding = useMemo(() => {
    const basePadding = Math.min(width, height) * 0.1; // 基础内边距为容器短边的10%
    return (basePadding * padding) / 50; // 将0-100的值映射到0-2倍基础内边距
  }, [width, height, padding]);

  const containerStyle = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height}px`,
      maxWidth: '100%',
      backgroundColor: template?.backgroundColor || '#ffffff',
      color: template?.textColor || '#000000',
      padding: `${actualPadding}px`,
      borderRadius: '8px',
    };
  }, [template, width, height, actualPadding]);

  const textStyle = useMemo(() => {
    return {
      wordWrap: 'break-word' as const,
      maxWidth: '100%',
      fontSize: `${Math.min(width, height) * 0.05 * textSize}px`,
      textAlign: 'left' as const,
      lineHeight: 1.8,
      whiteSpace: 'pre-wrap' as const,
    };
  }, [width, height, textSize]);

  return (
    <div style={containerStyle} className="shadow-sm border border-gray-100">
      <div style={textStyle}>
        {text || '您的文字将在这里显示...'}
      </div>
    </div>
  );
} 