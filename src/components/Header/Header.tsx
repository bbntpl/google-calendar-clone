import { useContext } from 'react';
import {
	dateToday,
	dayjsObj,
	getDateValues,
} from '../../util/calendar-arrangement';
import GlobalContextInterface from '../../context/global/index.model';
import GlobalContext from '../../context/global/GlobalContext';
import useComponentVisible from '../../hooks/useComponentVisible';

import './styles.scss';
import SortDown from '../../assets/icons/sort-down.png';

import MiniCalendar from '../MiniCalendar';
import Dialog from '../../lib/Dialog';
import Switcher from '../../lib/switcher/index';
import { HamburgerLogo } from './HamburgerLogo';
import CalendarTypeOptions from './CalendarTypeOptions';

export default function Header(): JSX.Element {
	const {
		calendarType,
		selectedDate,
		setSelectedDate,
		visibilities,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const [
		miniCalendarRef,
		isMiniCalendarVisible,
		setIsMiniCalendarVisible,
		linkRef,
	] = useComponentVisible(false);

	const miniCalendarProps = {
		componentProps: {},
		Component: MiniCalendar,
		positionOffset: { x: 0, y: 40 },
		isDraggable: false,
		isDialogVisible: isMiniCalendarVisible,
		setIsDialogVisible: setIsMiniCalendarVisible,
		stylePosition: 'absolute' as const,
	}

	const dateFormats = {
		yearFormat: 'YYYY', 
		monthFormat: 'M', 
		dayFormat: 'D',
	}

	const dateRangeSwitcher = () => {
		const dateObj = dayjsObj({ ...selectedDate });
		switch (calendarType) {
			case 'day':
				return {
					goPrev: () => setSelectedDate(getDateValues(dateObj.subtract(1, 'day'), dateFormats)),
					goNext: () => setSelectedDate(getDateValues(dateObj.add(1, 'day'), dateFormats)),
				};
			case 'week':
				return {
					goPrev: () => setSelectedDate(getDateValues(dateObj.subtract(7, 'day'), dateFormats)),
					goNext: () => setSelectedDate(getDateValues(dateObj.add(7, 'day'), dateFormats)),
				};
			case 'fourDays':
				return {
					goPrev: () => setSelectedDate(getDateValues(dateObj.subtract(4, 'day'), dateFormats)),
					goNext: () => setSelectedDate(getDateValues(dateObj.add(4, 'day'), dateFormats)),
				};
			default:
				return {
					goPrev: () => setSelectedDate(getDateValues(dateObj.subtract(1, 'month'), dateFormats)),
					goNext: () => setSelectedDate(getDateValues(dateObj.add(1, 'month'), dateFormats)),
				};
		}
	}

	const displayRelevantDate = () => {
		const dateObj = dayjsObj(selectedDate);
		let day = '';
		let month = dateObj.format('MMMM');
		const year = dateObj.format('YYYY');
		if (calendarType === 'day') {
			day = dateObj.format('DD') + ','
		} else if (calendarType === 'week') {
			const firstDayOfTheWeek = dateObj.day(0);
			const lastDayOfTheWeek = dateObj.day(6);

			// check whether both days falls under the same month
			firstDayOfTheWeek.format('M') === lastDayOfTheWeek.format('M')
				? month = dateObj.format('MMMM')
				: month = `${firstDayOfTheWeek.format('MMMM')} - ${lastDayOfTheWeek.format('MMMM')}`;
		} else if (calendarType === 'fourDays') {
			const firstDay = dateObj.add(0, 'day');
			const lastDay = dateObj.add(3, 'day');

			// check whether both days falls under the same month
			firstDay.format('M') === lastDay.format('M')
				? month = dateObj.format('MMMM')
				: month = `${firstDay.format('MMMM')} - ${lastDay.format('MMMM')}`;
		}
		return `${month} ${day} ${year}`;
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
						<div>
							{
								visibilities.sidebar
									? <h6 className='header-text'>{displayRelevantDate()}</h6>
									: <button
										ref={linkRef}
										className='clear-btn--no-effects row align-xs'
										onClick={() => setIsMiniCalendarVisible(visible => !visible)}
									>
										<h6 className='header-text'>{displayRelevantDate()}</h6>
										<img className='icon--small' src={SortDown} />
									</button>
							}
							<Dialog ref={miniCalendarRef} {...miniCalendarProps} />
						</div>
					</div>
				</div>
				<CalendarTypeOptions />
			</div>
		</div>
	)
}