import { useEffect, useRef } from 'react';

import {
	dayjsObj,
	getScheduleTimeOptions,
	getShortDate,
} from '../../../util/calendar-arrangement';
import { convertStringToDateUnits } from '../../../util/calendar-arrangement';
import useComponentVisible from '../../../hooks/useComponentVisible';

import ClockIcon from '../../../assets/icons/clock.png';
import SortDownIcon from '../../../assets/icons/sort-down.png';

import MiniCalendar from '../../MiniCalendar';
import Dialog from '../../../lib/Dialog';
import CustomSelect from './CustomInputs/CustomSelect';

import { Option } from '../index.model';
import { DateTimeInputs, DateUnits } from '../../../context/CalendarConfigContext/index.model';
import { useCalendarConfig } from '../../../context/CalendarConfigContext';

export interface DateTimeBlockProps {
	dateTime: DateTimeInputs;
	handleDateChange: (selectedDate: DateUnits) => void;
	handleTimeChange: (option: Option | null, propName: string) => void;
}

export default function DateTimeBlock(props: DateTimeBlockProps) {
	const {
		dateTime,
		handleDateChange,
		handleTimeChange,
	} = props;
	const {
		selectedDate,
		selectedScheduleType,
	} = useCalendarConfig();
	const { start, end } = dateTime.time;
	const scheduleTimeOptions = getScheduleTimeOptions();

	const [
		miniCalendarRef,
		isMiniCalendarVisible,
		setIsMiniCalendarVisible,
		linkRef,
	] = useComponentVisible();

	// The purpose of this is to prevent date change after its first
	// execution so that existing schedule date won't overwritten
	// by the highlighted date
const dateChangeNotAllowed = useRef(true);
	useEffect(() => {
		if (dateChangeNotAllowed.current) {
			dateChangeNotAllowed.current = false
		} else {
			handleDateChange(selectedDate);
		}
	}, [selectedDate])

	const miniCalendarProps = {
		Component: MiniCalendar,
		componentProps: {
			initialDate: convertStringToDateUnits(dateTime.date),
		},
		positionOffset: { x: 0, y: 30 },
		isDraggable: false,
		isDialogVisible: isMiniCalendarVisible,
		setIsDialogVisible: setIsMiniCalendarVisible,
		stylePosition: 'absolute' as const,
	}

	const dateToDisplay = () => {
		const dateToDisplay = convertStringToDateUnits(dateTime.date) || selectedDate;
		return getShortDate(dayjsObj(dateToDisplay));
	}

	const options = scheduleTimeOptions.map(({ time }, hourIndex) => {
		return { label: time, value: hourIndex };
	});

	const selectHoursEl = (option: Option, propName: string) => {
		return <CustomSelect
			value={option}
			onChange={(e) => handleTimeChange(e, propName)}
			options={options}
			isSearchable={true}
			styles={{
				control: (styles) => ({
					...styles,
					maxWidth: '120px',
				}),
				option: (styles) => ({
					...styles,
					maxWidth: '120px',
				}),
			}}
		/>
	}
	return (
		<>
			<div className='schedule-input-list flex-centered'>
				<span>
					<img src={ClockIcon} />
				</span>
				<span className='schedule-input__date-time'>
					<div
						className='clear-btn--no-border'
						onClick={() => setIsMiniCalendarVisible(visible => !visible)} >
						<span ref={linkRef}>
							{dateToDisplay()}
						</span>
						<img
							src={SortDownIcon}
							style={{ width: '10px', height: '10px' }}
						/>
					</div>
					<div style={{ display: 'flex', gap: '.5rem' }}>
						{
							(start >= 0 && end >= 0 && selectedScheduleType === 'event')
							&& selectHoursEl(options[start], 'start')
						}
						{
							(start >= 0 && end >= 0) && selectHoursEl(options[end], 'end')
						}
					</div>
					<Dialog ref={miniCalendarRef} {...miniCalendarProps} />
				</span>
			</div >
		</>
	)
}