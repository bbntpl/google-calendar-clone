import React from 'react';

import {
	dateToday,
	dayjsObj,
	getDateValues,
} from '../../util/calendar-arrangement';

import './styles.scss';

import Switcher from '../../lib/Switcher';
import { HamburgerLogo } from './HamburgerLogo';
import CalendarUnitSelector from './CalendarUnitSelector';
import { CalendarDate } from './CalendarDate';
import SettingsButton from './Settings/Button';
import UserAuthButton from './UserAuthButton';

import {
	useCalendarConfig,
	useCalendarConfigUpdater,
} from '../../context/CalendarConfigContext';
import { DateUnits } from '../../context/CalendarConfigContext/index.model';


export default function Header(): JSX.Element {
	const {
		selectedCalendarUnit,
		selectedDate,
	} = useCalendarConfig();
	const { setSelectedDate } = useCalendarConfigUpdater();

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
				<div className='row center-xs middle-xs max-content col-xs-offset-1'>
					<CalendarUnitSelector />
					<SettingsButton />
					<UserAuthButton />
				</div>
			</div>
		</div>
	)
}