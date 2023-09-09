import { useState, useEffect } from 'react';

import { Calendar, CalendarType } from '../../contexts/StoreContext/types/calendar';
import { useAppConfigUpdater } from '../../contexts/AppConfigContext';
import { useStore, useStoreUpdater } from '../../contexts/StoreContext';
import { UserAction } from '../../contexts/StoreContext/index.model';
import { Schedule } from '../../contexts/StoreContext/types/schedule';

import NewCalendar from './NewCalendar';
import CalendarItemList from './CalendarItemList';

import './styles.scss';
import ChevronBottom from '../../assets/icons/chevron-bottom.png';
import ChevronUp from '../../assets/icons/chevron-up.png';
import PlusIcon from '../../assets/icons/plus.png';

import { getColorOption } from '../../util/color-options';
import { uniqueID } from '../../util/reusable-funcs';

interface CalendarListProps {
	type: CalendarType
	calendars: Array<Calendar>
	limit?: number
	title?: string
}

export default function CalendarList({
	title = 'My Calendars',
	type,
	calendars,
	limit = 10,
}: CalendarListProps): JSX.Element {
	const { recordPosition } = useAppConfigUpdater();
	const { savedSchedules } = useStore();
	const { dispatchCalendars } = useStoreUpdater();

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [showAddLblBtn, setShowAddLblBtn] = useState(false);

	const handleToggleAccordion = () => setIsCollapsed(isCollapsed => !isCollapsed);
	const handleToggleInput = (e: { stopPropagation: () => void; }) => {
		e.stopPropagation();
		setShowAddLblBtn(toggle => !toggle);
	}

	// Add/remove calendars depending on existence of a schedule by type
	useEffect(() => {
		const areThereTasks = savedSchedules.some((schedule: Schedule) => {
			return schedule.type === 'task';
		});

		const areThereEvents = savedSchedules.some((schedule: Schedule) => {
			return schedule.type === 'event';
		});

		const taskCalendar = calendars.filter((calendar) => calendar.name === 'Tasks');
		const evtCalendar = calendars.filter((calendar) => calendar.name === 'Events');

		type InitialCalendarLabelProps = Omit<Calendar, 'name'>;
		const calendarItemProps: InitialCalendarLabelProps = {
			id: uniqueID(),
			colorOption: getColorOption(),
			removable: false,
			selected: false,
			type,
		};
		if (!areThereTasks && taskCalendar.length) {
			dispatchCalendars({
				type: UserAction.REMOVE,
				payload: { id: taskCalendar[0].id },
			});
		} else if (!areThereEvents && evtCalendar.length) {
			dispatchCalendars({
				type: UserAction.REMOVE,
				payload: { id: evtCalendar[0].id },
			});
		} else if (areThereTasks && !taskCalendar) {
			dispatchCalendars({
				type: UserAction.ADD,
				payload: Object.assign({}, calendarItemProps, { name: 'Tasks' }),
			});
		} else if (areThereEvents && !evtCalendar) {
			dispatchCalendars({
				type: UserAction.ADD,
				payload: Object.assign({}, calendarItemProps, { name: 'Events' }),
			});
		}
	}, [calendars, savedSchedules]);

	return (
		<div className='accordion-container'>
			<div className='accordion col'>
				<div
					className='accordion__toggler row middle-xs'
					onClick={() => {
						setShowAddLblBtn(false);
						handleToggleAccordion();
					}}>
					<h5 className='row'>{`${title} ${calendars.length}/${limit}`}</h5>

					<span className='row end-xs middle-xs'>
						{
							type === 'default' ?
							<button
								className='clear-btn--no-effects'
								onClick={handleToggleInput}
							>
								<img className='icon--medium' src={PlusIcon} />
							</button>
							: null
						}
						<img src={isCollapsed ? ChevronUp : ChevronBottom} />
					</span>
				</div>
				<ul className={`accordion__panel ${isCollapsed ? 'show' : 'hide'}`}>
					<CalendarItemList
						calendars={calendars}
						dispatchCalendars={dispatchCalendars}
						recordPosition={recordPosition}
					/>
					{
						showAddLblBtn
							? <NewCalendar
								setShowAddLblBtn={setShowAddLblBtn}
								dispatchCalendars={dispatchCalendars}
								recordPosition={recordPosition}
							/> : null
					}
				</ul>
			</div>
		</div>
	)
}