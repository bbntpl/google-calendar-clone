import { 
	ScheduleEventProps, 
	ScheduleStates, 
	Option, 
} from '../index.model';
import { COLORS } from '../../../context/global/index.model';

import '../styles.scss';
import CalendarIcon from '../../../assets/icons/calendar.png';
import LocationIcon from '../../../assets/icons/location.png';

import DateTimeBlock from '../Dialog/DateTimeBlock';
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

	const handleTimeChange = (option: Option | null, propName: string) => {
		if (option) {
			const { value } = option;
			// update time prop values on change
			setScheduleProps((scheduleProps: ScheduleStates) => ({
				...scheduleProps,
				dateTime: {
					...scheduleProps.dateTime,
					time: {
						...scheduleProps.dateTime.time,
						[propName]: value,
					},
				},
			}));
		}
	};

	const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;
		setScheduleProps((scheduleProps: ScheduleStates) => ({
			...scheduleProps,
			description: newValue,
		}));
	}

	const handleCalendarChange = (option: Option | null) => {
		if (!option) return;
		const { value } = option;
		setScheduleProps((scheduleProps: ScheduleStates) => ({
			...scheduleProps,
			calendarId: value,
		}));
	}

		const handleColorChange = (option: Option | null) => {
		if (!option) return;
		const { label } = option;
		setScheduleProps((scheduleProps: ScheduleStates) => ({
			...scheduleProps,
			color: label as COLORS,
		}));
	}

	return (
		<div className='calendar-schedule__event schedule-block'>
			<DateTimeBlock
				dateTime={dateTime}
				handleChange={handleTimeChange}
			/>
			<div className='schedule-input-list'>
				<span>
					<img src={LocationIcon} />
				</span>
				<CustomInput {...locationInputProps} />
			</div>
			<DescInputBlock
				description={description}
				handleChange={handleDescriptionChange}
			/>
			<div className='schedule-input-list'>
				<span>
					<img src={CalendarIcon} />
				</span>
				<div style={{ display: 'flex', gap: '.5rem' }}>
					<CalendarSelection
						calendarId={calendarId}
						handleChange={handleCalendarChange}
					/>
					<ColorSelection
						color={color}
						handleChange={handleColorChange}
					/>
				</div>
			</div>
		</div>
	)
}