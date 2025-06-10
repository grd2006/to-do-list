"use client"
import { useState, useEffect } from 'react'
import { db } from './firebase/config'
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  onSnapshot,
  setDoc 
} from 'firebase/firestore'
import TaskInput from './components/TaskInput'
import { useAuth } from './context/AuthContext'
import { Plus, Check, X, User, LogOut } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [count, setCount] = useState(0)
  const { user, googleSignIn, logOut } = useAuth()

  // Create user collection when user logs in
  useEffect(() => {
    if (!user) return;

    const createUserCollection = async () => {
      try {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          lastLogin: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error("Error creating user collection:", error);
      }
    };

    createUserCollection();
  }, [user]);

  // Listen to tasks changes
  useEffect(() => {
    if (!user) return;

    const userTasksRef = collection(db, "users", user.uid, "tasks");
    const q = query(userTasksRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setCount(tasksData.length);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (taskText) => {
    if (!user) return;
    
    try {
      const userTasksRef = collection(db, "users", user.uid, "tasks");
      await addDoc(userTasksRef, {
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }

  const toggleComplete = async (id) => {
    if (!user) return;

    try {
      const taskRef = doc(db, "users", user.uid, "tasks", id);
      const task = tasks.find(t => t.id === id);
      await updateDoc(taskRef, {
        completed: !task.completed
      });
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  }

  const deleteTask = async (id) => {
    if (!user) return;

    try {
      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl animate-ping delay-2000"></div>
      </div>

      <main className="relative z-10 p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="group">
            <div className="text-4xl py-1 font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300">
              ✨ My To-Do List
            </div>
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <User size={16} className="text-white/80" />
                <span className="text-white/90 text-sm">{user.email}</span>
              </div>
              <button 
                onClick={logOut}
                className="group flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25"
              >
                <LogOut size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={googleSignIn}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/25 animate-bounce"
            >
              Login with Google
            </button>
          )}
        </div>
        
        {user && (
          <div className="animate-fade-in-up">
            <TaskInput onAdd={addTask} setCount={setCount} />
            
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="group animate-slide-in-left bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-102 hover:shadow-xl hover:shadow-purple-500/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      onClick={() => toggleComplete(task.id)} 
                      className={`cursor-pointer flex items-center gap-3 flex-1 transition-all duration-300 ${
                        task.completed 
                          ? "line-through text-white/50" 
                          : "text-white hover:text-purple-200"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed 
                          ? "bg-gradient-to-r from-green-400 to-green-500 border-green-400 scale-110" 
                          : "border-white/40 hover:border-purple-400 group-hover:scale-110"
                      }`}>
                        {task.completed && <Check size={14} className="text-white animate-scale-in" />}
                      </div>
                      <span className="font-medium">{task.text}</span>
                    </div>
                    
                    <button 
                      onClick={() => deleteTask(task.id)}  
                      className="ml-4 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group-hover:rotate-90"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full">
                <span className="text-white/80 font-medium">Total Tasks:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
                  {count}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in-left {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  )
}
