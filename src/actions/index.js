import {SIGN_IN, SIGN_OUT} from './types';
import jwt_decode from 'jwt-decode';
import axios from 'axios';


export const signIn =(user)=>dispatch=>{
    axios.post('https://procback.herokuapp.com/signIn',user)
    .then(res => {
        const { token} = res.data;
        localStorage.setItem('jwtToken', token);
        const decoded = jwt_decode(token);
        dispatch({
            type:SIGN_IN,
            payload:decoded.user
        });
       
    })
}

export const signOut =(history)=>dispatch=>{
    localStorage.removeItem('jwtToken');
    dispatch({
        type: SIGN_OUT
    });
    history.push('/login')
}