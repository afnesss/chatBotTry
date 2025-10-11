import { FiUser, FiMail, FiLock, FiKey } from "react-icons/fi";
import InputRegBox from "./InputRegBox";
import { useState } from "react";

const RegisterForm = ({isFormLogin}) => {
  const [form, setForm] = useState({name: '', email: '', password: '', password2: ''});
  const [isLogin, setIsLogin] = useState(isFormLogin || false);
  const handleSet = (e) => setForm(prev => ({...prev, [e.target.name]: e.target.value}))

  const sendForm = () => {
    if (isLogin){
      
    } else {

    }
  }

  return (
    <div className="center-box">
    <div className="pop-box text-center py-4 px-3">
      <form className="w-90 px-5">
        <h2 className="font-bold text-2xl text-green-800 py-5">{!isLogin? "Sign Up" : "Log In"}</h2>
        <div className={` flex flex-col gap-3`}>
        {!isLogin && <InputRegBox name='name' type={'text'} icon={FiUser} placeHolder={'Your Name'} onChange={handleSet}/>}
        <InputRegBox name='email' type={'email'} icon={FiMail} placeHolder={'Email Address'} onChange={handleSet} />
        <InputRegBox name='password' type={'password'} icon={FiLock} placeHolder={'Password'} onChange={handleSet} />
        {!isLogin && <InputRegBox name='password2' type={'password'} icon={FiKey} placeHolder={'Repeat your password'} onChange={handleSet} />}
        {isLogin && <button className="link-primary justify-start text-sm">Forgot Password?</button>}
      </div>
        <button type='submit' onSubmit={sendForm} className="w-full shadow-md px-3 mt-7 mb-2 py-1 rounded-xl hover:bg-green-700 cursor-pointer bg-green-600 text-white font-semibold text-sm lg:text-base">{isLogin? "Sign In" : "Register"}</button>
      </form>
        <div className="flex flex-row justify-center text-sm text-gray-500 mb-3">
          {isLogin? "Don't have an account? " : "Already have an account? "}
          <button className="link-primary ml-2" onClick={() => setIsLogin (p => !p)}>{isLogin? "Sign Up" : "Log In"}</button>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
