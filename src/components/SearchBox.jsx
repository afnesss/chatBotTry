import { forwardRef, useEffect, useState } from "react";
import { getLastChats } from "../utils/fetches";
import { AiOutlineClose } from "react-icons/ai"; 

import FilteredChats from "./FilteredChats";

const SearchBox = forwardRef(({onclick, searchBoxPassed}, ref) => {
  const [lastChats, setLastChats] = useState([]);

  const [searchBox, setSearchBox] = useState(searchBoxPassed);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const lastWeekStart = new Date()
  lastWeekStart.setDate(today.getDate() - 7);

  const lastWeekEnd = new Date();
  lastWeekEnd.getDate(today.getDate() - 2);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getLastChats();
      setLastChats(chats);
    }
    fetchChats();
  }, [searchBox])

  const lastWeekChats = lastChats.filter((chat) => chat.created_at >= lastWeekStart && chat.created_at <= lastWeekEnd);
  const todayChats = lastChats.filter((chat) => isSameDay(new Date(chat.created_at), today));
  const yesterdayChats = lastChats.filter((chat) => isSameDay(new Date(chat.created_at), yesterday));

  return (
    <div  className="fixed inset-0 flex items-center justify-center">
    <div ref={ref} className="shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-xl bg-gray-200 p-4 w-100">
      <div className="flex flex-row w-full justify-between items-center">
        <input type="text" placeholder="Search in Chats..." className="focus:outline-none text-sm text-gray-800" ></input>
        <AiOutlineClose size={25} color="gray" className="hover:bg-gray-600/30 rounded-xl p-1" onClick={() => {onclick?.(); setSearchBox(false)}}/>
      </div>
      
      <hr className="border-gray-400 my-3 -mx-4"></hr>
      <div className="h-50 overflow-y-auto">
        <FilteredChats array={todayChats} title="Today" onClick={onclick}/>
        <FilteredChats array={yesterdayChats} title="Yesterday" onClick={onclick}/>
        <FilteredChats array={lastWeekChats} title="Last Week" onClick={onclick}/>
      </div>
    </div>
    </div>
  )
})

export default SearchBox
