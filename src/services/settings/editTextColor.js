import axios from 'axios'
import { uri } from '../../utils/const'

const editTextColor = async (uname, token, color) => {
  try {
    const data = new URLSearchParams()
    data.append("uname", uname)
    data.append("token", token)
    data.append("color", color)

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const response = await axios.post(`${uri}/edit/settings/color_text/`, data, config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Errore nella richiesta HTTP:', error.message)
      return { error: 'Errore nella richiesta HTTP' }
    })

    return response
  } catch (error) {
    console.error('Errore nella richiesta HTTP:', error.message)
    return { error: 'Errore nella richiesta HTTP' }
  }
}

export default editTextColor


