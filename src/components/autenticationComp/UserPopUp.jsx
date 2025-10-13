import { FiUser, FiLogOut  } from "react-icons/fi"
import { useChatMessages } from "../../contexts/MessagesCnxtProvider"
import { MdOutlineLogout } from 'react-icons/md';
import { forwardRef } from "react";
import { useAuthContext } from "../../contexts/AuthContext";

const UserPopUp = forwardRef((props, ref) => {
  const {resetChatState} = useChatMessages();
  const {currentUser, setCurrentUser, setPopAuth} = useAuthContext();

  const handleLogOut = () => {
    resetChatState();
    setCurrentUser(null);
    setPopAuth(true);
    localStorage.clear();

  }
  
  return (
    <div ref={ref} className="pop-box absolute z-50 p-3" style={{bottom: 60, left: 10 }}>
      <div className="flex flex-row gap-2 p-1">
        <FiUser size={15} className="text-gray-500"/>
        <span className="text-xs text-gray-500">{currentUser?.email}</span>
      </div>
      
      <div className="btn-bg rounded-lg w-full items-center gap-3 flex flex-row mt-2 cursor-pointer" onClick={handleLogOut}>
        <FiLogOut size={20} className="text-green-800"/>
        <span className="text-sm text-gray-600">Log out</span>
        </div>
    </div>
  )
})

export default UserPopUp
