import Header from './Header';

import './styles.scss';
import SettingsHub from './SettingsHub';

export default function SettingsPanel() {
	return (
		<div className='settings-panel'>
			<Header />
			<SettingsHub />
		</div>
	)
}