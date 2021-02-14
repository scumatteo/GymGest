import Axios from "axios";

export function updateMessages(id) {
  Axios.put(
    `http://localhost:3001/api/messages/${id}`,
    {},
    {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }
  ).then((res) => {
    let unread = JSON.parse(sessionStorage.getItem("unread"));
    delete unread[id];
    sessionStorage.setItem("unread", JSON.stringify(unread));
    let count = res.data;
    let messages = sessionStorage.getItem("messages");
    messages = parseInt(messages) - count;
    sessionStorage.setItem("messages", messages.toString());
  });
}


export function updateChat() {}

export function setUpdateChat(f) {
  updateChat = f;
}



export default { updateMessages, updateChat, setUpdateChat };
