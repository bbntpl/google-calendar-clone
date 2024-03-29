import { Fragment, useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { getMonth, convertDateUnitsToString, dateToday } from '../../util/calendar-arrangement';
import './styles.scss';

import Switcher from '../../lib/Switcher';
import { DateUnits } from '../../contexts/CalendarConfigContext/index.model';
import { useCalendarConfig, useCalendarConfigUpdater } from '../../contexts/CalendarConfigContext';

type RootElementModifier = 'static' | 'by-content';
interface MiniCalendarProps {
	rootElModifier: RootElementModifier
	initialDate?: DateUnits;
}

interface SelectCalendarDayProps {
	numericalMonth: number,
	numericalDate: DateUnits,
}

function isDateUnits(date: unknown): date is DateUnits {
  return typeof date === 'object' && date !== null && 'year' in date;
}

export default function MiniCalendar(props: MiniCalendarProps): JSX.Element {
	const {
		rootElModifier = 'static',
		initialDate,
	} = props;
	const { selectedDate } = useCalendarConfig();
	const { setSelectedDate } = useCalendarConfigUpdater();
	const [currentMonth, setCurrentMonth] = useState(getMonth());
	const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
	const [isInitialDateExistsAndNotUsed, setIsInitialDateExistsAndNotUsed]
		= useState(!!initialDate);

	// This ensures that the initialDate prop must be highlighted initially,
	// only before the first change of date/day happens by clicking on the
	// mini calendar day component
	const highlightedDate = isInitialDateExistsAndNotUsed && isDateUnits(initialDate)
		? initialDate : selectedDate;

	useEffect(() => {
		setCurrentMonth(getMonth(currentMonthIndex));
	}, [currentMonthIndex]);

	useEffect(() => {
		const yearIndex = (highlightedDate.year as number) - dayjs().year();
		const newMonthIndex = yearIndex === 0
			? (highlightedDate.month as number) - 1
			: (yearIndex * 12) + ((highlightedDate.month as number) - 1);
		setCurrentMonthIndex(newMonthIndex);
	}, [highlightedDate])

	const decrementMonthIndex = () => setCurrentMonthIndex(index => index - 1);
	const incrementMonthIndex = () => setCurrentMonthIndex(index => index + 1);

	const handleSelectedDay = (date: DateUnits) => {
		setSelectedDate(date);
	}

	// On click handler for calendar month switch button
	const handleMonthSwitchClick = (numericalDate: DateUnits) => {
		handleSelectedDay(numericalDate);
	}

	const selectCalendarDay = ({ numericalMonth, numericalDate }: SelectCalendarDayProps) => {
		const isDayFromCurrentMonth = numericalMonth === Number(currentMonth[2][1].format('M'));
		if (!isDayFromCurrentMonth) {
			setCurrentMonthIndex(numericalMonth - 1);
		}
		handleMonthSwitchClick(numericalDate);
	}

	// It returns a style modifier depending on the met conditions
	const numericalDateModifier = ({ year, month, day }: DateUnits) => {
		const isReceivedDateToday =
			convertDateUnitsToString(dateToday) === convertDateUnitsToString({ year, month, day });
		const isSelectedMonth = month === Number(currentMonth[2][1].format('M'));
		if (isReceivedDateToday && isSelectedMonth) {
			return '--today';
		} else if (!isSelectedMonth) {
			return '--greyed';
		} else if (convertDateUnitsToString(highlightedDate) === convertDateUnitsToString({ year, month, day })) {
			return '--selected';
		}
		return '';
	}

	const handleDayClick = (props: SelectCalendarDayProps) => () => {
		if (initialDate && isInitialDateExistsAndNotUsed) {
			setIsInitialDateExistsAndNotUsed(false);
		}
		selectCalendarDay(props)
	}

	return (
		<div className={`calendar-container--${rootElModifier}`}>
			<div className='calendar-month--mini'>
				<div className='calendar-month__header--mini'>
					<h5>{`
					${currentMonth[2][1].format('MMMM')} 
					${currentMonth[2][1].format('YYYY')}
				`}</h5>
					<Switcher
						goPrev={decrementMonthIndex}
						goNext={incrementMonthIndex}
					/>
				</div>
				<div className='calendar__week-grid--mini'>
					{currentMonth[0].map((day, i) => (
						<div key={`day-${i}`}>
							<span className='calendar__week-grid__day-type'>
								{day.format('dd').charAt(0)}
							</span>
						</div>
					))}
					{currentMonth.map((week, weekIndex) => (
						<Fragment key={weekIndex}>
							{week.map((day, dayIndex) => {
								const numericalMonth = Number(day.format('M'));
								const numericalDay = Number(day.format('D'));
								const numericalDate = {
									year: Number(day.format('YYYY')),
									month: numericalMonth,
									day: numericalDay,
								};
								const modifier = numericalDateModifier(numericalDate);
								return (
									<button
										key={dayIndex}
										className={`numerical-day${modifier}`}
										onClick={handleDayClick({ numericalMonth, numericalDate })}
									>
										<span>{numericalDay}</span>
									</button>
								)
							})}
						</Fragment>
					))}
				</div>
			</div>
		</div>
	)
}