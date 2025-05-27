import { io } from 'socket.io-client'
import { BACKEND_URL } from '~/lib'

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : BACKEND_URL;
const URL = BACKEND_URL

export const socket = io(URL)
