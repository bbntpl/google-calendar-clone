import { useContext } from 'react';
import GlobalContext from './context/global/GlobalContext';
import GlobalContextInterface from './context/global/index.model';

import './styles/main.scss';
import './styles/flexbox.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import withScheduleDialogToggle from './components/Schedules/ScheduleHOC';
import { MiniScheduleButton } from './components/Schedules/Buttons';
import DialogController from './components/Schedules/DialogController';

const CreateSchedule = withScheduleDialogToggle(MiniScheduleButton);

function App(): JSX.Element {
	const {
		visibilities,
	} = useContext(GlobalContext) as GlobalContextInterface;

	return (
		<div className='app'>
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
		</div>
	);
}

export default App;
