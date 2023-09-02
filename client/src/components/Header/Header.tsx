import { useContext } from 'react';
import {
	dateToday,
	dayjsObj,
	getDateValues,
} from '../../util/calendar-arrangement';
import GlobalContextInterface, { DateUnits } from '../../context/global/index.model';
import GlobalContext from '../../context/global/GlobalContext';

import './styles.scss';

import Switcher from '../../lib/Switcher';
import { HamburgerLogo } from './HamburgerLogo';
import CalendarUnitSelector from './CalendarUnitSelector';
import { CalendarDate } from './CalendarDate';

export default function Header(): JSX.Element {
	const {
		selectedCalendarUnit,
		selectedDate,
		setSelectedDate,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const dateFormats = {
		yearFormat: 'YYYY',
		monthFormat: 'M',
		dayFormat: 'D',
	}

	const dateRangeSwitcher = () => {
		const dateObj = dayjsObj({ ...selectedDate });
		switch (selectedCalendarUnit) {
			case 'day':
				const prevDayValues: DateUnits = getDateValues(dateObj.subtract(1, 'day'), dateFormats);
				const nextDayValues: DateUnits = getDateValues(dateObj.add(1, 'day'), dateFormats);
				return {
					goPrev: () => setSelectedDate(prevDayValues),
					goNext: () => setSelectedDate(nextDayValues),
				};
			case 'week':
				const prevWeekValues = getDateValues(dateObj.subtract(7, 'day'), dateFormats);
				const nextWeekValues = getDateValues(dateObj.add(7, 'day'), dateFormats);
				return {
					goPrev: () => setSelectedDate(prevWeekValues),
					goNext: () => setSelectedDate(nextWeekValues),
				};
			case 'fourDays':
				const prevFourDaysValues = getDateValues(dateObj.subtract(4, 'day'), dateFormats);
				const nextFourDaysValues = getDateValues(dateObj.add(4, 'day'), dateFormats);
				return {
					goPrev: () => setSelectedDate(prevFourDaysValues),
					goNext: () => setSelectedDate(nextFourDaysValues),
				};
			default:
				const prevMonthValues = getDateValues(dateObj.subtract(1, 'month'), dateFormats);
				const nextMonthValues = getDateValues(dateObj.add(1, 'month'), dateFormats);
				return {
					goPrev: () => setSelectedDate(prevMonthValues as DateUnits),
					goNext: () => setSelectedDate(nextMonthValues as DateUnits),
				};
		}
	}

	return (
		<div className='header'>
			<div className='header__inner row between-xs'>
				<div className='row start-xs middle-xs max-content'>
					<HamburgerLogo />
					<div
						className='row center-xs middle-xs max-content col-xs-offset-1'
					>
						<button className='header-input' onClick={() => setSelectedDate(dateToday)}>
							Today
						</button>
						<Switcher {...dateRangeSwitcher()} />
						<CalendarDate />
					</div>
				</div>
				<CalendarUnitSelector />
			</div>
		</div>
	)
}