import { ScheduleType } from '../../../contexts/StoreContext/types/schedule';
import ScheduleTypeSelector from './ScheduleTypeSelector';

interface MainContentProps {
	title: string;
	setTitle: (title: string) => void;
	scheduleType: ScheduleType | null;
}

export default function ScheduleMainContent(props: MainContentProps) {
	const { 
		title, 
		setTitle, 
		scheduleType, 
	} = props;
	return (
		<div className='schedule-block'>
			<div className='schedule-input-list'>
				<span></span>
				<div>
					<input
						className='schedule-input__title'
						type='text'
						placeholder='Add a title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
			</div>
			<div className='schedule-input-list'>
				<span></span>
				<div>
					<ScheduleTypeSelector
						scheduleType={scheduleType}
					/>
				</div>
			</div>
		</div>
	)
}