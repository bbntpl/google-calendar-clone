import {
	ScheduleEventProps,
	ScheduleStates,
	Option,
} from '../index.model';

import '../styles.scss';
import CalendarIcon from '../../../assets/icons/calendar.png';
import LocationIcon from '../../../assets/icons/location.png';

import DateTimeBlock from '../Dialog/DateTimeBlock';
import CalendarSelection from '../Dialog/CalendarSelection';
import ColorSelection from './ColorSelection';
import DescInputBlock from '../Dialog/DescInputBlock';
import CustomInput from '../Dialog/CustomInputs/CustomInput';
import { ColorOption } from '../../../docs/data';
import { stringifyDate } from '../../../util/calendar-arrangement';
import { DateUnits } from '../../../context/global/index.model';

export default function EventBlock(props: ScheduleEventProps): JSX.Element {
	const { eventProps, setScheduleProps } = props;
	const {
		location,
		description,
		colorOption,
		calendarId,
		dateTime,
	} = eventProps;

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

	const handleDateChange = (selectedDate: DateUnits) => {
		// update time prop values on change
		setScheduleProps((scheduleProps: ScheduleStates) => ({
			...scheduleProps,
			dateTime: {
				...scheduleProps.dateTime,
				date: stringifyDate(selectedDate),
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

	const handleColorChange = (option: ColorOption | null) => {
		if (!option) return;
		setScheduleProps((scheduleProps: ScheduleStates) => ({
			...scheduleProps,
			colorOption: option,
		}));
	}

	return (
		<div className='calendar-schedule__event schedule-block'>
			<DateTimeBlock
				dateTime={dateTime}
				handleTimeChange={handleTimeChange}
				handleDateChange={handleDateChange}
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
						colorOption={colorOption}
						handleChange={handleColorChange}
					/>
				</div>
			</div>
		</div>
	)
}