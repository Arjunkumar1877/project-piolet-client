'use client'

import './globals.css'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from '@/src/components/Navbar'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8 container mx-auto">
            {children}
          </main>
          <Toaster position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  )
}
