import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

  const [popAuth, setPopAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


    useEffect(() => {
    const initUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentUser(parsed);
          // console.log("✅ Ініціалізований користувач:", parsed);
        } catch (err) {
          // console.error("❌ Помилка при парсі користувача:", err);
          setPopAuth(true);
          localStorage.removeItem("user");
        }
      }
      setLoading(false)
    };

    initUser();
  }, []);

  useEffect(() => {
    if(currentUser){
      localStorage.setItem('user', JSON.stringify(currentUser));
      console.log(currentUser.profile_pic)
    }

  }, [currentUser])
  
    return (
    <AuthContext.Provider value = {{
      popAuth,
      setPopAuth,
      currentUser,
      setCurrentUser,
    }}>
      {!loading && children }
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context){
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}