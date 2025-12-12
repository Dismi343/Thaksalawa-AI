import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/user';

export const GetSubjects = async (token)=>{
    return await axios.get(`${API_BASE_URL}/subjects/get-all`,{
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
}

