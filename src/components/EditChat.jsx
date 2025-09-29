// import { MdEdit } from "react-icons/md";
import { forwardRef } from "react";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import BtnPopUp from "./BtnPopUp";

const EditChat = forwardRef(({x, y, changeChatTitle, deleteChat}, ref) => {
  // console.log(x, y);
  return (
    <div ref={ref} className="fixed shadow-md rounded-xl bg-gray-200 p-2 gap-2" style={{ top: y, left: x }}>
      <BtnPopUp onClick={changeChatTitle} bg="hover:bg-gray-400/30" title="Rename" icon={FiEdit3}/>
      <hr className="mx-auto m-1 border-t border-gray-400 max-w-[70%]"></hr>
      <BtnPopUp onClick={deleteChat} bg="hover:bg-red-500/10 text-red-700" title="Delete" icon={FiTrash2}/>
    </div>
  )
})

export default EditChat
