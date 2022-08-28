import { ScheduleEventProps, ScheduleStates } from '../index.model';

import '../styles.scss';
import CalendarIcon from '../../../assets/icons/calendar.png';
import LocationIcon from '../../../assets/icons/location.png';

import DateTimeInputs from './DateTimeBlock';
import CalendarSelection from '../Dialog/CalendarSelection';
import ColorSelection from './ColorSelection';
import DescInputBlock from '../Dialog/DescInputBlock';
import CustomInput from '../Dialog/CustomInputs/CustomInput';

export default function EventBlock(props: ScheduleEventProps): JSX.Element {
	const { evtProps, setScheduleProps } = props;
	const {
		location,
		description,
		color,
		calendarId,
		dateTime,
	} = evtProps;

	const locationInputProps = {
		value: location,
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			setScheduleProps((scheduleProps: ScheduleStates) => ({
				...scheduleProps,
				location: e.target.value,
			}))
		},
		placeholder: 'Add location of the event',
	}
	
	return (
		<div className='calendar-schedule__event schedule-block'>
			<DateTimeInputs
				dateTime={dateTime}
				setScheduleProps={setScheduleProps}
			/>
			<div className='schedule-input-list'>
				<span>
					<img src={LocationIcon} />
				</span>
				<CustomInput {...locationInputProps} />
			</div>
			<DescInputBlock
				description={description}
				setScheduleProps={setScheduleProps}
			/>
			<div className='schedule-input-list'>
				<span>
					<img src={CalendarIcon} />
				</span>
				<div style={{ display: 'flex', gap: '.5rem' }}>
					<CalendarSelection
						calendarId={calendarId}
						setScheduleProps={setScheduleProps}
					/>
					<ColorSelection
						color={color}
						setScheduleProps={setScheduleProps}
					/>
				</div>
			</div>
		</div>
	)
}