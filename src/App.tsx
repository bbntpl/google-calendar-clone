import { useContext} from 'react';
import GlobalContext from './context/global/GlobalContext';
import GlobalContextInterface from './context/global/index.model';

import './styles/main.scss';
import './styles/flexbox.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import withScheduleModalToggle from './components/Schedules/components/ScheduleHOC';
import MiniScheduleCreation from './components/Schedules/components/MiniScheduleCreation';
import { GlobalModals } from './components/Modal/index';

const CreateSchedule = withScheduleModalToggle(MiniScheduleCreation);

function App(): JSX.Element {
	const {
		visibilities,
	} = useContext(GlobalContext) as GlobalContextInterface;

	return (
		<div className='App container'>
			<Header />
			<main className='main'>
				{
					visibilities.sidebar
						? <Sidebar />
						: <CreateSchedule />
				}
				<Calendar />
				<GlobalModals />
			</main>
		</div>
	);
}

export default App;
