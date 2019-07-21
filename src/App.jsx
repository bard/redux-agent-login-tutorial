import React, { useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { APP_LOADED, TOKEN_PROVIDED } from './reducers/login'
import LoginForm from './components/LoginForm'
import SubmissionConfirmation from './components/SubmissionConfirmation'
import Error from './components/Error'
import Loader from './components/Loader'
import Home from './components/Home'

const App = () => {
  const dispatch = useDispatch()

  const controlState = useSelector(
    state => state.controlState)
  const isLoading = useSelector(
    state => ['Start', 'CheckingSession', 'SubmittingCredentials']
      .includes(state.controlState))

  // This effect is run at mount time onrly because the 'dispatch'
  // dependency never changes
  useEffect(() => {
    dispatch({ type: APP_LOADED })
  }, [dispatch])

  // We use useLayouteffect to run the effect synchronously and
  // prevent displaying the input UI if the location contains the
  // verification token
  useLayoutEffect(() => {
    if (controlState === 'CollectingInput') {
      const m = window.location.hash.match(/^#\/verify\/(\w+)$/)
      if (m) {
        window.location.hash = ''
        const token = m[1]
        dispatch({ type: TOKEN_PROVIDED, payload: { token } })
      }
    }
  }, [controlState, dispatch])

  return (
    <div>
      {isLoading &&
        <Loader />}

      {controlState === 'CollectingInput' &&
        <LoginForm />}

      {controlState === 'SubmissionConfirmation' &&
        <SubmissionConfirmation />}

      {controlState === 'Error' &&
        <Error />}

      {controlState === 'Home' &&
        <Home />}
    </div>
  )
}

export default App

