import { forwardRef, useEffect, useState } from "react";
import { getChats, findChat} from "../utils/fetches";
import { AiOutlineClose } from "react-icons/ai"; 
import { FiMessageCircle } from "react-icons/fi";

import FilteredChats from "./FilteredChats";

import dayjs from "dayjs";


const SearchBox = forwardRef(({searchBox, setSearchBox}, ref) => {
  const [lastChats, setLastChats] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  // const [searchBox, setSearchBox] = useState(searchBoxPassed);
  // console.log("SearchBox rendered", searchBox);
  const today = dayjs();
  const yesterday = dayjs().subtract(1, "day");
  const lastWeekStart = dayjs().subtract(7, "day");
  const lastWeekEnd = dayjs().subtract(2, "day");

  const fetchChats = async () => {
    const chats = await getChats();
    setLastChats(chats || []);
  }

  useEffect(() => {
    fetchChats();
  }, [searchBox])

  useEffect(() => {
    const loadFilteredChats = async () => {
      if (!searchInput.trim()) {
        const chats = await getChats();
        setLastChats(chats || []);
        return;
      }
      const chats = await findChat(searchInput);
      setLastChats(chats || []);
    };

    loadFilteredChats();
  }, [searchInput]);

  // useEffect(() => {
  //   setSearchBox(searchBoxPassed);
  // }, [searchBoxPassed]);

  const todayChats = lastChats.filter((chat) => dayjs(chat.created_at).isSame(today, 'day'));
  const yesterdayChats = lastChats.filter((chat) => dayjs(chat.created_at).isSame(yesterday, 'day'));
  const lastWeekChats = lastChats.filter((chat) => {
    const chatDate = dayjs(chat.created_at);
    return chatDate.isAfter(lastWeekStart) && chatDate.isBefore(lastWeekEnd);
  });
  const olderChats = lastChats.filter((chat) => {
    const chatDate = dayjs(chat.created_at);
    return chatDate.isBefore(lastWeekStart);
  })
  // console.log(lastWeekChats)
  return (
    <div  className="center-box z-[100]">
    <div ref={ref} className="pop-box w-100">
      <div className="flex flex-row w-full justify-between items-center">
        <input type="text" value={searchInput} placeholder="Search in Chats..." className="focus:outline-none text-sm text-gray-800" onChange={(e) => setSearchInput(e.target.value)}></input>
        <AiOutlineClose size={25} color="gray" className="btn-bg p-1" onClick={() => {setSearchBox(false)}}/>
      </div>
      
      <hr className="border-gray-400 my-3 -mx-4"></hr>
      <div className="h-50 overflow-y-auto">
        {todayChats.length === 0 && yesterdayChats.length === 0 && lastWeekChats.length === 0 && olderChats.length === 0
        ? <>
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold text-lg">
            <FiMessageCircle size={24} className="mr-2"/>
            No chat matches</div>
        </>
        : <>
          <FilteredChats array={todayChats} title="Today" onClick={() => {setSearchBox(false)}}/>
          <FilteredChats array={yesterdayChats} title="Yesterday" onClick={() => {setSearchBox(false)}}/>
          <FilteredChats array={lastWeekChats} title="Last Week" onClick={() => {setSearchBox(false)}}/>
          {searchInput.trim() && olderChats.length > 0 && <FilteredChats array={olderChats} title="Older" onClick={() => {setSearchBox(false)}}/>}
        </>}

      </div>
    </div>
    </div>
  )
})

export default SearchBox
