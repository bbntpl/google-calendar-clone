// Check if key exists in local storage
export function has(key: string): boolean {
	return localStorage.hasOwnProperty(key);
}

// Get the value from local storage
export function get<T>(key: string): T | undefined {
	const storedItem = localStorage.getItem(key);
	return storedItem === null ? undefined : JSON.parse(storedItem);
}

// Set item to local storage
export function set<T>(key: string, value: T): void {
	localStorage.setItem(key, JSON.stringify(value))
}

// Remove item from lcoal storage
export function remove(key: string) {
	localStorage.removeItem(key);
}

export function modify<T>(key: string, fn: (existingValue: T | undefined) => T): void {
	const existingValue = get<T>(key);
	const modifiedValue = fn(existingValue);
	set(key, modifiedValue);
}

export function appendArrayItemToArray<T>(key: string, item: T[]) {
	modify<T[]>(key, (storage: T[] = []) => {
		return [...storage, ...item];
	});
}

export function appendItemToArray<T>(key: string, item: T) {
	modify<T[]>(key, (storage: T[] = []) => {
		return [...storage, item];
	});
}

export function editItemInArray<T extends { id: string | number }>(key: string, updatedItem: T): void {
	modify<T[]>(key, (storage: T[] = []) => {
		return storage.map((item) => {
			if (item.id === updatedItem.id) {
				return { ...item, ...updatedItem };
			}
			return item;
		});
	});
}

export function removeItemFromArrayById<T extends { id: number | string }>(key: string, item: T) {
	modify(key, (storage: T[] = []) => {
		return storage.filter(s => s.id !== item.id);
	});
}

export function saveItemToObject<T>(key: string, item: T) {
	modify(key, (storage: Record<string, T> = {}) => {
		return { ...storage, item };
	});
}