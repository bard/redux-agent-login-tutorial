import React from 'react'

const SubmissionConfirmation = () => {
  return (
    <div>
      <h2>Thank you!</h2>
      <p>
        Please check your inbox and click the link in the email we sent you.
      </p>

      <p>
        <em>
          (Well, not really since this is a tutorial, but
          you can <a
            href={'#/verify/12345'} target='_blank'
            rel='noopener noreferrer'
          >click on this link</a> to simulate
          opening the link from the email.)
        </em>
      </p>
    </div>
  )
}

export default SubmissionConfirmation
