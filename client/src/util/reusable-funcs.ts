interface GetIndexByPropArgs {
	arr: Record<string, unknown>[]
	key: string
	value: unknown
}

export const getIndexByProp = ({ arr, key, value }: GetIndexByPropArgs) => {
	return arr.findIndex(obj => obj[key] === value);
}

export const hasOnlyDigits = (value: string | number): boolean => {
	return /^-?\d+$/.test(String(value));
}

export const objKeysToArr = (obj: Record<string, unknown>) => {
	return Object.keys(obj).map((value) => obj[value]);
}

export const removeMatchedTxtOnArr = (arr: string[], text: string) => {
	return arr.filter(el => text !== el);
}

export const truncateString = (string: string, limit: number) => {
	if (string.length > limit) {
		return string.substring(0, limit) + '...';
	}
	return string
}

export const uniqueID = () =>
	Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
