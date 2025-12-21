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

export const CreateQuize = async(token, quizData) => {
    return await axios.post(`${API_BASE_URL}/quizzes/create`, {
        lesson_id: quizData.get('lesson_id'),
        num_questions: quizData.get('num_questions'),
        question_type: quizData.get('question_type')
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
}


export const GetQuizQuestion = async (token, quizId) => {
    return await axios.get(`${API_BASE_URL}/quizzes/get/${quizId}/student`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
}

export const GetResult = async (token, quizId) => {
    return await axios.get(`${API_BASE_URL}/quizzes/results/${quizId}/student`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
}

export const SubmitAnswer = async(token, answerData) => {
    return await axios.post(`${API_BASE_URL}/quizzes/submit-answer`, {
        quiz_id: answerData.get('quiz_id'),
        question_id: answerData.get('question_id'),
        selected_option: answerData.get('selected_option'),
        written_answer: answerData.get('written_answer')
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
}



export const CurrentProgress = async (token, quizId) => {
    return await axios.get(`${API_BASE_URL}/quizzes/progress/${quizId}/student`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
}

export const FinishQuiz = async (token,quizId) => {
    return await axios.post(`${API_BASE_URL}/quizzes/finish`, {
        quiz_id: quizId
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
}