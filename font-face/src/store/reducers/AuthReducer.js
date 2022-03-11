import React from 'react'

import {AUTH_START, AUTH_SUCCESS, AUTH_LOGOUT, AUTH_LOGIN_FAIL, AUTH_REGISTRATION, AUTH_REGISTRATION_FAIL} 
from '../actions/ActionTypes'

import { auth_fail, auth_start } from '../actions/Auth'

const initialState = ({
    access_token : localStorage.getItem('access_token'),
    loading:false,
    login_error:null,
    registration_confirmation:null,
    registration_error:null,
    loggedInUserInfo : null,
})

const authStart = (state, action) =>({
    ...state,
    loading:true
})
const authSuccess = (state, action) =>({
    ...state,
    access_token:action.access,
    loading:false,
   
})
const authFail = (state, action) =>({
    ...state,
    login_error:action.error,
    loading:false

})

const authRegistration = (state, action) =>({
    ...state,
    registration_confirmation:action.confirmation
})

const authRegistrationFail = (state, action) =>({
    ...state,
    registration_error:action.registration_error
    
})
const loggedInUserInfo = (state, action) =>(
    console.log(action.user_info[0],'reducer'),
    {
    
    ...state, 
    loggedInUserInfo: action.user_info[0]
})



const AuthReducer = (state = initialState, action) =>{
    switch(action.type){

        case AUTH_START: return authStart(state, action)
        case AUTH_SUCCESS: return authSuccess(state, action)
        case AUTH_LOGIN_FAIL: return authFail(state, action)
        case AUTH_REGISTRATION: return authRegistration(state, action)
        case AUTH_REGISTRATION_FAIL: return authRegistrationFail(state, action)
        
     
        default: return state

    }

}

export default AuthReducer;