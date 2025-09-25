import { TbLayoutSidebar } from "react-icons/tb";  
import { RiChatNewLine } from "react-icons/ri";     
import { FiSearch } from "react-icons/fi";  
import { FiSettings } from "react-icons/fi";   

import { useState } from "react";
import { iconStyles } from "./IconWithLabel";
import IconWithLabel from "./IconWithLabel";


const LeftNav = () => {
  const [sideBar, setSideBar] = useState(false);

  return (
    <div
      className={`
        flex flex-col bg-green-50 p-3 h-screen
        ${sideBar ? "w-64" : "w-16"}
        transition-[width] duration-300 ease-in-out
      `}
    >
          <button onClick={() => setSideBar (p => !p)} className="ml-auto mr-2">
            <TbLayoutSidebar className={`hover:bg-gray-600/30 rounded-lg p-1 cursor-ew-resize`} size={35} color='green'/>
          </button>
            {/* <div className="flex flex-row items-center mb-3 mt-7">
              <RiChatNewLine className={iconStyles} size={40} color="green"/>
                <span
                className={`left-15 absolute
                  ${sideBar ? "opacity-100" : "opacity-0"}
                  transition-opacity duration-300
                  overflow-hidden
                  whitespace-nowrap text-sm text-gray-600`}
              >
                New Chat
               </span>
            </div> */}
            <div className="mt-7">
            <IconWithLabel text="New Chat" sideBar={sideBar} icon={RiChatNewLine}/>
            <IconWithLabel text="Find in Chat" sideBar={sideBar} icon={FiSearch}/>
            </div>


          <FiSettings className={`${iconStyles} mt-auto`} size={40} color="green"/>

        </div>

  )
}

export default LeftNav
