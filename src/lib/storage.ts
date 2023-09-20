const setJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const getJson = (key) => {
  return JSON.parse(localStorage.getItem(key) || '{}')
}

const getItem = (key) => {
  return localStorage.getItem(key)
}

const setItem = (key, value) => {
  localStorage.setItem(key, value)
}

const removeItem = (key) => {
  localStorage.removeItem(key)
}

const clear = () => {
  localStorage.clear()
}

const storage = {
  getItem,
  setItem,
  removeItem,
  clear,
  getJson,
  setJson
}

export default storage
