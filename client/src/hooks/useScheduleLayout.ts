import { Schedule } from '../contexts/StoreContext/types/schedule';
import { AdjustedSchedule } from '../components/Calendar/Time/TimeRow';


export default function useScheduleLayout() {

	const adjustSlotPositions = (schedules: Schedule[]): AdjustedSchedule[] => {
		// Ascendingly sort schedules by start time then end time
		const sortedSchedules = [...schedules].sort((a, b) => {
			if (a.dateTime.time.start !== b.dateTime.time.start) {
				return a.dateTime.time.start - b.dateTime.time.start;
			}
			return a.dateTime.time.end - b.dateTime.time.end;
		});

		const minVisibility = 50;
		const baseWidth = 98;
		// const overlapReduction = 3;

		const adjustedSchedules: AdjustedSchedule[]
			= sortedSchedules.map(schedule => ({
				...schedule,
				width: baseWidth,
				left: 0,
			}));

		for (let currentIndex = 0; currentIndex < adjustedSchedules.length; currentIndex++) {
			const currentSchedule = adjustedSchedules[currentIndex];
			const overlappingSchedules: AdjustedSchedule[] = [currentSchedule];

			// Compare current schedule with the current schedule to find overlaps.
			for (let comparedIndex = 0; comparedIndex < adjustedSchedules.length; comparedIndex++) {
				const comparedSchedule = adjustedSchedules[comparedIndex];
				const isScheduleNotCurrent = comparedSchedule !== currentSchedule;
				const isComparedScheduleOverlapping =
					comparedSchedule.dateTime.time.start < currentSchedule.dateTime.time.end &&
					comparedSchedule.dateTime.time.end > currentSchedule.dateTime.time.start

				if (isScheduleNotCurrent && isComparedScheduleOverlapping) {
					overlappingSchedules.push(comparedSchedule);
				}
			}

			function computeWidthPercentage() {
				return (baseWidth / overlappingSchedules.length) + (minVisibility / 100);
			}

			function computeLeftPercentage(index: number) {
				return (index * baseWidth / overlappingSchedules.length)
					+ (index * (minVisibility / 100) / 2);
			}

			// Set the computed width and left to be assigned to the slot which
			// representes the schedule
			overlappingSchedules.forEach((schedule, index) => {
				const computedLeftPercentage = computeLeftPercentage(index);
				const computedWidthPercentage = computeWidthPercentage();
				const calculatedWidth = `calc(${baseWidth / 100}% * ${computedWidthPercentage})`;
				const calculatedLeft = `calc(${baseWidth / 100}% * ${computedLeftPercentage})`;

				schedule.width = calculatedWidth;
				schedule.left = calculatedLeft;
			});
		}

		return adjustedSchedules;
	}

	return {
		adjustSlotPositions,
	}
}