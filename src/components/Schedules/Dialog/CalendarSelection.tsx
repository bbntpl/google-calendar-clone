import { useContext } from 'react';
import { Option } from '../index.model';

import CustomSelect from './CustomInputs/CustomSelect';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../context/global/index.model';

interface CalendarSelectionProps {
	calendarId: number;
	handleChange: (option: Option | null) => void;
}

export default function CalendarSelection(props: CalendarSelectionProps) {
	const { calendarId, handleChange } = props;
	const {
		calendarList,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const calendarOptions = calendarList.map(({ name, id }) => {
		return { label: name, value: id }
	});
	const calendarOption = calendarOptions.find(obj => {
		return obj.value === calendarId;
	});

	return (
		<CustomSelect
			options={calendarOptions}
			value={calendarOption}
			onChange={handleChange}
			isSearchable={true}
		/>
	)
}