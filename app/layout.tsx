import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/src/providers/SessionProvider'

export const metadata: Metadata = {
  title: 'Mayas — Finance Made Beautiful',
  description: 'Learn and manage your personal finances in a cute, approachable way.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
