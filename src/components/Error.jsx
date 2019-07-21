import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RETRY } from '../reducers/login'

const Error = () => {
  const dispatch = useDispatch()
  const error = useSelector(state => state.error)

  return (
    <div>
      <p>An error occurred:</p>
      <blockquote>
        {error.message || 'Unknown error'}
      </blockquote>
      <button onClick={() => dispatch({ type: RETRY })}>Retry</button>
    </div>
  )
}

export default Error
