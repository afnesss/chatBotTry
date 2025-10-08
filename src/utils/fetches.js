import {v4 as uuidv4} from 'uuid';

export const addMessage = async (chatId, sender, message, id, loading = false,) => {
  try {
    const res = await fetch(`/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id, sender, message, loading }),
    });

    if (!res.ok) throw new Error("Failed to add message");
    const data = await res.json();
    // const { chatCreated, chat, message: newMessage} = data;
    return data;
  } catch (error) {
    console.error("Error adding message:", error);
  }
};

export const load = async(chatId, setMessages) => {

    if (!chatId || chatId === 'undefined') {
    console.warn('load is with bad chatId:', chatId);
    setMessages([]);
    return;
  }

  try {
    const res = await fetch(`/api/chats/${chatId}/messages`);
    const data = await res.json();
    setMessages(data || []);

  } catch (error) {
    console.log('error fetching messages with chatId ' + chatId + error)
  }
}

export const makeNewChat = async(passedId=null) => {
  try {
    const id = passedId || uuidv4();
    const title = "My New Chat";
    // const messages = [];
    const created_at = new Date().toISOString();
    const response = await fetch('/api/chats',{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id, 
      title,
      // messages,
      created_at
    })
  })
    if (!response.ok) throw new Error("Failed to create chat");
    const data = await response.json();
    console.log("New chat created:", data);
    return data;
  } catch (error) {
    console.log('error making new chat ' + error);
  }
}

export const deleteChat = async(chatId) => {
  try {
    const res = await fetch(`/api/chats/${chatId}`, {
      method: "DELETE",

    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error( "Failed to delete chat");
    }

    console.log("Chat deleted:", data.deleted);
  } catch (error) {
    console.error("Error deleting chat:", error.message);
  }
}

export const changeChatTitle = async(chatId, newTitle) => {
  try {
    const res = await fetch(`/api/chats/${chatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newTitle
      })
    })

    const data = await res.json();

    if (!res.ok) {
    throw new Error(errData.error || "Failed to delete chat");
    }

    console.log("Chat name changed:", data);
  } catch (error) {
    console.error("Error editing chat:", error.message);
  }
}

export const getLastChats= async() => {
  try {
    const res = await fetch(`/api/chats`)

    const data = await res.json();
    // setLastChats(data);

    if (!res.ok) {
      throw new Error(errData.error || "Failed to delete chat");
    }

    return data;

  } catch (error) {
    console.error("Error getting chat(time):", error.message);
  }
}

export const findChat = async(search) => {
  try {
    const res = await fetch(`/api/chats/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({search})
    })

    const data = await res.json();

    if (!res.ok) {
      console.log('res is not ok');
      return [];
    }

    return data;

  } catch (error) {
    console.error("Error finding chat (in fetch): ", error.message);
  }
}

export const chatExists = async(chatId) => {
  try {
    const res = await fetch(`/api/chats/${chatId}`);

    const data = await res.json();

    if (!res.ok) {
      console.log('res is not ok');
      return [];
    }

    return data.exists;

  } catch (error) {
    console.error("Error checking chat (in fetch): ", error.message);
  }
}