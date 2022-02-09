import axios from 'axios'
const baseUrl = '/api/users'



const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const functions = { getAll }

export default functions