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
import Modal from '../../lib/modal';
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
	] = useComponentVisible(false);

	const miniCalendarProps = {
		componentProps: {},
		Component: MiniCalendar,
		defaultPosition: { x: 0, y: 40 },
		draggable: false,
		isModalVisible: isMiniCalendarVisible,
		setIsModalVisible: setIsMiniCalendarVisible,
		stylePosition: 'absolute' as const,
	}

	const dateRangeSwitcher = () => {
		const dateObj = dayjsObj({ ...selectedDate });
		switch (calendarType) {
			case 'day':
				return {
					chevronLeftHandler: () => setSelectedDate(getDateValues(dateObj.subtract(1, 'day'))),
					chevronRightHandler: () => setSelectedDate(getDateValues(dateObj.add(1, 'day'))),
				};
			case 'week':
				return {
					chevronLeftHandler: () => setSelectedDate(getDateValues(dateObj.subtract(7, 'day'))),
					chevronRightHandler: () => setSelectedDate(getDateValues(dateObj.add(7, 'day'))),
				};
			case 'fourDays':
				return {
					chevronLeftHandler: () => setSelectedDate(getDateValues(dateObj.subtract(4, 'day'))),
					chevronRightHandler: () => setSelectedDate(getDateValues(dateObj.add(4, 'day'))),
				};
			default:
				return {
					chevronLeftHandler: () => setSelectedDate(getDateValues(dateObj.subtract(1, 'month'))),
					chevronRightHandler: () => setSelectedDate(getDateValues(dateObj.add(1, 'month'))),
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
						<>
							{
								visibilities.sidebar
									? <h6 className='header-text'>{displayRelevantDate()}</h6>
									: <button
										className='clear-btn--no-effects row align-xs'
										onClick={() => setIsMiniCalendarVisible(visible => !visible)}
									>
										<h6 className='header-text'>{displayRelevantDate()}</h6>
										<img className='icon--small' src={SortDown} />
									</button>
							}
							<Modal ref={miniCalendarRef} {...miniCalendarProps} />
						</>
					</div>
				</div>
				<CalendarTypeOptions />
			</div>
		</div>
	)
}