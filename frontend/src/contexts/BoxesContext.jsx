import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useChatContext } from "./ChatContext";

const BoxesContext = createContext();

export const BoxesProvider = ({children}) => {

  // const [editProfBox, setEditProfBox] = useState(false);
  const [editChat, setEditChat] = useState({edit: false, chat: null, newTitle: ''});
  const [chatIdToDelete, setIdToDelete] = useState();
  const {closePopUp} = useChatContext();

  // const ref = useRef(null);
  // const refInput = useRef(null);
  // const searchRef = useRef(null);
  // const userPopRef = useRef(null);
  // const editProfref = useRef(null);


  const [boxes, setBoxes] = useState({
    refInput: false,
    search: false,
    user: false,
    editProf: false,
    confirm: false,
    photo: false
  })

  const toggleBox = (name) => setBoxes(prev => ({ ...prev, [name]: !prev[name] }));
  const closeBox = (name) => setBoxes(prev => ({ ...prev, [name]: false }));
  const openBox = (name) => setBoxes(prev => ({ ...prev, [name]: true }));

  const refs = {
    editChat: useRef(null),
    input: useRef(null),
    search: useRef(null),
    user: useRef(null),
    editProf: useRef(null),
    confirm: useRef(null),
    photo: useRef(null)
  }

    useEffect(() => {
    if (!refs.editProf){
      setBoxes(prev => ({ ...prev, [photo]: false }));
    }
  }, [refs.editProf])
  useEffect(() => {
    function handleClick(e) {
    if (refs.editChat.current && !refs.editChat.current.contains(e.target)) {
      setEditChat({ edit: false, chat: null, newTitle: '' });
      closePopUp();
    }
      Object.entries(refs).forEach(([name, ref]) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setBoxes(prev => ({ ...prev, [name]: false }));
        }
      });

    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

      return (
    <BoxesContext.Provider value = {{
      boxes, toggleBox, refs, editChat, setEditChat, closeBox, openBox, chatIdToDelete, setIdToDelete
    }}>
      { children }
    </BoxesContext.Provider>
  )

}

export const useBoxContext = () => {
  const context = useContext(BoxesContext);
  if (!context){
    throw new Error('boxContext must be used within BoxProvider');
  }

  return context;
}