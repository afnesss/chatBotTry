import {v4 as uuidv4} from 'uuid';
import { authFetch } from './authFetches';

export const addMessage = async (chatId, sender, message, id, loading = false,) => {
  try {
    const data = await authFetch(`/api/chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({id, sender, message, loading }),
    });

    if (!data) {
      console.log('No chats found or request failed, addmessage');
      return [];
    };
    // const data = await res.json();
    // const { chatCreated, chat, message: newMessage} = data;
    return data;
  } catch (error) {
    console.error("Error adding message:", error);
    return { chatCreated: false, message: null };
  }
};

export const load = async(chatId, setMessages) => {

    if (!chatId || chatId === 'undefined') {
    console.warn('load is with bad chatId:', chatId);
    setMessages([]);
    return;
  }

  try {
    const data = await authFetch(`/api/chats/${chatId}/messages`);
    if (!data){
      console.log('No chats found or request failed, load');
      setMessages([]);
      return [];
    };
    // const data = await res.json();
    setMessages(data || []);

  } catch (error) {
    console.log('error fetching messages with chatId ' + chatId + error)
  }
}

export const makeNewChat = async(passedId=null) => {
  try {
    const id = passedId || uuidv4();
    const title = "New Chat";
    // const messages = [];
    const created_at = new Date().toISOString();
    const data = await authFetch('/api/chats',{
    method: "POST",
    body: JSON.stringify({
      id, 
      title,
      // messages,
      created_at
    })
  })
    if (!data){
      console.log('No chats found or request failed, making new chat');
      return [];
    };
    // const data = await response.json();
    console.log("New chat created:", data);
    return data;
  } catch (error) {
    console.log('error making new chat ' + error);
  }
}

export const deleteChat = async(chatId) => {
  try {
    const data = await authFetch(`/api/chats/${chatId}`, {
      method: "DELETE",

    });

    // const data = await res.json();

    if (!data) {
      console.log('No chats found or request failed, deleting chat');
      return [];
    }

    console.log("Chat deleted:", data.deleted);
  } catch (error) {
    console.error("Error deleting chat:", error.message);
  }
}

export const changeChatTitle = async(chatId, newTitle) => {
  try {
    const data = await authFetch(`/api/chats/${chatId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: newTitle
      })
    })

    // const data = await res.json();

    if (!data) {
      console.log('No chats found or request failed, changechattitle');
      return [];
    }

    console.log("Chat name changed:", data);
  } catch (error) {
    console.error("Error editing chat:", error.message);
  }
}

export const getChats= async() => {
  try {
    const data = await authFetch(`/api/chats`)

    // const data = await res.json();
    // setLastChats(data);

    if (!data) {
      console.log('No chats found or request failed, getlastchats');
      return [];
    }

    return data;

  } catch (error) {
    console.error("Error getting chat(time):", error.message);
  }
}

export const findChat = async(search) => {
  try {
    // const res = await fetch(`/api/chats/find`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({search})
    // })

    const data = await authFetch(`/api/chats/find`, {
      method: "POST",
      body: JSON.stringify({search})
    });

    // const data = await res.json();
    if (!data) {
      console.log('No chats found or request failed');
      return [];
    }

    return data;

  } catch (error) {
    console.error("Error finding chat (in fetch): ", error.message);
  }
}

export const chatExists = async(chatId) => {
  try {

  const data = await authFetch(`/api/chats/${chatId}`);

    // const data = await res.json();

    if (!data) {
      console.log('res is not ok');
      return [];
    }

    return data;

  } catch (error) {
    console.error("Error checking chat (in fetch): ", error.message);
  }
}