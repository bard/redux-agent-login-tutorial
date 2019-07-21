import { addTask } from 'redux-agent'

// UI ACTIONS
export const APP_LOADED = 'APP_LOADED'
export const CREDENTIALS_ENTERED = 'CREDENTIALS_ENTERED'
export const TOKEN_PROVIDED = 'TOKEN_PROVIDED'
export const RETRY = 'RETRY'

// NETWORK ACTIONS
export const SESSION_SUCCESS = 'SESSION_SUCCESS'
export const SESSION_FAILURE = 'SESSION_FAILURE'
export const SUBMIT_CREDENTIALS_SUCCESS = 'SUBMIT_CREDENTIALS_SUCCESS'
export const SUBMIT_CREDENTIALS_FAILURE = 'SUBMIT_CREDENTIALS_FAILURE'
export const VERIFY_TOKEN_SUCCESS = 'VERIFY_TOKEN_SUCCESS'
export const VERIFY_TOKEN_FAILURE = 'VERIFY_TOKEN_FAILURE'

// TASK CREATORS
const checkSession = () => ({
  type: 'http',
  method: 'get',
  url: '/account',
  actions: {
    success: SESSION_SUCCESS,
    failure: SESSION_FAILURE
  }
})

const submitCredentials = (email) => ({
  type: 'http',
  method: 'post',
  url: '/auth/email/requests',
  body: { email },
  actions: {
    success: SUBMIT_CREDENTIALS_SUCCESS,
    failure: SUBMIT_CREDENTIALS_FAILURE,
  }
}) 

const verifyToken = (token) => ({
  type: 'http',
  method: 'post',
  url: '/auth/email/verifications',
  body: { token },
  actions: {
    success: VERIFY_TOKEN_SUCCESS,
    failure: VERIFY_TOKEN_FAILURE,
  }
})

const reducer = (state, action) => {
  switch (action.type) {
    case APP_LOADED: {
      if (state.controlState !== 'Starting') return state
      
      const newState = addTask(state, checkSession())
      
      return { ...newState, controlState: 'CheckingSession' }
    }

      // SESSION CHECKING
      // ----------------------------------------------------------------------
      
    case SESSION_SUCCESS: {
      if (state.controlState !== 'CheckingSession') return state
      
      return { ...state, controlState: 'Home' }
    }

    case SESSION_FAILURE: {
      if (state.controlState !== 'CheckingSession') return state
      
      if (action.meta.status === 401) {
        return { 
          ...state, 
          controlState: 'CollectingInput'
        }
      } else {
        return { 
          ...state, 
          controlState: 'Error',
          error: { 
            message: action.payload,
            retryState: 'CheckingSession',
            retryTask: checkSession()
          }
        }
      }
    }

      // CREDENTIAL SUBMISSION
      // ----------------------------------------------------------------------
      
    case CREDENTIALS_ENTERED: {
      if (state.controlState !== 'CollectingInput') return state
      
      const { email } = action.payload
      const newState = addTask(state, submitCredentials(email))

      return { ...newState, controlState: 'SubmittingCredentials' }
    }

    case SUBMIT_CREDENTIALS_SUCCESS: {
      if (state.controlState !== 'SubmittingCredentials') return state

      return { ...state, controlState: 'SubmissionConfirmation' }
    }

    case SUBMIT_CREDENTIALS_FAILURE: {
      if (state.controlState !== 'SubmittingCredentials') return state

      return {
        ...state,
        controlState: 'Error',
        error: {
          message: action.payload,
          retryState: 'CollectingInput'
        }
      }
    }
      
      // TOKEN VERIFICATION
      // ----------------------------------------------------------------------
      
    case TOKEN_PROVIDED: {
      if (state.controlState !== 'CollectingInput') return state
      
      const { token } = action.payload
      const newState = addTask(state, verifyToken(token))

      return { ...newState, controlState: 'VerifyingToken' }
    }

    case VERIFY_TOKEN_SUCCESS: {
      if (state.controlState !== 'VerifyingToken') return state

      return { ...state, controlState: 'Home'}
    }

    case VERIFY_TOKEN_FAILURE: {
      if (state.controlState !== 'Verifyingtoken') return state

      return {
        ...state,
        controlState: 'Error',
        error: {
          message: action.payload,
          retryState: 'CollectingInput',
          retryTask: null
        }
      }
    }

      // ERROR/RETRY
      // ----------------------------------------------------------------------
      
    case RETRY: {
      if (state.controlState !== 'Error') return state

      const newState = state.error.retryTask
            ? addTask(state, state.error.retryTask)
            : state
      
      return {
        ...newState,
        controlState: state.error.retryState
      }
    }
      
    default:
      return state
  }
}

export default reducer
