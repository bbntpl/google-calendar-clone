import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';

import './styles.scss';

type CurrentTimeIndicatorProps = {
	parentHeight: number;
}

export function CurrentTimeIndicator({ parentHeight }: CurrentTimeIndicatorProps) {
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
		const updateTimeUntilNextDay = () => {
			const now = dayjs();
			const endOfDay = now.endOf('day');
			return endOfDay.diff(now, 'millisecond');
		};

		const refreshIndicatorPos = () => {
			const now = dayjs();
			const isMidnight = now.hour() === 0 && now.minute() === 0;

			if (isMidnight) {
				setTopPosition(0);
			} else {
				setTopPosition(computePosition());
			}

			const nextUpdate = isMidnight ? MINUTE_IN_MS : updateTimeUntilNextDay();
			intervalRef.current = window.setTimeout(refreshIndicatorPos, nextUpdate);
		};

		refreshIndicatorPos();

		return () => {
			if (intervalRef.current !== null) {
				clearTimeout(intervalRef.current);
			}
		};
	}, []);

	return (
		<div className='current-time-indicator' style={{ top: `${topPosition}px` }} />
	);
}