import { HTTP } from './http-client'

export default {
  getEvents (cb) {
    HTTP.get('events')
      .then(response => {
        cb(response.data)
      })
      .catch(e => {
        console.log('Failed getting events: ', e)
      })
  }
}
