import { useEffect } from "react"
import categoryColor from "../Addtionals/categoryColor.js"
import { ListComponents } from "./ListComponents.jsx"
import { useState } from "react"
import toast from "react-hot-toast"


export function Home() {
  const [task, setTask] = useState([])
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api`)

      if (!response.ok) {
        toast.error('Something went wrong.')
        return;
      }

      const data = await response.json()
      setTask(data.data)
    } catch (error) {
      toast.error(error.message)
      return;
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])


  // Add Tasks
  const addTasks = async () => {
    if (newTask.trim() === "")
      return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: newTask})
      })

      if (!response.ok) {
        toast.error('Something went wrong.')
        return;
      }

      await fetchTasks()
      setNewTask('')
      
      toast.success('Task added successfully!')

      return;
    } catch (error) {
      toast.error(error.message)
      return;
    }
  }


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTasks();
    }
  }

  const groupedTask = task.length > 0 && task.reduce((groups, currentTask) => {
    const category = currentTask.category || "Others"

    if (!groups[category]) {
      groups[category] = []
    }

    groups[category].push(currentTask)
    return groups
  }, {})

  return (
    <div
      className="
        relative
        h-full
        p-5
        mb-8
        sm:p-10
      "
    >
      <h1 className="text-3xl font-bold mb-8">Today</h1>


      {task.length > 0 ? 
        (Object.entries(groupedTask).map(([key, value]) => (
          <div key={key}>
            <p style={{ color: categoryColor[key]}} className="font-bold text-lg">{key}</p>

            {value.map((ele) => (
              <ListComponents key={ele._id} fetchTasks={fetchTasks} taskDetails = {ele} />
            ))
            }
          </div>
        ))
        )
        : <div className="flex justify-center items-center h-[60vh] text-gray-500 text-2xl">No Task Available...</div>
      }


      <div className="flex items-center w-full gap-5 fixed bottom-0 left-0 px-5 sm:px-10 bg-[#F9F5F4] py-3 border-t border-gray-300">
        <input 
          type="text" 
          placeholder="Write a task..." 
          value={newTask}
          onKeyDown={handleKeyDown}
          onChange={(e) => setNewTask(e.target.value)}
          className="
            bg-[#e4e4e4] 
            w-[80%]
            px-5 
            h-13
            rounded-2xl
            outline-none
            " 
        />
        <button 
          onClick={addTasks}
          className="
            bg-[#393433] 
            text-white 
            h-13 
            w-[20%] 
            rounded-2xl 
            cursor-pointer 
            hover:bg-[#242222]
          "
        >
          Add
        </button>
      </div>
    </div>
  )
}