export interface ColorOption {
	readonly color: string;
	readonly label: string;
	readonly value: string;
}

export const colorOptions: Array<ColorOption> = [
	{ color: 'basil', label: 'Basil', value: '#0B8043' },
	{ color: 'black', label: 'Black', value: '#000' },
	{ color: 'blueberry', label: 'Blueberry', value: '#3F51B5' },
	{ color: 'citron', label: 'Citron', value: '#E4C441' },
	{ color: 'raddichio', label: 'Raddichio', value: '#AD1457' },
	{ color: 'royal blue', label: 'Royal Blue', value: '#1A73E8' },
	{ color: 'rolling stone', label: 'Rolling Stone', value: '#70757A' },
	{ color: 'tangerine', label: 'Tangerine', value: '#F4511E' },
	{ color: 'grafito', label: 'Grafito', value: '#616161' },
];

export const getColorOption = (color: ColorOption['color'] = 'black') => {
	const colorOption = colorOptions.find(option => option.color === color);
	return colorOption || colorOptions[1];
}

export const getRandomColorOption = () => {
	const randomIndex = Math.ceil(Math.random() * colorOptions.length) - 1;
	return colorOptions[randomIndex];
}