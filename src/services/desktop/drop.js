import axios from 'axios'
import { uri } from '../../utils/const'

const dropDesktop = async (uname, token, id, new_coord_x, new_coord_y, old_coord_x, old_coord_y) => {
  try {
    const data = new URLSearchParams()

    data.append("uname", uname)
    data.append("token", token)
    data.append("id", id)
    data.append("new_coord_x", new_coord_x)
    data.append("new_coord_y", new_coord_y)
    data.append("old_coord_x", old_coord_x)
    data.append("old_coord_y", old_coord_y)

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const response = await axios.post(`${uri}/edit/desktop/drop/`, data, config)
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

export default dropDesktop


