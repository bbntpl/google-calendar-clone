import { Option } from '../index.model';

import CustomSelect from './CustomInputs/CustomSelect';
import { useStore } from '../../../context/StoreContext';

interface CalendarSelectionProps {
	calendarId: number;
	handleChange: (option: Option | null) => void;
}

export default function CalendarSelection(props: CalendarSelectionProps) {
	const { calendarId, handleChange } = props;
	const { calendars } = useStore();

	const calendarOptions = calendars
		.filter(calendar => calendar.type === 'default')
		.map(({ name, id }) => {
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
			styles={{
				control: (styles) => ({
					...styles,
					maxWidth: '150px',
				}),
				option: (styles) => ({
					...styles,
					maxWidth: '150px',
				}),
			}}
		/>
	)
}