import {
	useEffect,
	useState,
} from 'react';

import { getHolidayEvents } from './api/holiday';

import './styles/main.scss';
import './styles/flexbox.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import withScheduleDialogToggle from './components/Schedules/ScheduleHOC';
import { MiniScheduleButton } from './components/Schedules/Buttons';
import DialogController from './components/Schedules/DialogController';
import { useAppConfig } from './context/AppConfigContext';
// import { useStoreUpdater } from './context/StoreContext';
// import { UserAction } from './context/StoreContext/index.model';
// import { uniqueID } from './util/reusable-funcs';
// import { getColorOption } from './util/color-options';
// import { CalendarType } from './context/StoreContext/types/calendar';
import SettingsPanel from './components/SettingsPanel/index';

const CreateSchedule = withScheduleDialogToggle(MiniScheduleButton);

function Loading(): JSX.Element {
	return <p className='loading-txt'>fetching api data...</p>
}

function MainContent(): JSX.Element | undefined {
	const { visibilities } = useAppConfig();
	// const { dispatchCalendars } = useStoreUpdater();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getHolidayEvents()
			.then(data => {
				console.log(data);
				// const holidayCalendar = {
				// 	id: uniqueID(),
				// 	name: data.summary,
				// 	selected: true,
				// 	removable: true,
				// 	description: data.description,
				// 	colorOption: getColorOption('citron'),
				// 	timeZone: data.timeZone,
				// 	events: data.items,
				// 	type: 'holiday' as CalendarType,
				// }

				// dispatchCalendars({
				// 	type: UserAction.ADD,
				// 	payload: holidayCalendar,
				// });
				setLoading(false);
			})
			.catch(error => {
				throw error;
			})
	}, [])


	if (!loading) {
		return (
			<>
				<Header />
				<main className='main'>
					{
						visibilities.sidebar
							? <Sidebar />
							: <CreateSchedule />
					}
					<Calendar />
					<DialogController />
				</main>
			</>
		)
	} else {
		return <Loading />
	}
}

function App(): JSX.Element {
	const { visibilities } = useAppConfig();

	return (
		<div className='app'>
			{
				visibilities.settings
					? <SettingsPanel />
					: <MainContent />
				}
		</div>
	);
}

export default App;
