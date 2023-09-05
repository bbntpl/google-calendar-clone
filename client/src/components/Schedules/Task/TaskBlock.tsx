import {
	ScheduleStates,
	ScheduleTaskProps,
	Option,
} from '../index.model';
import { convertDateUnitsToString } from '../../../util/calendar-arrangement';

import '../styles.scss';
import CalendarIcon from '../../../assets/icons/calendar.png';

import DateTimeBlock from '../Dialog/DateTimeBlock';
import CalendarSelection from '../Dialog/CalendarSelection';
import DescInputBlock from '../Dialog/DescInputBlock';
import { DateUnits } from '../../../context/CalendarConfigContext/index.model';

export default function TaskBlock(props: ScheduleTaskProps): JSX.Element {
	const { taskProps, setScheduleProps } = props;
	const {
		description,
		calendarId,
		dateTime,
	} = taskProps;

	const handleTimeChange = (option: Option | null, propName: string) => {
		if (option) {
			const { value } = option;
			// Update time prop values on change
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

	const handleDateChange = (selectedDate: DateUnits) => {
		// Update time prop values on change
		setScheduleProps((scheduleProps: ScheduleStates) => ({
			...scheduleProps,
			dateTime: {
				...scheduleProps.dateTime,
				date: convertDateUnitsToString(selectedDate),
			},
		}));
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

	return (
		<div className='calendar-schedule__event schedule-block'>
			<DateTimeBlock
				dateTime={dateTime}
				handleTimeChange={handleTimeChange}
				handleDateChange={handleDateChange}
			/>
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
				</div>
			</div>
		</div>
	)
}