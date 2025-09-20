import { forwardRef } from "react"
import { ThreeDot } from "react-loading-indicators"

import robotIcon from "../assets/robot.png";
import userIcon from "../assets/user.png";

const Message = forwardRef(({message, sender, loading}, ref) => {
  return (
    <div ref={ref} className={`flex flex-row w-full mb-5 ${sender === 'robot'? "justify-start" : "justify-end"}`}>
      {sender === 'robot' && (
        <img className="mx-5 w-13 h-13" src={robotIcon} width='50'/>
        )}
        {loading ? (

          
            <div style={{ transform: "scale(0.5)"}}>  
            <ThreeDot variant="bounce" color="#297d3aff" size={10} text="" textColor="" />
            </div>
           
        ): 
          <div className="px-4 py-2 bg-gray-200 text-start items-center rounded-xl shadow-md max-w-[60%] break-words">
            {message}
        </div>
        }
      {sender === 'user' && (
        <img className="mx-5 w-13 h-13" src={userIcon} width='50'/>
        )}
    </div>
  )
})

export default Message
