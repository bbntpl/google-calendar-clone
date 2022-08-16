import React from 'react';
import './styles.scss';

export default function TimeLabel({ time }: { time: string }) {
	return <h6 className='calendar__time-lbl'>{time}</h6>
}