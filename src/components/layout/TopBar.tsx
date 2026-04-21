'use client'

import { Bell } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export function TopBar() {
  const { data: session } = useSession()

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Hey, {firstName}! 👋
        </h2>
        <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 rounded-full hover:bg-pink-50 transition-colors">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500"></span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-pink-200 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)' }}>
          {session?.user?.image ? (
            <Image src={session.user.image} alt="avatar" width={36} height={36} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-sm font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {firstName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
