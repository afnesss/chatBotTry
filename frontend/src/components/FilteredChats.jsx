import { useNavigate } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";

const FilteredChats = ({array, title, onClick}) => {
  const navigate = useNavigate();

  return (
    <>
      <p className="text-gray-600 text-xs">{array.length > 0 && title}</p>
      {array.map((chat) => {
        return (
          <div key={chat.id} 
          onClick={() => {
            navigate(`/chats/${chat.id}`);
            onClick?.();
          }}
          className="flex flex-row items-center mt-2 hover:bg-gray-300/50 rounded-xl p-1 cursor-pointer mb-2">
            <FiMessageCircle size={25} color="green" className="rounded-xl p-1 shrink-0"/>
            {<p className="text-sm mx-2 truncate block hover:overflow-visible hover:whitespace-normal">{chat.title}</p>}
          </div>
        )
      })

      }
    </>
  )
}

export default FilteredChats
