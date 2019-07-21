import fetchMock from 'fetch-mock'
import sleep from 'sleep-promise'

const simulateNetworkDelay = () =>
      sleep(500 + Math.random() * 500)
  
export const installMocks = () => {
  fetchMock.get('/account', async () => {
    await simulateNetworkDelay()
    return { status: 401 }
  })

  fetchMock.post('/auth/email/requests', async () => {
    await simulateNetworkDelay()
    return { status: 200 }
  })

  fetchMock.post('/auth/email/verifications', async () => {
    await simulateNetworkDelay()
    return { status: 200 }
  })
}



