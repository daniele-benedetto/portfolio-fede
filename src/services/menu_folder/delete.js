import axios from 'axios'
import { uri } from '../../utils/const'

const deleteMenuFolder = async (uname, token, id) => {
  try {
    const data = new URLSearchParams()
    data.append("uname", uname)
    data.append("token", token)
    data.append("id", id)

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const response = await axios.post(`${uri}/delete/menu_folder/`, data, config)
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

export default deleteMenuFolder


