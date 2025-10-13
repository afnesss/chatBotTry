import { FiUser, FiMail, FiLock, FiKey } from "react-icons/fi";
import InputRegBox from "./InputRegBox";
import { useState, useEffect } from "react";
import { IfUserExists, fetchRegisterUser } from "../../utils/authFetches";
import { useChatMessages } from "../../contexts/MessagesContext";

const RegisterForm = ({isFormLogin}) => {
  const [form, setForm] = useState({name: '', email: '', password: '', password2: ''});
  const [isLogin, setIsLogin] = useState(isFormLogin || true);
  const { setCurrentUser, resetChatState } = useChatMessages();
  const handleSet = (e) => setForm(prev => ({...prev, [e.target.name]: e.target.value}))
  useEffect(() => {
  console.log("Form state:", form);
}, [form]);
  // console.log(form);
  const sendForm = async () => {
    if (isLogin){
      const data = await IfUserExists(form.email, form.password);
      if (!data) {
        console.log("Login failed");
        return;
      }
  console.log("Logged in user:", data.user);
      setCurrentUser(JSON.parse(data.user));
      resetChatState();
    } else {
      if(form.password !== form.password2){
        console.log('passwords are not the same!!!');
        return;
      }
      const data = await fetchRegisterUser(form.name, form.email, form.password)
      if (!data) {
        console.log("sign up failed");
        return;
      }
      console.log("signed up user:", data.user);
      setCurrentUser(data.user);
      resetChatState();
    }
    
  }

  return (
    <div className="center-box">
    <div className="pop-box text-center py-4 px-3">
      <form method="POST" className="w-90 px-5" onSubmit={(e) => {e.preventDefault(); sendForm()}}>
        <h2 className="font-bold text-2xl text-green-800 py-5">{!isLogin? "Sign Up" : "Log In"}</h2>
        <div className={` flex flex-col gap-3`}>
        {!isLogin && <InputRegBox name='name' value={form.name} type={'text'} icon={FiUser} placeHolder={'Your Name'} onChange={handleSet}/>}
        <InputRegBox name='email' type={'email'} value={form.email} icon={FiMail} placeHolder={'Email Address'} onChange={handleSet} />
        <InputRegBox name='password' type={'password'} value={form.password} icon={FiLock} placeHolder={'Password'} onChange={handleSet} />
        {!isLogin && <InputRegBox name='password2' value={form.password2} type={'password'} icon={FiKey} placeHolder={'Repeat your password'} onChange={handleSet} />}
        {isLogin && <button className="link-primary justify-start text-sm">Forgot Password?</button>}
      </div>
        <button type='submit' className="w-full shadow-md px-3 mt-7 mb-2 py-1 rounded-xl hover:bg-green-700 cursor-pointer bg-green-600 text-white font-semibold text-sm lg:text-base">{isLogin? "Sign In" : "Register"}</button>
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
