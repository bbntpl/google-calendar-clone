import { Suspense, useContext } from 'react';

import GlobalContext from './context/global/GlobalContext';
import { getHolidayEvents } from './api/holiday';

import './styles/main.scss';
import './styles/flexbox.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import withScheduleDialogToggle from './components/Schedules/ScheduleHOC';
import { MiniScheduleButton } from './components/Schedules/Buttons';
import DialogController from './components/Schedules/DialogController';
import GlobalContextInterface from './context/global/index.model';

const CreateSchedule = withScheduleDialogToggle(MiniScheduleButton);

function Loading(): JSX.Element {
	return <p>fetching api data...</p>
}

function MainContent(): JSX.Element {
	const {
		visibilities,
		setOtherCalendarList,
	} = useContext(GlobalContext) as GlobalContextInterface;


	getHolidayEvents()
		.then(data => {
			const holidayCalendar = {
				name: data.summary,
				description: data.description,
				timeZone: data.timeZone,
				events: data.items,
			}

			setOtherCalendarList([
				holidayCalendar,
			]);
		})
		.catch(error => {
			throw error;
		})


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
}

function App(): JSX.Element {
	return (
		<div className='app'>
			<Suspense fallback={<Loading />}>
				<MainContent />
			</Suspense>
		</div>
	);
}

export default App;
