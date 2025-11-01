import { useAuthContext } from "../../contexts/AuthContext";
import userIcon from "../../assets/user.png";
import resolveImageSrc from "../../utils/resolveImageSrc";
import { FiUser} from "react-icons/fi"
import { HiCamera } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import { forwardRef, useState } from "react";
import InputRegBox from "./InputRegBox";
import { changeUserData } from "../../utils/fetches";
import { useBoxContext } from "../../contexts/BoxesContext";
import PhotoPopUp from "./PhotoPopUp";
// import { SunIcon, MoonIcon, SwatchIcon } from "@heroicons/react/24/solid";


const EditProfile = forwardRef(({}, ref) => {
  const {currentUser, setCurrentUser} = useAuthContext();
  const [updatedForm, setUpdatedForm] = useState({name: currentUser?.name || '', profile_pic: currentUser?.profile_pic || userIcon});
  const {boxes, toggleBox, refs} = useBoxContext();
  const [picUrl, setPicUrl] = useState(null);

  const handleSet = (e) => {setUpdatedForm(prev => ({...prev, [e.target.name]: e.target.value}))};
  const handleUpdate = async (updatedForm) => {
    if (Object.values(updatedForm).every(v => v === '')) {
      return;
    }
    console.log(updatedForm, picUrl)
    const data = await changeUserData({name: updatedForm.name, profile_pic: picUrl});
    if (!data) {
      throw new Error('res changing name is not ok');
    }
    console.log('data : ', data);
    console.log('data user: ', data.user);
    setCurrentUser(data.user)
  }

  console.log(currentUser.profile_pic);
  return (
    <div  className="center-box z-[100]">
    <div ref={ref} className="pop-box absolute  flex flex-col items-center px-3">
      <AiOutlineClose size={25} color="gray" className="absolute btn-bg p-1 right-3" onClick={() => toggleBox('editProf')}/>
      <div className="relative w-20">
        <img alt="profile" className={`w-20 h-20 rounded-full flex-shrink-0`} 
        src={resolveImageSrc(updatedForm.profile_pic || currentUser?.profile_pic, userIcon)} />

        <HiCamera className="hover:bg-[#396849] bg-green-900 rounded-full text-white p-1 absolute bottom-0 right-0 outline-3 outline-gray-200" size={30} onClick={() => toggleBox('photo')}/>
          {boxes.photo && <PhotoPopUp ref={refs.photo} set={setUpdatedForm} setPic={setPicUrl}/>}
      </div>

      <form onSubmit={async (e) => {e.preventDefault(); await handleUpdate(updatedForm); toggleBox('editProf')}} className="flex flex-col gap-3 my-5 w-80 px-5">
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
