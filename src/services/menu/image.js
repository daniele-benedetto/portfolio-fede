import axios from 'axios'
import { uri } from '../../utils/const'

const editImage = async (uname, token, base_64, id) => {
  try {
    const data = new URLSearchParams()
    data.append("uname", uname)
    data.append("token", token)
    data.append("id", id)
    data.append("image", base_64)

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const response = await axios.post(`${uri}/edit/menu/image_item/`, data, config)
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

export default editImage


