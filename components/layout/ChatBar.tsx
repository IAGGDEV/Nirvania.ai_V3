'use client'

import { useState } from 'react'
import { ArrowUp, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatBar() {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      console.log('Enviando:', input)
      setInput('')
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
      <div className="pointer-events-auto">
        <div className={cn(
          "mx-auto max-w-3xl px-4 pb-4 pt-2 transition-all duration-300",
          isFocused && "max-w-4xl"
        )}>
          <form onSubmit={handleSubmit} className="relative">
            <div className={cn(
              "flex items-center gap-3 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-gray-900/90",
              "shadow-lg border border-gray-200/50 px-5 py-3 transition-all duration-300",
              isFocused && "shadow-xl border-primary-300/50 bg-white"
            )}>
              <MessageSquare className="h-5 w-5 text-gray-400" />
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Buscar o preguntar cualquier cosa..."
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
              />
              
              <button
                type="submit"
                disabled={!input.trim()}
                className={cn(
                  "rounded-lg p-1.5 transition-all duration-200",
                  input.trim() 
                    ? "bg-primary-500 text-white hover:bg-primary-600" 
                    : "bg-gray-100 text-gray-400"
                )}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Chat continuation button */}
          <div className="mt-3 flex justify-center">
            <button 
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1"
              onClick={() => console.log('Continuar chat')}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Continuar Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

