import { useState } from "react"
import {RiCheckboxBlankLine, RiCheckboxFill} from "react-icons/ri"
import { RiEditBoxLine } from "react-icons/ri";
import { FaRegCircleXmark } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { TbMessageFilled } from "react-icons/tb";
import toast from "react-hot-toast"


export function ListComponents(props) {
  const [taskDetails, setTaskDetails] = useState(props.taskDetails)
  const [isCompleted, setIsCompleted] = useState(taskDetails.isCompleted)
  const [isEditBtnOpen, setIsEditBtnOpen] = useState(false)

  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }

  const updateState = async (id, state) => {
    setIsCompleted(state)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({isCompleted: state})
      })

      if (!response.ok) {
        toast.error('Something went wrong')
        return
      }

      await props.fetchTasks()

      {state ? toast.success("Marked as completed!") : toast.success("Marked as incomplete!")}
      return;
    } catch (error) {
      toast.error(error.message)
      return;
    }
  }


  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        toast.error('Something went wrong.')
        return;
      }
      await props.fetchTasks()

      toast.success('Task deleted successfully!')

      return;
    } catch (error) {
      toast.error(error.message)
      return;
    }
  }

  const updateTask = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskDetails.title, 
          category: taskDetails.category, 
          about: taskDetails.about, 
          date: taskDetails.date, 
          time: taskDetails.time
        })
      })
      if (!response.ok) {
        toast.error('Something went wrong.')
        return;
      }

      setIsEditBtnOpen(false)
      await props.fetchTasks()

      toast.success('Task updated successfully!')
      return;
    } catch (error) {
      toast.error(error.message)
      return;
    }
  }

  return (
    <div 
      className={`
        flex 
        justify-between
        items-center 
        text-xl 
        bg-[#e4e4e4]
        my-5
        px-3
        py-3
        rounded-xl
        transition-transform
        duration-300
        border-l-10
        ${props.taskDetails.isCompleted ? "border-green-500" : "border-red-500"}
        ${!isEditBtnOpen && "hover:scale-101"}
      `}
    >
      <div className="flex gap-2.5 items-center">
        {isCompleted ?
        <RiCheckboxFill
          onClick={() => updateState(props.taskDetails._id, false)}
          className="
            text-gray-500
            text-2xl
            font-extrabold
            shrink-0
            cursor-pointer
          "
        /> : 
        <RiCheckboxBlankLine
          onClick={() => updateState(props.taskDetails._id, true)}
          className="
            text-gray-500
            text-2xl
            font-extrabold
            shrink-0
            cursor-pointer
          "
        />
        }
        <div>
          <p className={`${isCompleted && "line-through"}`}>{props.taskDetails.title}</p>

          <p className="text-sm text-[#d95050] flex items-center gap-1.5">{props.taskDetails.about && <TbMessageFilled className="mt-2 mb-1 shrink-0" />}{props.taskDetails.about}</p>

          <p className="text-xs text-[#2c7ef0] flex items-center gap-1.5 mt-1"><SlCalender className="shrink-0" />
            {new Date(props.taskDetails.date).toLocaleDateString('en-US', options)}{props.taskDetails.time && ","} <span className="font-bold">{props.taskDetails.time}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-5 items-center">
        <RiEditBoxLine onClick={() => setIsEditBtnOpen(prev => !prev)} className="cursor-pointer" />
        <FaRegCircleXmark onClick={() => deleteTask(taskDetails._id)} className="cursor-pointer" />
      </div>

      {isEditBtnOpen && 
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center ">
          <div className="w-100 bg-gray-200 p-5 rounded-lg">
            <h6 className="text-center">Edit Task</h6>

            <form>
              <div className="w-full mb-4">
                <label className="block mb-1 text-xs text-gray-500">Name</label>
                <input type="text" value={taskDetails.title} onChange={(e) => setTaskDetails((prev) => ({...prev, title: e.target.value}))} placeholder="Task Name" className="outline-none text-black mb-1 border-b border-gray-400 w-full text-[18px] bg-transparent" />
              </div>

              <div className="w-full mb-4">
                <label className="block mb-1 text-xs text-gray-500">Description</label>
                <input type="text" value={taskDetails.about} onChange={(e) => setTaskDetails((prev) => ({...prev, about: e.target.value}))} placeholder="Task Name" className="outline-none text-black text-[18px] mb-1 border-b border-gray-400 w-full bg-transparent" />
              </div>

              <div className="w-full mb-4">
                <label className="block mb-1 text-xs text-gray-500">Date</label>
                <input type="date" value={taskDetails.date?.split("T")[0]} 
                onChange={(e) => setTaskDetails((prev) => ({...prev, date: e.target.value}))}
                placeholder="Task Name" className="outline-none text-black mb-1 border-b text-[18px] border-gray-400 w-full" />
              </div>

              <div className="w-full mb-4">
                <label className="block mb-1 text-xs text-gray-500">Starting Time</label>
                <input type="time" value={taskDetails.time} 
                onChange={(e) => setTaskDetails((prev) => ({...prev, time: e.target.value}))}
                placeholder="Task Name" className="outline-none text-black mb-1 border-b text-[18px] border-gray-400 w-full " />
              </div>

              <div className="my-4">
                <label className="block mb-1.5 text-xs text-gray-500">Category</label>

                <div className="flex w-full h-15 items-center gap-2">
                  <span 
                    onClick={() => setTaskDetails((prev) => ({
                      ...prev,
                      category: "STUDY"
                    }))} 
                    className={`cursor-pointer text-center rounded-2xl py-2.5 text-sm bg-[#f5c8f1] text-[#d950c7] w-1/3 ${taskDetails.category === "STUDY" ? "border-2 border-[#d950c7]" : ""}`}
                  >
                    Study 📚
                  </span>

                  <span 
                    onClick={() => setTaskDetails((prev) => ({
                      ...prev,
                      category: "PRODUCTIVE"
                    }))} 
                    className={`cursor-pointer text-center rounded-2xl py-2.5 text-sm bg-[#f2a1a1] text-[#e93f3f] w-1/3 ${taskDetails.category === "PRODUCTIVE" ? "border-2 border-[#e93f3f]" : ""}`}
                  >
                    Productive ⚡
                  </span>

                  <span 
                    onClick={() => setTaskDetails((prev) => ({
                      ...prev,
                      category: "LIFE"
                    }))} 
                    className={`cursor-pointer text-center rounded-2xl py-2.5 text-sm bg-[#99cadf] text-[#2c7ef0] w-1/3 ${taskDetails.category === "LIFE" ? "border-2 border-[#2c7ef0]" : ""}`}
                  >
                    Life 🌍
                  </span>
                </div>

                <div className="flex w-full h-15 items-center gap-2">
                  <span 
                    onClick={() => setTaskDetails((prev) => ({
                      ...prev,
                      category: "WORK"
                    }))} 
                    className={`cursor-pointer text-center rounded-2xl py-2.5 text-sm bg-[#bbd950] text-[#566719] w-1/3 ${taskDetails.category === "WORK" ? "border-2 border-[#566719]" : ""}`}
                  >
                    Work 💼
                  </span>

                  <span 
                    onClick={() => setTaskDetails((prev) => ({
                      ...prev,
                      category: "HEALTH"
                    }))} 
                    className={`cursor-pointer text-center rounded-2xl py-2.5 text-sm bg-[#3fe9b6] text-[#115641] w-1/3 ${taskDetails.category === "HEALTH" ? "border-2 border-[#115641]" : ""}`}
                  >
                    Health 🏃
                  </span>

                  <span 
                    onClick={() => setTaskDetails((prev) => ({
                      ...prev,
                      category: "OTHER"
                    }))} 
                    className={`cursor-pointer text-center rounded-2xl py-2.5 text-sm bg-[#eacf98] text-[#906614] w-1/3 ${taskDetails.category === "OTHER" ? "border-2 border-[#906614]" : ""}`}
                  >
                    Other 📦
                  </span>
                </div>
              </div>


              <div className="w-full flex gap-3 mt-1 text-[18px]">
                <button 
                  type="button" 
                  onClick={() => setIsEditBtnOpen(false)} 
                  className="
                    w-[50%] 
                    py-2 
                    shadow-md 
                    border 
                    border-gray-400 
                    shadow-[#747171] 
                    rounded-lg 
                    cursor-pointer 
                    duration-300 
                    transition-all 
                    hover:translate-y-1
                  "
                >
                  Cancel
                </button>

                <button 
                  type="button" 
                  onClick={() => updateTask(taskDetails._id)}
                  className="
                    w-[50%] 
                    py-2 
                    shadow-md 
                    border 
                    border-gray-400 
                    shadow-[#747171] 
                    rounded-lg 
                    bg-[#D1A28B] 
                    cursor-pointer 
                    duration-300 
                    transition-all 
                    hover:translate-y-1
                  "
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  )
}