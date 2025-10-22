import { useAuthContext } from "../../contexts/AuthContext";
import userIcon from "../../assets/user.png";
import { FiUser} from "react-icons/fi"
import { HiCamera } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import { forwardRef, useState } from "react";
import InputRegBox from "./InputRegBox";
import { changeUserData } from "../../utils/fetches";
import { useBoxContext } from "../../contexts/BoxesContext";
// import { SunIcon, MoonIcon, SwatchIcon } from "@heroicons/react/24/solid";


const EditProfile = forwardRef(({set}, ref) => {
  const {currentUser, setCurrentUser} = useAuthContext();
  const [updatedForm, setUpdatedForm] = useState({name: currentUser.name || ''});

  const {toggleBox} = useBoxContext();
  const handleSet = (e) => {setUpdatedForm(prev => ({...prev, [e.target.name]: e.target.value}))};
  const handleUpdate = (updatedForm) => {
    if (Object.values(updatedForm).every(v => v === '')) {
      return;
    }
Object.entries(updatedForm).forEach(async ([key, value]) => {
  if (value !== '') {
    const data = await changeUserData({ column: key, value });
    if (!data) {
      throw new Error('res changing name is not ok');
    }
    setCurrentUser(data.user)
  }
});
  }

  return (
    <div ref={ref} className="center-box z-50 ">
    <div className="pop-box absolute  flex flex-col items-center px-3">
      <AiOutlineClose size={25} color="gray" className="absolute btn-bg p-1 right-3" onClick={() => set(p => !p)}/>
      <div className="relative w-20">
        <img className={`w-20 h-20 rounded-full flex-shrink-0`} src={userIcon}/>
        <HiCamera className="hover:bg-[#396849] bg-green-900 rounded-full text-white p-1 absolute bottom-0 right-0 outline-3 outline-gray-200" size={30}/>
      </div>

      <form onSubmit={(e) => {e.preventDefault(); handleUpdate(updatedForm); toggleBox('editProf')}} className="flex flex-col gap-3 my-5 w-80 px-5">
        <InputRegBox 
        type='text' icon={FiUser} value={updatedForm.name} placeHolder={'Your name'} name='name' onChange={handleSet}/>

        <button type="submit" className="btn-primary mt-3 hover:bg-green-700 py-1 cursor-pointer w-full">
          Update
        </button>
      </form>
      


    </div>
    </div>
  )
})

export default EditProfile
