import axios from 'axios'
import { uri } from '../../utils/const'

const login = async (uname, passw) => {
  try {
    const data = new URLSearchParams();
    data.append("uname", uname);
    data.append("passw", passw);

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const response = await axios.post(`${uri}/auth/login/`, data, config)
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

export default login



