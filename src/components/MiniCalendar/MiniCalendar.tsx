import { Fragment, useState, useEffect, useContext } from 'react';
import { getMonth, stringifiedDate, dateToday } from '../../util/calendar-arrangement';
import './styles.scss';
import dayjs from 'dayjs';

import Switcher from '../../lib/switcher';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface, {
	NonOptionalKeys,
	SelectedDate,
} from '../../context/global/index.model';

type RootElementModifier = 'static' | 'by-content';
type ClickHandlerType = 'select' | 'schedule';
interface MiniCalendarProps {
	rootElModifier: RootElementModifier,
	clickHandlerType?: ClickHandlerType
}
interface SelectCalendarDayProps {
	numericalMonth: number,
	numericalDate: SelectedDate,
}

export default function MiniCalendar(props: MiniCalendarProps): JSX.Element {
	const {
		rootElModifier = 'static',
		clickHandlerType = 'select',
	} = props;
	const {
		selectedDate,
		setSelectedDate,
		setDefaultDateTime,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const [currentMonth, setCurrentMonth] = useState(getMonth());
	const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());

	useEffect(() => {
		setCurrentMonth(getMonth(currentMonthIndex));
	}, [currentMonthIndex]);

	useEffect(() => {
		const yearIndex = selectedDate.year - dayjs().year();
		const newMonthIndex = yearIndex === 0
			? selectedDate.month - 1
			: (yearIndex * 12) + (selectedDate.month - 1);
		setCurrentMonthIndex(newMonthIndex);
	}, [selectedDate])

	const decrementMonthIndex = () => setCurrentMonthIndex(index => index - 1);
	const incrementMonthIndex = () => setCurrentMonthIndex(index => index + 1);

	const handleSelectedDay = (date: Record<NonOptionalKeys<SelectedDate>, number>) => {
		setSelectedDate(date);
	}

	// onclick handler when clicking the day in calendar
	const handleClick = (numericalDate: SelectedDate) => {
		if (clickHandlerType === 'select') {
			handleSelectedDay(numericalDate);
		} else if (clickHandlerType === 'schedule') {
			setDefaultDateTime(defaultDateTime =>({
				...defaultDateTime,
				date: stringifiedDate(numericalDate),
			}));
		}
	}

	const selectCalendarDay = ({ numericalMonth, numericalDate }: SelectCalendarDayProps) => {
		const isDayFromCurrentMonth = numericalMonth === Number(currentMonth[2][1].format('M'));
		if (!isDayFromCurrentMonth) {
			setCurrentMonthIndex(numericalMonth - 1);
		}
		handleClick(numericalDate);
	}

	// it results in a styling modifier depending on the met conditions
	const numericalDateModifier = ({ year, month, day }:
		Record<NonOptionalKeys<SelectedDate>, number>) => {
		const isReceivedDateToday =
			stringifiedDate(dateToday) === stringifiedDate({ year, month, day });
		const isSelectedMonth = month === Number(currentMonth[2][1].format('M'));
		if (isReceivedDateToday && isSelectedMonth) {
			return '--today';
		} else if (!isSelectedMonth) {
			return '--greyed';
		} else if (stringifiedDate(selectedDate) === stringifiedDate({ year, month, day })) {
			return '--selected';
		}
		return '';
	}

	return (
		<div className={`calendar-container--${rootElModifier}`}>
			<div className='calendar__month--small'>
				<div className='calendar__month__header--small'>
					<h5>{`
					${currentMonth[2][1].format('MMMM')} 
					${currentMonth[2][1].format('YYYY')}
				`}</h5>
					<Switcher
						chevronLeftHandler={decrementMonthIndex}
						chevronRightHandler={incrementMonthIndex}
					/>
				</div>
				<div className='calendar__week-grid--small'>
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