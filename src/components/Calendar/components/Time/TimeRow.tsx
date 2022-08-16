import React from 'react';
import './styles.scss';
import { useContext } from 'react';
import GlobalContext from '../../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../../context/global/index.model';

interface TimeRowProps {
	dayIndex: number,
	hour: string,
	hourIndex: number,
}

export default function TimeRow(props: TimeRowProps) {
	const { hour, hourIndex, dayIndex } = props;
	const { 
		setIsEvtModalVisible,
		setDefaultDay,
	} = useContext(GlobalContext) as GlobalContextInterface;

	return (
		<div className='calendar__time-row'>
			{
				!dayIndex && <div className='calendar__block-side' />
			}
			<div
				className='calendar__block'
				onClick={() => {
					setDefaultDay
					setIsEvtModalVisible(true);
				}}
			>
			</div>
		</div>
	)
}