import express from 'express'
import { generateImage, enhancePrompt } from '../controllers/imageControllers.js'
import userAuth from '../middlewares/auth.js'

const imageRouter = express.Router()

imageRouter.post('/generate-image', userAuth, generateImage)
imageRouter.post('/enhance-prompt', userAuth, enhancePrompt)

export default imageRouter