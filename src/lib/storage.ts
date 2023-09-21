const setJson = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getJson = (key: string) => {
  return JSON.parse(localStorage.getItem(key) || '{}');
};

const getItem = (key: string) => {
  return localStorage.getItem(key);
};

const setItem = (key: string, value: any) => {
  localStorage.setItem(key, value);
};

const removeItem = (key: string) => {
  localStorage.removeItem(key);
};

const clear = () => {
  localStorage.clear();
};

const storage = {
  getItem,
  setItem,
  removeItem,
  clear,
  getJson,
  setJson,
};

export default storage;
