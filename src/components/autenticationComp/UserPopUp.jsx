import { FiUser, FiLogOut  } from "react-icons/fi"
import { useChatMessages } from "../../contexts/MessagesCnxtProvider"
import { forwardRef, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import BtnPopUp from "../BtnPopUp";
import { FiEdit3 } from "react-icons/fi";
import { useBoxContext } from "../../contexts/BoxesContext";
import EditProfile from "./EditProfile";


const UserPopUp = forwardRef(({close}, ref) => {
  const {resetChatState} = useChatMessages();
  const {currentUser, setCurrentUser, setPopAuth} = useAuthContext();
  const {toggleBox, boxes, closeBox, refs} = useBoxContext();
  const navigate = useNavigate();

  // useEffect(() => {
  //   toggleBox('editProf');
  // }, [boxes.user]);
  const handleLogOut = () => {
    resetChatState();
    setCurrentUser(null);
    setPopAuth(true);
    localStorage.clear();
    navigate('/')

  }
  
  return (<>
  
    <div ref={ref} className="pop-box shadow-md absolute z-50 p-2" style={{bottom: 60, left: 10 }}>
      <div className="flex flex-row gap-2 p-2">
        <FiUser size={15} className="text-gray-500"/>
        <span className="text-xs text-gray-500">{currentUser?.email}</span>
      </div>
      
        <BtnPopUp icon={FiEdit3} title={"Edit profile"} onClick={() => {toggleBox('editProf'); console.log(boxes.editProf)}} bg={" rounded-lg btn-bg w-full mt-2 cursor-pointer gap-2"}/>
        <BtnPopUp icon={FiLogOut} color={"text-red-800"} title={"Log out"} onClick={() => {handleLogOut(); close(); closeBox('editProf')}} bg={" rounded-lg btn-bg w-full mt-2 cursor-pointer gap-2"}/>
    </div>
    </>
  )
})

export default UserPopUp
