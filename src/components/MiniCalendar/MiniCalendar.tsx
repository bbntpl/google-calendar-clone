import { Fragment, useState, useEffect, useContext } from 'react';
import { getMonth, stringifyDate, dateToday } from '../../util/calendar-arrangement';
import './styles.scss';
import dayjs from 'dayjs';

import Switcher from '../../lib/Switcher';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface, {
	DateUnits,
} from '../../context/global/index.model';

type RootElementModifier = 'static' | 'by-content';
interface MiniCalendarProps {
	rootElModifier: RootElementModifier,
}
interface SelectCalendarDayProps {
	numericalMonth: number,
	numericalDate: DateUnits,
}

export default function MiniCalendar(props: MiniCalendarProps): JSX.Element {
	const {
		rootElModifier = 'static',
	} = props;
	const {
		selectedDate,
		setSelectedDate,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const [currentMonth, setCurrentMonth] = useState(getMonth());
	const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());

	useEffect(() => {
		setCurrentMonth(getMonth(currentMonthIndex));
	}, [currentMonthIndex]);

	useEffect(() => {
		const yearIndex = (selectedDate.year as number) - dayjs().year();
		const newMonthIndex = yearIndex === 0
			? (selectedDate.month as number) - 1
			: (yearIndex * 12) + ((selectedDate.month as number) - 1);
		setCurrentMonthIndex(newMonthIndex);
	}, [selectedDate])

	const decrementMonthIndex = () => setCurrentMonthIndex(index => index - 1);
	const incrementMonthIndex = () => setCurrentMonthIndex(index => index + 1);

	const handleSelectedDay = (date: DateUnits) => {
		setSelectedDate(date);
	}

	// On click handler for calendar day button
	const handleClick = (numericalDate: DateUnits) => {
		handleSelectedDay(numericalDate);
	}

	const selectCalendarDay = ({ numericalMonth, numericalDate }: SelectCalendarDayProps) => {
		const isDayFromCurrentMonth = numericalMonth === Number(currentMonth[2][1].format('M'));
		if (!isDayFromCurrentMonth) {
			setCurrentMonthIndex(numericalMonth - 1);
		}
		handleClick(numericalDate);
	}

	// It returns a style modifier depending on the met conditions
	const numericalDateModifier = ({ year, month, day }: DateUnits) => {
		const isReceivedDateToday =
			stringifyDate(dateToday) === stringifyDate({ year, month, day });
		const isSelectedMonth = month === Number(currentMonth[2][1].format('M'));
		if (isReceivedDateToday && isSelectedMonth) {
			return '--today';
		} else if (!isSelectedMonth) {
			return '--greyed';
		} else if (stringifyDate(selectedDate) === stringifyDate({ year, month, day })) {
			return '--selected';
		}
		return '';
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
								const numericalYear = Number(day.format('YYYY'));
								const numericalMonth = Number(day.format('M'));
								const numericalDay = Number(day.format('D'));
								const numericalDate = {
									year: numericalYear,
									month: numericalMonth,
									day: numericalDay,
								};
								const modifier = numericalDateModifier(numericalDate);
								return (
									<button
										key={dayIndex}
										className={`numerical-day${modifier}`}
										onClick={() => selectCalendarDay({ numericalMonth, numericalDate })}
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