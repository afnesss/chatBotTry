import { forwardRef } from "react"

const Message = forwardRef(({message, sender}, ref) => {
  return (
    <div ref={ref} className={`flex flex-row w-full mb-5 ${sender === 'robot'? "justify-start" : "justify-end"}`}>
      {sender === 'robot' && (
        <img className="mx-5 w-13 h-13" src="src/assets/robot.png" width='50'/>
        )}
        
        <div className="px-4 py-2 bg-gray-200 text-center flex items-center rounded-xl shadow-md max-w-100">
          {message}
        </div>
      {sender === 'user' && (
        <img className="mx-5 w-13 h-13" src="src/assets/user.png" width='50'/>
        )}
    </div>
  )
})

export default Message
