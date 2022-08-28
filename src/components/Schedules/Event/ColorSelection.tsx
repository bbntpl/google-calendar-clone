import {
	Dispatch,
	SetStateAction,
} from 'react';
import { COLORS } from '../../../context/global/index.model';
import { COLOR_NAMES } from '../../../util/calendar-arrangement';
import { ScheduleStates, SelectOption } from '../index.model';

import CustomSelect from '../Dialog/CustomInputs/CustomSelect';

interface ColorSelectionProps {
	color: COLORS;
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>
}

export default function ColorSelection(props: ColorSelectionProps) {
	const {
		color,
		setScheduleProps,
	} = props;

	const colorOptions = COLOR_NAMES.map((color, cIndex) => {
		return {
			label: color,
			id: cIndex,
		}
	});

	const defaultColorOption = colorOptions.filter(c => c.label === color);

	const handleChange = (option: SelectOption | null) => {
		if (!option) return;
		const { label } = option;
		setScheduleProps((scheduleProps: ScheduleStates) => ({
			...scheduleProps,
			color: label as COLORS,
		}));
	}
	return (
		<CustomSelect
			options={colorOptions}
			value={defaultColorOption}
			onChange={handleChange}
			isSearchable={true}
		/>
	)
}