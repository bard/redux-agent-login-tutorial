import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { CREDENTIALS_ENTERED } from '../reducers/login'

const LoginForm = () => {
  const [values, setValues] = useState({ email: '' })
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch({ type: CREDENTIALS_ENTERED, payload: values })
  }

  const handleEmailChange = (e) => {
    setValues({ ...values, email: e.target.value })
  }

  const isValid = (values) => {
    return 'email' in values && values.email.match(/.+@.+/)
  }

  return (
    <div>
      <h2>Please log in to continue...</h2>
      <form>
        <label htmlFor='email'>Email:</label>
        {' '}
        <input type='email' id='email'
          placeholder='user@example.com'
          onChange={handleEmailChange}
          style={{ display: 'inline' }} />
        <button type='submit'
          disabled={!isValid(values)}
          onClick={handleSubmit}>
          Send me a login link
      </button>
      </form>
    </div>
  )
}

export default LoginForm
