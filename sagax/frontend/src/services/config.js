import {HTTP} from './http-client'

export const config = {}

export function loadConfig () {
  HTTP.get('config')
    .then(response => {
      Object.assign(config, response.data)
    })
    .catch(e => {
      console.log('Error loading config: ', e)
    })
}
