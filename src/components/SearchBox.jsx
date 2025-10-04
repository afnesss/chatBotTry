import { forwardRef, useEffect, useState } from "react";
import { getLastChats } from "../utils/fetches";
import { AiOutlineClose } from "react-icons/ai"; 
import { FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SearchBox = forwardRef(({onclick, searchBoxPassed}, ref) => {
  const [lastChats, setLastChats] = useState([]);
  const navigate = useNavigate();

  const [searchBox, setSearchBox] = useState(searchBoxPassed);
  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getLastChats();
      setLastChats(chats);
    }
    fetchChats();
  }, [searchBox])

  return (
    <div  className="fixed inset-0 flex items-center justify-center">
    <div ref={ref} className="shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-xl bg-gray-200 p-4 w-100">
      <div className="flex flex-row w-full justify-between items-center">
        <input type="text" placeholder="Search in Chats..." className="focus:outline-none text-sm text-gray-800" ></input>
        <AiOutlineClose size={25} color="gray" className="hover:bg-gray-600/30 rounded-xl p-1" onClick={() => {onclick?.(); setSearchBox(false)}}/>
      </div>
      
      <hr className="border-gray-400 my-3 -mx-4"></hr>
      <div className="h-50 overflow-y-auto">
        {lastChats.map((chat, index) => {
          return (
            <div key={index} 
            onClick={() => {
              navigate(`/chats/${chat.id}`);
              onclick?.();
            }}
            className="flex flex-row items-center mt-2 hover:bg-gray-300/50 rounded-xl p-1 cursor-pointer">
              <FiMessageCircle size={25} color="green" className="rounded-xl p-1 shrink-0"/>
              {<p className="text-sm mx-2 truncate block hover:overflow-visible hover:whitespace-normal">{chat.title}</p>}
            </div>
          )
        })

        }
      </div>
    </div>
    </div>
  )
})

export default SearchBox
