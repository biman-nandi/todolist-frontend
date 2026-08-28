import { useState } from "react"
import {RiCheckboxBlankLine, RiCheckboxFill} from "react-icons/ri"
import { FaRegCircleXmark } from "react-icons/fa6";
import { useEffect } from "react";


export function ListComponents(props) {
  const [isCompleted, setIsCompleted] = useState(props.currentState)

  const updateState = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({isCompleted: isCompleted})
      })

      if (!response) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      fetchTasks()
      return;
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    updateState(props.id)
  }, [isCompleted])

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      props.fetchTasks()
      return;
    } catch (error) {
      return;
    }
  }

  return (
    <div 
      className="
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
        hover:scale-101
      "
    >
      <div className="flex gap-2.5">
        {isCompleted ?
        <RiCheckboxFill
          onClick={() => setIsCompleted(prev => !prev)}
          className="
            text-gray-700
            text-2xl
            font-extrabold
            shrink-0
            cursor-pointer
          "
        /> : 
        <RiCheckboxBlankLine
          onClick={() => setIsCompleted(prev => !prev)}
          className="
            text-gray-700
            text-2xl
            font-extrabold
            shrink-0
            cursor-pointer
          "
        />
        }
        <div className={`${isCompleted && "line-through"}`}>
          {props.title}
        </div>
      </div>

      <FaRegCircleXmark onClick={() => deleteTask(props.id)} />
    </div>
  )
}