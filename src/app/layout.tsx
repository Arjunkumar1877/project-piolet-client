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
      <body>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <main className="pt-16"> {/* Add padding top to account for fixed navbar */}
            {children}
          </main>
          <Toaster position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  )
}
