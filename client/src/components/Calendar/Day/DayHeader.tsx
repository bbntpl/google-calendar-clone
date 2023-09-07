import { Dayjs } from 'dayjs';

import { dateToday, getDateValues, convertDateUnitsToString } from '../../../util/calendar-arrangement';

import TimeRowUnset from '../Time/TimeRowUnset';

import '../styles.scss';
import { useStore } from '../../../context/StoreContext';
import { useCalendarConfig, useCalendarConfigUpdater } from '../../../context/CalendarConfigContext';
import { Schedule } from '../../../context/StoreContext/types/schedule';
import { DateUnits } from '../../../context/CalendarConfigContext/index.model';

interface DayHeaderProps {
	dateObj: Dayjs,
	dayIndex: number,
	isCentered?: boolean | undefined,
	isSelectable?: boolean | undefined,
}

export default function DayHeader(props: DayHeaderProps) {
	const {
		filteredSchedules,
	} = useStore();

	const {
		selectedDate,
	} = useCalendarConfig();

	const {
		setSelectedDate,
		setSelectedCalendarUnit,
	} = useCalendarConfigUpdater();

	const { dateObj, dayIndex, isCentered = true } = props;

	const filteredSchedulesByDayAndTime
		= filteredSchedules.filter((schedule: Schedule) => {
			return schedule.dateTime.date === convertDateUnitsToString(getDateValues(dateObj, {
				yearFormat: 'YYYY',
				monthFormat: 'MM',
				dayFormat: 'DD',
			})) && (schedule.dateTime.time.start < 0 && schedule.dateTime.time.end < 0);
		});

	const areDatesEqual = (dateObjToCompare: DateUnits) => {
		const { year, month, day } = dateObjToCompare;
		const numericalYear = Number(dateObj.format('YYYY'));
		const numericalMonth = Number(dateObj.format('M'));
		const numericalDay = Number(dateObj.format('D'));
		return year === numericalYear && month === numericalMonth && day === numericalDay;
	}

	const generateDateModifier = () => {
		if (areDatesEqual(dateToday)) {
			return '--today';
		} else if (areDatesEqual(selectedDate)) {
			return '--selected';
		}
		return '';
	}

	const selectDateByClick = () => {
		const year = Number(dateObj.format('YYYY'));
		const month = Number(dateObj.format('M'));
		const day = Number(dateObj.format('D'));
		setSelectedDate({ year, month, day });
	}

	const switchDateAndCalendarUnit = () => {
		selectDateByClick();
		setSelectedCalendarUnit('day');
	}

	const dateFormats = {
		yearFormat: 'YYYY',
		monthFormat: 'M',
		dayFormat: 'D',
	}

	return (
		<div className='calendar-day__header'>
			<div className={`calendar-day__info--${!isCentered ? 'not-' : ''}centered flex-centered`}>
				<h6 className={`calendar-day__ddd-format${generateDateModifier()}`}>
					{dateObj.format('ddd')}
				</h6>
				<div
					className={`calendar-day__num-format${generateDateModifier()} flex-centered`}
					onClick={switchDateAndCalendarUnit}
				>
					{dateObj.format('D')}
				</div>
			</div>
			<TimeRowUnset
				dateValues={getDateValues(dateObj, dateFormats)}
				dayIndex={dayIndex}
				filteredSchedulesByTime={filteredSchedulesByDayAndTime}
			/>
		</div>
	)
}