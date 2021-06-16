import {SIGN_IN,SIGN_OUT} from '../actions/types'; 

const initialState = {
    isAuthenticated:false,
    user:{}
}
const  authReducer= (state = initialState,action)=>{
    switch(action.type){
        case SIGN_IN:
            return{
                ...state,
                isAuthenticated:true,
                user:action.payload
            }
        case SIGN_OUT:
            return{
                ...state,
                isAuthenticated:false,
                user:{}
            }
        
        default:
            return state;
    }
}
export default authReducer;