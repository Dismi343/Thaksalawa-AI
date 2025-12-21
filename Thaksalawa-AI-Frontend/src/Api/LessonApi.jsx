import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/user';

export const GetLesson = async ( subject_id)=>{
    return await axios.get(`${API_BASE_URL}/lessons/subject/${subject_id}`,{
    })
}