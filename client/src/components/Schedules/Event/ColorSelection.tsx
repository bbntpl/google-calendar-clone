import { ColorOption, colorOptions } from '../../../util/color-options';
import CustomSelect from '../Dialog/CustomInputs/CustomSelect';
import { StylesConfig } from 'react-select';

interface ColorSelectionProps {
	colorOption: ColorOption;
	handleChange: (option: ColorOption | null) => void;
}

const block = (colorValue = 'transparent') => ({
	alignItems: 'center',
	display: 'flex',
	':before': {
		backgroundColor: colorValue,
		color: colorValue,
		content: '" "',
		marginRight: 8,
		height: 8,
		width: 8,
	},
});

const customStyles: StylesConfig<ColorOption, false> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'white',
    maxWidth: '170px',
  }),
  option: (styles, { data }) => {
    const { value } = data;
    return {
      ...styles,
			...block(value),
      backgroundColor: '#fff',
			color: value,
      cursor: 'default',
			maxWidth: '170px',
    };
  },
	input: (styles) => ({ ...styles, ...block() }),
	singleValue: (styles, { data }) => ({ ...styles, ...block(data.value) }),
};

export default function ColorSelection(props: ColorSelectionProps) {
	const { colorOption, handleChange } = props;

	const options = colorOptions.map((colorOption: ColorOption) => (colorOption));

	const option = colorOptions.find(option => option.color === colorOption.color);

	return (
		<CustomSelect
			options={options}
			value={option}
			styles={customStyles}
			onChange={handleChange}
		/>
	)
}