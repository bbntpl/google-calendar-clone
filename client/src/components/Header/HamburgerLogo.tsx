import GoogleCalendar from '../../assets/icons/google-calendar.png';
import Hamburger from '../../assets/icons/hamburger.png';

import { useAppConfigUpdater } from '../../contexts/AppConfigContext';
import { BooleansOnlyObj } from '../../contexts/AppConfigContext/index.model';

export function HamburgerLogo() {
	const { setVisibilities } = useAppConfigUpdater();

	const toggleSidebar = () => {
		setVisibilities((visibilities: BooleansOnlyObj) => ({
			...visibilities, sidebar: !visibilities.sidebar,
		}))
	}

	return (
		<div className='max-content row middle-xs'>
			<button onClick={toggleSidebar} className='clear-btn'>
				<img src={Hamburger} />
			</button>
			<div className='logo row center-xs middle-xs'>
				<div className='logo__width'>
					<img className='logo-img' src={GoogleCalendar} />
				</div>
				<div className='logo__text'>Calendar</div>
			</div>
		</div>
	)
}