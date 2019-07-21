import { reduceReducers, taskReducer } from 'redux-agent'
import loginReducer from './login'

const initialState = {
  // A name that indicates the current "state" of the application:
  // 'Starting', 'CheckingSession', 'CollectingInput',
  // 'SubmittingCredentials', ...
  controlState: 'Starting',
  
  // Data for the 'Error' control state
  error: {
    // Error information, if any, to display to the user
    message: null,
    
    // State to go back to when the RETRY action is received
    retryState: null,
    
    // Optional task to re-run when retrying
    retryTask: null
  }
}

const reducer = reduceReducers(
  initialState,
  loginReducer,
  taskReducer
)

export default reducer
