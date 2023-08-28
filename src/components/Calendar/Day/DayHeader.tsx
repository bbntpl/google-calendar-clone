import { useContext } from 'react';
import { Dayjs } from 'dayjs';

import { dateToday, getDateValues, stringifyDate } from '../../../util/calendar-arrangement';
import { DateUnits } from '../../../context/global/index.model';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../context/global/index.model';

import TimeRowUnset from '../Time/TimeRowUnset';

import '../styles.scss';

interface DayHeaderProps {
	dateObj: Dayjs,
	dayIndex: number,
	isCentered?: boolean | undefined,
	isSelectable?: boolean | undefined,
}

export default function DayHeader(props: DayHeaderProps) {
	const {
		filteredSchedules,
		selectedDate,
		setSelectedDate,
		setCalendarType,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const { dateObj, dayIndex, isCentered = true } = props;

	const filteredSchedulesByDayAndTime = filteredSchedules.filter(sch => {
		return sch.dateTime.date === stringifyDate(getDateValues(dateObj, {
			yearFormat: 'YYYY',
			monthFormat: 'MM',
			dayFormat: 'DD',
		})) && (sch.dateTime.time.start < 0 && sch.dateTime.time.end < 0 );
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

	const switchDateAndCalendarType = () => {
		selectDateByClick();
		setCalendarType('day');
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
					onClick={switchDateAndCalendarType}
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