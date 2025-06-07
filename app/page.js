"use client"
import { useState, useEffect } from 'react'
import TaskInput from './components/TaskInput'

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskText) => {
    const newTask = { id: Date.now(), text: taskText, completed: false }
    setTasks([newTask, ...tasks])
  }

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    setCount(prevCount => prevCount - 1)
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 My To-Do List</h1>
      <TaskInput onAdd={addTask} setCount={setCount} />
      <ul className="space-y-3">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between bg-white p-3 rounded shadow">
            <div 
              onClick={() => toggleComplete(task.id)} 
              className={`cursor-pointer ${task.completed ? "line-through text-gray-400" : ""}`}
            >
              {task.text}
            </div>
            <button onClick={() => deleteTask(task.id)}  className="text-red-500 font-bold">✕</button>
          </li>
        ))}
      </ul>
      <div>{count}</div>
    </main>
  )
}
