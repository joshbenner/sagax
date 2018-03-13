import axios from 'axios'

export const HTTP = axios.create({
  baseURL: process.env.API_BASE
})

let jwt = localStorage.getItem('auth_token')
if (jwt) {
  HTTP.defaults.headers.Authorization = `Bearer ${jwt}`
}
