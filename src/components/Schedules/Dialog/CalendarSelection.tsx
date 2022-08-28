import { Dispatch, SetStateAction, useContext } from 'react';
import { ScheduleStates, SelectOption } from '../index.model';

import CustomSelect from './CustomInputs/CustomSelect';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../context/global/index.model';
import { CSSObjectWithLabel } from 'react-select';

interface CalendarSelectionProps {
	calendarId: number;
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>
}

export default function CalendarSelection(props: CalendarSelectionProps) {
	const {
		calendarId,
		setScheduleProps,
	} = props;
	const {
		calendarList,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const calendarOptions = calendarList.map(({ name, id }) => {
		return { label: name, id }
	});
	const calendarOption = calendarOptions.find(obj => obj.id === calendarId);
	const handleChange = (option: SelectOption | null) => {
		if (!option) return;
		const { id } = option;
		setScheduleProps((scheduleProps: ScheduleStates) => ({
			...scheduleProps,
			calendarId: id,
		}));
	}
	return (
		<CustomSelect
			styles={{
				control: (base: CSSObjectWithLabel) => ({
					...base,
					maxWidth: '250px',
				}),
			}}
			options={calendarOptions}
			value={calendarOption}
			onChange={handleChange}
			isSearchable={true}
		/>
	)
}