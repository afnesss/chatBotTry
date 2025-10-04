import { forwardRef } from "react";

import { AiOutlineClose } from "react-icons/ai"; 
import { FiMessageCircle } from "react-icons/fi";

const SearchBox = forwardRef(({onclick}, ref) => {
  return (
    <div  className="fixed inset-0 flex items-center justify-center">
    <div ref={ref} className="shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-xl bg-gray-200 p-4 w-100">
      <div className="flex flex-row w-full justify-between items-center">
        <input type="text" placeholder="Search in Chats..." className="focus:outline-none text-sm text-gray-800" ></input>
        <AiOutlineClose size={25} color="gray" className="hover:bg-gray-600/30 rounded-xl p-1" onClick={onclick}/>
      </div>
      
      <hr className="border-gray-400 my-3 -mx-4"></hr>
      <div className="h-50">
        
      </div>
    </div>
    </div>
  )
})

export default SearchBox
