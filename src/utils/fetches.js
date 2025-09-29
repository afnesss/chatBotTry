import {v4 as uuidv4} from 'uuid';

export const updateMsg = async (messages, chatId) => {
  await fetch(`/api/chats/${chatId}/messages`,{
  method: "PUT",
    headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(messages),
})

} 

export const load = async(chatId, setMessages) => {
  try {
    const res = await fetch(`/api/chats/${chatId}/messages`);
    const data = await res.json();
    setMessages(data);

  } catch (error) {
    console.log('error fetching messages with chatId ' + chatId + error)
  }
}

export const makeNewChat = async() => {
  try {
    const id = uuidv4();
    const title = "My New Chat";
    const messages = [];
    const created_at = new Date().toISOString();
    const response = await fetch('/api/chats',{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id, 
      title,
      messages,
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
    throw new Error(errData.error || "Failed to delete chat");
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