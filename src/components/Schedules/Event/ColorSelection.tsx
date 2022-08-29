import { COLORS } from '../../../context/global/index.model';
import { COLOR_NAMES } from '../../../util/calendar-arrangement';
import { Option } from '../index.model';

import CustomSelect from '../Dialog/CustomInputs/CustomSelect';
import { StylesConfig } from 'react-select';

interface ColorSelectionProps {
	color: COLORS;
	handleChange: (option: Option | null) => void;
}

const block = (color = 'transparent') => ({
	alignItems: 'center',
	display: 'flex',
	':before': {
		backgroundColor: color,
		color: color,
		content: '" "',
		marginRight: 8,
		height: 8,
		width: 8,
	},
});

const customStyles: StylesConfig<Option> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'white',
    maxWidth: '250px',
  }),
  option: (styles, { data }) => {
    const { label } = data;
    return {
      ...styles,
      backgroundColor: '#fff',
			class: `color-${label}`,
      cursor: 'default',
			maxWidth: '250px',
    };
  },
	input: (styles) => ({ ...styles, ...block() }),
	singleValue: (styles, { data }) => ({ ...styles, ...block(data.label) }),
};


export default function ColorSelection(props: ColorSelectionProps) {
	const { color, handleChange } = props;

	const colorOptions = COLOR_NAMES.map((color, cIndex) => ({
		label: color,
		value: cIndex,
	}));

	const colorOption = colorOptions.filter(c => c.label === color);

	return (
		<CustomSelect
			options={colorOptions}
			value={colorOption}
			styles={customStyles}
		/>
	)
}