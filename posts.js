const { createStore, applyMiddleware } = require("redux")
const thunk = require("redux-thunk").default
const axios = require("axios")


//Custom Middleware

const customLogger = ()=>{
    return (next) =>{
        return (action) =>{
            console.log('action fired', action)
            next(action)
        }
    }
}

const initialstate = {
    posts: [],
    error: '',
    loading: false
}

// Action Type

const REQUEST_STARTED = "REQUEST_STARTED"
const FETCH_SUCCESS = "FETCH_SUCCESS"
const FETCH_FAIL = "FETCH_FAIL"

// Action creator

const fetchPostRequest = () =>{
    return{
        type: REQUEST_STARTED
    }
}

const fetchPostSuccess = (post) =>{
    return {
        type: FETCH_SUCCESS,
        payload: post
    }
}

const fetchPostFail = (error) =>{
    return {
        type: FETCH_FAIL,
        payload: error
    }
} 

//action to make the request

const fetchPost = () =>{
    return async(dispatch) =>{
       try{
        //dispatch post request
        dispatch(fetchPostRequest())
        const data = await axios.get("https://jsonplaceholder.typicode.com/posts")

        // dispatch post success
        dispatch(fetchPostSuccess(data))
       }catch(error){
        //dispatch post failure
        dispatch(fetchPostFail(error.message))
       }
    }
}

//Reducers

const postReducer = (state = initialstate, action) => {
    switch(action.type){
        case REQUEST_STARTED:
            return {
                ...state, 
                loading: true
            }

        case FETCH_SUCCESS:
            return {
                ...state.posts,
                posts:action.payload, 
                loading: false
            }

        case FETCH_FAIL:
            return{
                ...state,
                error: action.payload, 
                loading: false
            }
    }
}

//store 

const store = createStore(postReducer, applyMiddleware(thunk))


//subscribe

store.subscribe(()=>{
    const data = store.getState()
    console.log(data)
})

store.dispatch(fetchPost())