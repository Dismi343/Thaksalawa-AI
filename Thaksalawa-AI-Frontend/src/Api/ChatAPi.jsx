import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/user';

export const CreateChat = async(token,subject_id)=>{
    return await axios.post(`${API_BASE_URL}/chat/start-chat`,{
        subject_id:subject_id
    },{
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
}

export const GetChats = async(token,subject_id)=>{
      return await axios.get(`${API_BASE_URL}/chat/get-all-chats/${subject_id}`,{
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
}

export const SendMessage = async(token,chat_id,query,source)=>{
      return await axios.post(`${API_BASE_URL}/chat/${chat_id}/message`,{
        query:query,
        source:source
      },{
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        }
    });
}

export const DeleteChat = async(token,chat_id)=>{
      return await axios.delete(`${API_BASE_URL}/chat/delete-chat/${chat_id}`,{
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
}

export const GetAllMessagesByChat = async(token,chat_id)=>{
      return await axios.get(`${API_BASE_URL}/messages/get-all/${chat_id}`,{
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
}
