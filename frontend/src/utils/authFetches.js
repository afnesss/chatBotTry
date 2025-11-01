const API_URL = import.meta.env.VITE_API_URL;
export const IfUserExists = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({email, password})
  }) 

    const data = await res.json();

    if(!res.ok){
      throw new Error(data.error || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;

  } catch (error) {
    console.error("error in fetching login user " + error.message);
    return { error: error.message || "register error" };
  }

}

export const fetchRegisterUser = async (name, email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({name, email, password})
  })     

    const data = await res.json();

    if(!res.ok){
      throw new Error(data.error || "Login failed");
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error("error in fetching register user " + error.message);
    return { error: error.message || "register error" };
  }
}

export const authFetch = async(url, options = {}, stream=false)=> {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found!");
    return null;
  }

  const headers = {
    "Content-type": "application/json",
    ...(options.headers || {}),
    "Authorization": `Bearer ${token}`,
  }

  try {
    const res = await fetch(url,{...options, headers});
    // 
     if (stream) return res;
    const text = await res.text();

    if(!res.ok){
      console.error("authfetch failed");
      if (!text) return null;
    }

    return text ? JSON.parse(text) : null;

  } catch (error) {
    console.error("error in authfetch " + error.message);
    return null;
  }
}

