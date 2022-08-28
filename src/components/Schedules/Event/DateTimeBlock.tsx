import { useContext } from 'react';
import { DateTimeBlockProps, ScheduleStates } from '../index.model';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../context/global/index.model';
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
import CustomSelect from '../Dialog/CustomInputs/CustomSelect';

interface TimeOption {
	label: string;
	id: number;
}

export default function DateTimeBlock(props: DateTimeBlockProps) {
	const { dateTime, setScheduleProps } = props;
	const { selectedDate } = useContext(GlobalContext) as GlobalContextInterface;
	const { start, end } = dateTime.time;
	const timeOptions = getScheduleTimeOptions();

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

	const options = timeOptions.map(({ time }, hourIndex) => {
		return { label: time, id: hourIndex };
	});

	const selectHoursEl = (option: TimeOption, propName: string) => {
		const handleChange = (option: TimeOption | null) => {
			if (option) {
				const { id } = option;
				// update time prop values on change
				setScheduleProps((scheduleProps: ScheduleStates) => ({
					...scheduleProps,
					dateTime: {
						...scheduleProps.dateTime,
						time: {
							...scheduleProps.dateTime.time,
							[propName]: id,
						},
					},
				}));
			}

		};
		return <CustomSelect
			value={option}
			onChange={handleChange}
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
					<div style={{ display: 'flex', gap: '.5rem'}}>
						{selectHoursEl(options[start], 'start')}
						{selectHoursEl(options[end], 'end')}
					</div>
					<Dialog ref={miniCalendarRef} {...miniCalendarProps} />
				</span>
			</div >
		</>
	)
}