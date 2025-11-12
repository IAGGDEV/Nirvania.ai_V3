'use client'

import { useState } from 'react'
import { Search, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatBar() {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      console.log('Enviando:', input)
      setInput('')
    }
  }

  return (
    <div className="fixed bottom-0 left-[72px] right-0 z-40 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-8 py-5">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3 bg-gray-50/80 rounded-full px-5 py-3.5 border border-gray-200/50 hover:bg-gray-50 transition-colors">
            <Search className="h-5 w-5 text-gray-400 flex-shrink-0" strokeWidth={2} />
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search or ask for anything"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
            
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100/80"
              onClick={() => console.log('Continue chat')}
            >
              <MessageSquare className="h-4 w-4" strokeWidth={2} />
              <span className="font-medium">Continue Chat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}




