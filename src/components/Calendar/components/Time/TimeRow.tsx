import React from 'react';
import './styles.scss';
import { useContext } from 'react';
import GlobalContext from '../../../../context/global/GlobalContext';
import GlobalContextInterface, { SelectedDate } from '../../../../context/global/index.model';
import { stringifiedDate } from '../../../../util/calendar-arrangement';

interface TimeRowProps {
	dayIndex: number,
	time?: string,
	hourIndex?: number,
	dateValues: SelectedDate
}

export default function TimeRow(props: TimeRowProps) {
	const { time, hourIndex = -1, dayIndex, dateValues } = props;
	const {
		setIsScheduleDialogVisible,
		setDefaultDateTime,
	} = useContext(GlobalContext) as GlobalContextInterface;

	return (
		<div className='calendar__time-row'>
			{
				!dayIndex && <div className='calendar__block-side' />
			}
			<div
				className='calendar__block'
				onClick={() => {
					setDefaultDateTime({
						date: stringifiedDate(dateValues),
						time: { 
							start: hourIndex, 
							end: (hourIndex + 1),
						 },
					});
					setIsScheduleDialogVisible(true);
				}}
			>
			</div>
		</div>
	)
}