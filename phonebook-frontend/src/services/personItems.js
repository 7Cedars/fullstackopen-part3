import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = entryObject => {
    const request = axios.post(baseUrl, entryObject)
    return request.then(response => response.data)
}

const update = (id, entryObject) => {
    const request = axios.put(`${baseUrl}/${id}`, entryObject)
    return request.then(response => response.data)
}

const deleteItem = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export default { getAll, create, update, deleteItem }