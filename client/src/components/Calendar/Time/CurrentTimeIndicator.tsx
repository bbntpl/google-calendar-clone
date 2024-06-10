import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';

import './styles.scss';

type CurrentTimeIndicatorProps = {
	parentHeight: number;
	date: dayjs.Dayjs
}

export function CurrentTimeIndicator({ parentHeight, date }: CurrentTimeIndicatorProps) {
	const intervalRef = useRef<number | null>(null);

	const MINUTE_IN_MS = 60 * 1000;
	const hourHeight = parentHeight / 24;

	const computePosition = () => {
		const now = dayjs();
		const currentHour = now.hour();
		const currentMinute = now.minute();
		return (currentHour + currentMinute / 60) * hourHeight;
	};

	const [topPosition, setTopPosition] = useState(computePosition());



	useEffect(() => {
		// Compute the position of indicator every minute in real-time
		const refreshIndicatorPos = () => {
			const now = dayjs();
			const isMidnight = now.hour() === 0 && now.minute() === 0;
			if (isMidnight) {
				setTopPosition(0);
			} else {
				setTopPosition(computePosition());
			}

			intervalRef.current = window.setTimeout(refreshIndicatorPos, MINUTE_IN_MS);
		};

		refreshIndicatorPos();

		return () => {
			if (intervalRef.current !== null) {
				clearTimeout(intervalRef.current);
			}
		};
	}, []);

	// Hide the time indicator if the date is not "today"
	if (date.format('YYYY-MM-DD') !== dayjs().format('YYYY-MM-DD')) {
		return null;
	}

	return (
		<div className='current-time-indicator' style={{ top: `${topPosition}px` }} />
	);
}