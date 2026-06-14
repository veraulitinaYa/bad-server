import { Router } from 'express'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'
import { getCsrfToken } from '../controllers/auth'
import csurf from 'csurf'

const csrfProtection = csurf({ cookie: true })
const authRouter = Router()

authRouter.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() })
})
authRouter.get('/user', auth, getCurrentUser)
authRouter.patch('/me', auth, csrfProtection, updateCurrentUser)
authRouter.get('/user/roles', auth, getCurrentUserRoles)
authRouter.post('/login', csrfProtection, login)
authRouter.get('/token', refreshAccessToken)
authRouter.get('/logout', logout)
authRouter.post('/register', csrfProtection, register)

export default authRouter
