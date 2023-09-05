interface StorageItemProps<T> {
	storageKey: string
	itemKey: string
	updatedArr: Array<T>
}

function updateLocalStorage<S>(name: string, object: S) {
	return localStorage.setItem(name, JSON.stringify(object))
}

function updateStorageItem<T>(props: StorageItemProps<T>) {
	const { storageKey, itemKey, updatedArr } = props;
	const state = getItemFromLocal(storageKey);

	const updatedState = {
		[itemKey]: updatedArr,
		...state,
	}

	return updateLocalStorage<T>(storageKey, updatedState);
}

function getItemFromLocal(name: string) {
	return JSON.parse(localStorage.getItem(name) || '{}');
}

function deleteLocalStorage(name: string) {
	return localStorage.removeItem(name);
}

function deleteStorageItem<T>(props: Omit<StorageItemProps<T>, 'updatedArr'>) {
	const { storageKey, itemKey } = props;
	const state = getItemFromLocal(storageKey);

	const copiedState = { ...state };
	delete copiedState[itemKey];

	if (Object.keys(copiedState).length === 0) {
		return deleteLocalStorage(storageKey)
	} else {
		return updateLocalStorage(storageKey, copiedState);
	}
}

export {
	updateLocalStorage,
	updateStorageItem,
	getItemFromLocal,
	deleteLocalStorage,
	deleteStorageItem,
}