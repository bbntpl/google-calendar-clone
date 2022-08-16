const updateLocalStorage = (name, array) => localStorage.setItem(name, JSON.stringify(array));
const getItemFromLocal = (name: string) => JSON.parse(localStorage.getItem(name) || '{}');
const deleteLocalStorage = (name) => localStorage.removeItem(name);

export { updateLocalStorage, getItemFromLocal, deleteLocalStorage }