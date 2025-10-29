import { forwardRef } from "react"
import { ThreeDot } from "react-loading-indicators"

import robotIcon from "../assets/robot.png";
import userIcon from "../assets/user.png";
import { useAuthContext } from "../contexts/AuthContext";

const iconStyle = "mx-3 lg:mx-5 lg:w-13 lg:h-13 w-10 h-10 rounded-full";

const Message = ({message, sender}) => {

  const {currentUser} = useAuthContext();

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
            
        <div dangerouslySetInnerHTML={{ __html: message }} style={{ whiteSpace: 'pre-wrap' }} className="px-4 py-2 bg-gray-200 text-start items-center rounded-xl shadow-md max-w-[70%] text-sm lg:text-base lg:max-w-[60%] break-words"/> 
         {/* } */}
      {sender === 'user' && (
        <img alt="profile" className={iconStyle} src={`http://localhost:4000/backend${currentUser.profile_pic}` || userIcon}/>
        )}
    </div>
  )
}

export default Message
