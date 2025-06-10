"use client"
import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function TaskInput({ onAdd, setCount }) {
  const [task, setTask] = useState("")

  const handleAdd = () => {
    if (task.trim()) {
      onAdd(task)
      setTask("")
      setCount(prevCount => prevCount + 1) 
    }
  }

  return (
    <div className="mb-8">
      <div className="relative group">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd(e)}
          placeholder="Add a new task..."
          className="w-full p-4 pr-12 rounded-2xl border-2 border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/30 focus:bg-white/20 transition-all duration-300 group-hover:bg-white/15"
        />
        <button
          onClick={handleAdd}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-purple-500/25"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}
