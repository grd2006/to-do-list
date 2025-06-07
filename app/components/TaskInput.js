"use client"
import { useState } from 'react'

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
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="border p-2 rounded w-full"
        placeholder="Add a new task..."
      />
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>
    </div>
  )
}
