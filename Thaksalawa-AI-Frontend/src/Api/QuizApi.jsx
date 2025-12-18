import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/user';

export const GetQuize = async (token)=>{
    return await axios.get(`${API_BASE_URL}/quizzes/student-quizes`,{
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
}

export const CreateQuize = async(token, quizeData) => {
    return await axios.post(`${API_BASE_URL}/quizzes/create`, {
        lesson_id: quizeData.lesson_id,
        num_questions: quizeData.num_questions,
        question_type: quizeData.question_type
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
}