import '../styles.scss';

export default function TimeLabel({ time }: { time: string }) {
	return <h6 className='calendar-time__label'>{time}</h6>
}