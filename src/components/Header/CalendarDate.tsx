import { useContext } from 'react';
import SortDown from '../../assets/icons/sort-down.png';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';
import useComponentVisible from '../../hooks/useComponentVisible';

import MiniCalendar from '../MiniCalendar';
import Dialog from '../../lib/Dialog';
import { dayjsObj } from '../../util/calendar-arrangement';

export function CalendarDate() {
		const {
		calendarType,
		selectedDate,
		visibilities,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const [
		miniCalendarRef,
		isMiniCalendarVisible,
		setIsMiniCalendarVisible,
		linkRef,
	] = useComponentVisible(false);
	
	const miniCalendarProps = {
		Component: MiniCalendar,
		positionOffset: { x: 0, y: 40 },
		isDraggable: false,
		isDialogVisible: isMiniCalendarVisible,
		setIsDialogVisible: setIsMiniCalendarVisible,
		stylePosition: 'absolute' as const,
	}

	// display the date on the header relative to the current type
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
	)
}