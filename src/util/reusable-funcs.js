export const arrayElsToString = (arr) => {
	return arr.reduce((text, val) => {
		return text += `${val} `;
	}, '')
}

export const getIndexByProp = ({ arr, key, value }) => {
	return arr.findIndex(obj => obj[key] === value);
}

export const hasOnlyDigits = (value) => {
	return /^-?\d+$/.test(value);
}

export const objKeysToArr = (obj) => {
	return Object.keys(obj).map((value) => obj[value]);
}

export const removeMatchedTxtOnArr = (arr, text) => {
	return arr.filter(el => text !== el);
}

export const uniqueID = () =>
	Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
