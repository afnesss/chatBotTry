import { forwardRef } from "react"
import { ThreeDot } from "react-loading-indicators"

import robotIcon from "../assets/robot.png";
import userIcon from "../assets/user.png";

const iconStyle = "mx-3 lg:mx-5 lg:w-13 lg:h-13 w-10 h-10";

const Message = ({message, sender}) => {
  return (
    <div  className={`flex flex-row w-full mb-5 ${sender === 'robot'? "justify-start" : "justify-end"}`}>
      {sender === 'robot' && (
        <img className={iconStyle} src={robotIcon}/>
        )}
        {/* {showAnim ? (
            <div style={{ transform: "scale(0.5)"}}>  
            <ThreeDot variant="bounce" color="#297d3aff" size={10} text="" textColor="" />
            </div>
 
        ):  */}
        <div className="px-4 py-2 bg-gray-200 text-start items-center rounded-xl shadow-md max-w-[70%] text-sm lg:text-base lg:max-w-[60%] break-words">
            {message}
        </div> 
         {/* } */}
      {sender === 'user' && (
        <img className={iconStyle} src={userIcon}/>
        )}
    </div>
  )
}

export default Message
