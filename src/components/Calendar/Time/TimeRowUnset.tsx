import React, { useContext } from 'react';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface, {
	DateUnits,
	ScheduleTypes,
} from '../../../context/global/index.model';
import { stringifyDate } from '../../../util/calendar-arrangement';
import useComponentVisible from '../../../hooks/useComponentVisible';

import '../styles.scss';

import Slot from '../Slot/Slot';
import Dialog from '../../../lib/Dialog';

interface SlotListProps {
	dateValues: DateUnits;
	filteredSchedulesByTime: ScheduleTypes[] | [];
}

interface TimeRowProps extends SlotListProps {
	dayIndex: number;
	time?: string;
	hourIndex?: number;
}

function SlotList(props: SlotListProps) {
	const { filteredSchedulesByTime, dateValues } = props;
	return (
		<div className='slot-list'>
			{
				filteredSchedulesByTime.map((schedule, index) => {
					if (index === 0) return;
					return <Slot
						key={`slot-list-item-${index}`}
						stringifiedDate={stringifyDate(dateValues)}
						scheduleProps={schedule}
						scheduleViewPosition='absolute'
					/>
				})}
		</div>
	)
}

export default function TimeRowUnset(props: TimeRowProps) {
	const {
		dayIndex,
		dateValues,
		filteredSchedulesByTime,
	} = props;

	const {
		setSelectedDate,
		setIsScheduleDialogVisible,
		setDefaultDateTime,
		recordPos,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const [
		slotListRef,
		isSlotListVisible,
		setIsSlotListVisible,
		linkRef,
	] = useComponentVisible(false);

	const slotListProps = {
		isDraggable: false,
		componentProps: {
			filteredSchedulesByTime,
			dateValues,
		},
		delta: { x: 0, y: 20 },
		Component: SlotList,
		isDialogVisible: isSlotListVisible,
		setIsDialogVisible: setIsSlotListVisible,
		stylePosition: 'absolute' as const,
	}

	return (
		<div className='calendar-time__row'>
			{
				!dayIndex && <div className='calendar-time__block-side' />
			}
			<div
				className='calendar-time__block'
				onClick={(e) => {
					if (e.target !== e.currentTarget) return;
					recordPos(e);
					setSelectedDate(dateValues);
					setDefaultDateTime({
						date: stringifyDate(dateValues),
						time: { start: -1, end: -1 },
					});
					setIsScheduleDialogVisible(true);
				}}
			>
				{
					filteredSchedulesByTime.map((schedule, index) => {
						if (index !== 0) return;
						return <Slot
							key={`slot-${schedule.id}`}
							stringifiedDate={stringifyDate(dateValues)}
							scheduleProps={schedule}
						/>
					})
				}
				{
					filteredSchedulesByTime.length > 1 &&
					<button
						ref={linkRef}
						className='schedule-tasks-counter'
						onClick={() => setIsSlotListVisible(visible => !visible)}
					>
						{`${filteredSchedulesByTime.length - 1} more tasks`}
					</button>
				}
				<Dialog ref={slotListRef} {...slotListProps} />
			</div>
		</div>
	)
}