import { FiUser, FiLogOut  } from "react-icons/fi"
import { useChatMessages } from "../../contexts/MessagesCnxtProvider"
import { forwardRef } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import BtnPopUp from "../BtnPopUp";
import { FiEdit3 } from "react-icons/fi";


const UserPopUp = forwardRef(({close}, ref) => {
  const {resetChatState, messages} = useChatMessages();
  const {currentUser, setCurrentUser, setPopAuth} = useAuthContext();
  const navigate = useNavigate();

  const handleLogOut = () => {
    resetChatState();
    console.log(messages);
    setCurrentUser(null);
    setPopAuth(true);
    localStorage.clear();
    navigate('/')

  }
  
  return (
    <div ref={ref} className="pop-box shadow-md absolute z-50 p-2" style={{bottom: 60, left: 10 }}>
      <div className="flex flex-row gap-2 p-2">
        <FiUser size={15} className="text-gray-500"/>
        <span className="text-xs text-gray-500">{currentUser?.email}</span>
      </div>
      
      {/* <div className="btn-bg rounded-lg w-full items-center gap-3 flex flex-row mt-2 cursor-pointer" onClick={() => {handleLogOut(); close()}}>
        <FiLogOut size={20} className="text-green-800"/>
        <span className="text-sm text-gray-600">Log out</span>
        </div> */}
        <BtnPopUp icon={FiEdit3} title={"Customize profile"} onClick={() => {handleLogOut(); close()}} bg={" rounded-lg btn-bg w-full mt-2 cursor-pointer gap-2"}/>
        <BtnPopUp icon={FiLogOut} color={"text-red-800"} title={"Log out"} onClick={() => {handleLogOut(); close()}} bg={" rounded-lg btn-bg w-full mt-2 cursor-pointer gap-2"}/>
    </div>
  )
})

export default UserPopUp
