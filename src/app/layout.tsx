import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '文字转图片 - 测试版',
  description: '一个在线文字转图片的网页应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[rgb(var(--apple-neutral-100))]">
        <header className="py-4 bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-xl font-medium text-center">文字转图片</h1>
          </div>
        </header>
        <main className="container mx-auto py-6 px-4 max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  )
} 