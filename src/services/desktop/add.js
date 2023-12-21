import axios from 'axios'
import { uri } from '../../utils/const'

const addDesktop = async (uname, token, item) => {
  try {
    const data = new URLSearchParams()
    data.append("uname", uname)
    data.append("token", token)
    data.append("title", item.title)
    data.append("type", item.type)
    data.append("coord_x", item.coord_x)
    data.append("coord_y", item.coord_y)

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const response = await axios.post(`${uri}/add/desktop/`, data, config)
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

export default addDesktop


