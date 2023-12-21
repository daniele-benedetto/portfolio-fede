import axios from 'axios'
import { uri } from '../../utils/const'

const addMenu = async (uname, token, item) => {
  try {
    const data = new URLSearchParams()
    data.append("uname", uname)
    data.append("token", token)
    data.append("link", item.link)
    data.append("image", item.image)
    data.append("index", item.index)

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const response = await axios.post(`${uri}/add/menu/`, data, config)
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

export default addMenu


