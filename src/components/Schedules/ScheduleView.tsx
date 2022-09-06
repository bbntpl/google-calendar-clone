import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface, {
	ScheduleTypes,
	UserActionType,
} from '../../context/global/index.model';
import useComponentVisible from '../../hooks/useComponentVisible';

import './styles.scss';
import ClockIcon from '../../assets/icons/clock.png';
import DeleteIcon from '../../assets/icons/trash.png';
import DescIcon from '../../assets/icons/desc.png';
import EditIcon from '../../assets/icons/edit.png';
import LocationIcon from '../../assets/icons/location.png';

import Alert from '../../lib/Alert/Alert';
import { truncateString } from '../../util/reusable-funcs';

interface ScheduleViewProps {
	scheduleProps: ScheduleTypes;
	setIsDialogVisible: Dispatch<SetStateAction<boolean>>;
}

export function ScheduleView(props: ScheduleViewProps) {
	const { scheduleProps, setIsDialogVisible } = props;
	const {
		calendarId,
		description,
		id,
		title,
		type,
		...rest
	} = scheduleProps;
	const {
		calendarList,
		selectedSchedule,
		setSelectedSchedule,
		dispatchSchedules,
		setIsScheduleDialogVisible,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const [alertRef, isAlertVisible, setIsAlertVisible] = useComponentVisible(false);

	const associateCalendar = calendarList.find(cal => cal.id === calendarId);

	useEffect(() => {
		// set the received schedule props as a selected schedule
		setSelectedSchedule((sch: ScheduleTypes | null | undefined) => {
			if (sch === null) {
				return scheduleProps;
			} else ({
				...sch, ...scheduleProps,
			})
		});

		// selected schedule becomes null after the component unmounts
		return () => {
			setSelectedSchedule(null);
		}
	}, []);

	const editSchedule = () => {
		setIsDialogVisible(visible => !visible);
		setIsScheduleDialogVisible(visible => !visible);
	}

	const deleteSchedule = () => {
		dispatchSchedules({
			type: UserActionType.REMOVE,
			payload: id,
		})
		setIsDialogVisible(visible => !visible);
	}

	return (<>
		<div className='calendar-schedule__view'>
			<div className='schedule-view-block'>
				<div className='schedule-input-list'>
					<span>
						<div style={{
							borderRadius: '3px',
							backgroundColor: associateCalendar?.colorOption.value,
							width: '22px',
							height: '22px',
						}} />
					</span>
					<div>{title}</div>
				</div>
				{
					('dateTime' in rest &&
						(rest.dateTime.time.start && rest.dateTime.time.end))
					&& <div className='schedule-input-list'>
						<span>
							<img src={ClockIcon} />
						</span>
						<div>{rest.dateTime.date}</div>
					</div>
				}
				{
					'location' in rest &&
					<div className='schedule-input-list'>
						<span>
							<img src={LocationIcon} />
						</span>
						<div>{rest.location}</div>
					</div>
				}
				{
					description &&
					<div className='schedule-input-list'>
						<span>
							<img src={DescIcon} />
						</span>
						<div>{description}</div>
					</div>
				}
			</div>
			<div className='schedule-btn-list'>
				<button onClick={editSchedule}>
					<img src={EditIcon} />
				</button>
				<button
					onClick={() => setIsAlertVisible(visible => !visible)}
				>
					<img src={DeleteIcon} />
				</button>
			</div>
		</div>
		<Alert
			ref={alertRef}
			name={`${truncateString(title, 30)}`}
			action={'delete'}
			type={type}
			handleAction={deleteSchedule}
			handleHideComponent={() => setIsAlertVisible(false)}
			isVisible={isAlertVisible}
		/>
	</>
	)
}