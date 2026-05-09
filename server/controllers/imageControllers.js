import userModel from '../models/userModels.js'
import FormData from 'form-data'
import axios from 'axios'

// ─── Prompt Enhancer via Groq ────────────────────────────────────────────────
export const enhancePrompt = async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.json({ success: false, message: 'No prompt provided' })
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are an expert at writing prompts for AI image generation models like Stable Diffusion and DALL-E. 
Your job is to take a simple user prompt and expand it into a rich, detailed image generation prompt.
Add details about: lighting, style, mood, colors, composition, quality tags.
Keep it under 150 words. Return ONLY the enhanced prompt, nothing else.`
          },
          {
            role: 'user',
            content: `Enhance this image prompt: "${prompt}"`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const enhancedPrompt = response.data.choices[0].message.content.trim()

    res.json({ success: true, enhancedPrompt })
  } catch (error) {
    console.log('Groq error:', error.message)
    res.json({ success: false, message: 'Failed to enhance prompt' })
  }
}

// ─── Generate Image via Clipdrop ─────────────────────────────────────────────
export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body || {}

    const user = await userModel.findById(userId)

    if (!user || !prompt) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    if (user.creditBalance === 0 || user.creditBalance < 0) {
      return res.json({
        success: false,
        message: 'No credit Balance',
        creditBalance: user.creditBalance
      })
    }

    const formData = new FormData()
    formData.append('prompt', prompt)

    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      formData,
      {
        headers: { 'x-api-key': process.env.CLIPDROP_API },
        responseType: 'arraybuffer'
      }
    )

    const base64Image = Buffer.from(data, 'binary').toString('base64')
    const resultImage = `data:image/png;base64,${base64Image}`

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1
    })

    res.json({
      success: true,
      message: 'Image generated',
      creditBalance: user.creditBalance - 1,
      resultImage
    })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}