'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#121212',
          color: '#ffffff',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid rgb(39, 135, 145)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#0f717b',
            secondary: '#ffffff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  )
} 