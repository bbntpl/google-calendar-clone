import React, { useContext } from 'react';
import { DateTimeInputsProps, ScheduleStates } from '../index.model';
import {
	stringifiedDateToObj,
	dayjsObj,
	getScheduleTimeOptions, getShortDate,
} from '../../../util/calendar-arrangement';

import ClockIcon from '../../../assets/icons/clock.png';
import SortDownIcon from '../../../assets/icons/sort-down.png';
import useComponentVisible from '../../../hooks/useComponentVisible';
import MiniCalendar from '../../MiniCalendar';
import Dialog from '../../../lib/Dialog';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../context/global/index.model';
import { stringifyDate } from '../../../util/calendar-arrangement';

export default function DateTimeInputs(props: DateTimeInputsProps) {
	const { dateTime, setScheduleProps } = props;
	const { selectedDate } = useContext(GlobalContext) as GlobalContextInterface;
	const { start, end } = dateTime.time;
	const timeOptions = getScheduleTimeOptions();

	const [
		miniCalendarRef,
		isMiniCalendarVisible,
		setIsMiniCalendarVisible,
	] = useComponentVisible(false);

	const miniCalendarProps = {
		componentProps: {},
		Component: MiniCalendar,
		positionOffset: { x: 0, y: 10 },
		isDraggable: false,
		isDialogVisible: isMiniCalendarVisible,
		setIsDialogVisible: setIsMiniCalendarVisible,
		stylePosition: 'absolute' as const,
	}

	const dateToDisplay = () => {
		const dateByValues = stringifiedDateToObj(stringifyDate(selectedDate));
		console.log(selectedDate);
		const date = getShortDate(dayjsObj(selectedDate));
		return date;
	}
	const selectHoursEl = (index: number, propName: string) => {
		const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
			const value = event.target.value;

			// update time prop values on change
			setScheduleProps((scheduleProps: ScheduleStates) => ({
				...scheduleProps,
				dateTime: {
					...scheduleProps.dateTime,
					time: {
						...scheduleProps.dateTime.time,
						[propName]: value,
					},
				},
			}));
		};
		return (
			<select value={index} onChange={selectChange}>
				{
					timeOptions.map(({ time }, hourIndex) => {
						return <option value={hourIndex} key={`hour-${hourIndex}`}>{time}</option>
					})
				}
			</select>
		)
	}

	return (
		<>
			<div className='schedule-input-list flex-centered'>
				<span>
					<img src={ClockIcon} />
				</span>
				<span className='input-division'>
					<div
						className='clear-btn'
						onClick={() => setIsMiniCalendarVisible(visible => !visible)} >
						<span>
							{dateToDisplay()}
						</span>
						<img
							src={SortDownIcon}
							style={{ width: '10px', height: '10px' }}
						/>
					</div>
					<div>
						{selectHoursEl(start, 'start')}
						{selectHoursEl(end, 'end')}
					</div>
					<Dialog ref={miniCalendarRef} {...miniCalendarProps} />
				</span>
			</div >
		</>
	)
}