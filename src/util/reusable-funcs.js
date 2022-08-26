export const uniqueID = () =>
	Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

export const objKeysToArr = (obj) => {
	return Object.keys(obj).map((value) => obj[value]);
}

export const getIndexByProp = ({ arr, key, value }) => {
	return arr.findIndex(obj => obj[key] === value);
}

export const arrayElsToString = (arr) => {
	return arr.reduce((text, val) => {
		return text += `${val} `;
	}, '')
}

export const removeMatchedTxtOnArr = (arr, text) => {
	return arr.filter(el => text !== el);
}