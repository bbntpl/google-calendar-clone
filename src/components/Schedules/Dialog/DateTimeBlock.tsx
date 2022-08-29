import { useContext } from 'react';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface, {
	DateTimeInputs,
} from '../../../context/global/index.model';
import {
	dayjsObj,
	getScheduleTimeOptions,
	getShortDate,
} from '../../../util/calendar-arrangement';
import useComponentVisible from '../../../hooks/useComponentVisible';

import ClockIcon from '../../../assets/icons/clock.png';
import SortDownIcon from '../../../assets/icons/sort-down.png';

import MiniCalendar from '../../MiniCalendar';
import Dialog from '../../../lib/Dialog';
import CustomSelect from './CustomInputs/CustomSelect';
import { Option } from '../index.model';

export interface DateTimeBlockProps {
	dateTime: DateTimeInputs;
	handleChange: (option: Option | null, propName: string) => void;
}

export default function DateTimeBlock(props: DateTimeBlockProps) {
	const { dateTime, handleChange } = props;
	const {
		selectedDate,
		selectedScheduleType,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const { start, end } = dateTime.time;
	const scheduleTimeOptions = getScheduleTimeOptions();

	const [
		miniCalendarRef,
		isMiniCalendarVisible,
		setIsMiniCalendarVisible,
		linkRef,
	] = useComponentVisible(false);

	const miniCalendarProps = {
		componentProps: {},
		Component: MiniCalendar,
		positionOffset: { x: 0, y: 30 },
		isDraggable: false,
		isDialogVisible: isMiniCalendarVisible,
		setIsDialogVisible: setIsMiniCalendarVisible,
		stylePosition: 'absolute' as const,
	}

	const dateToDisplay = () => {
		return getShortDate(dayjsObj(selectedDate));
	}

	const options = scheduleTimeOptions.map(({ time }, hourIndex) => {
		return { label: time, value: hourIndex };
	});

	const selectHoursEl = (option: Option, propName: string) => {
		return <CustomSelect
			value={option}
			onChange={(e) => handleChange(e, propName)}
			options={options}
			isSearchable={true}
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
							(start >= 0 && selectedScheduleType === 'event')
							&& selectHoursEl(options[start], 'start')
						}
						{
							(start >= 0 && selectedScheduleType === 'task')
							&& selectHoursEl(options[end], 'end')
						}
					</div>
					<Dialog ref={miniCalendarRef} {...miniCalendarProps} />
				</span>
			</div >
		</>
	)
}