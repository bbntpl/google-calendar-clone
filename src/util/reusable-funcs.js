export const uniqueID = () =>
	Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

export const objKeysToArr = (obj) => {
	return Object.keys(obj).map((value) => obj[value]);
}

export const getIndexByProp = ({ arr, key, value }) => {
	return arr.findIndex(obj => obj[key] === value);
}