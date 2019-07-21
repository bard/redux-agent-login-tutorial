import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import {
  configureAgents,
  createHttpAgent
} from 'redux-agent'
import reducer from './reducers'

export const configureStore = (preloadedState) => {
  const middlewares = [createLogger({ collapsed: () => true })]

  const store = createStore(
    reducer, preloadedState, applyMiddleware(...middlewares))

  store.subscribe(configureAgents([
    createHttpAgent(),
  ], store))

  return store
}


