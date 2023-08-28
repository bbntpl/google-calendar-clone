function updateLocalStorage<T>(name: string, array: Array<T>) {
	return localStorage.setItem(name, JSON.stringify(array))
}
function getItemFromLocal(name: string) {
	return JSON.parse(localStorage.getItem(name) || '{}');
}
const deleteLocalStorage = (name: string) => localStorage.removeItem(name);

export {
	updateLocalStorage,
	getItemFromLocal,
	deleteLocalStorage,
}