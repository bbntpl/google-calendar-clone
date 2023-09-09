import './styles/main.scss';
import './styles/flexbox.css';

import SettingsPanel from './components/SettingsPanel/index';
import MainContent from './components/MainContent/index';

import { useAppConfig } from './contexts/AppConfigContext';
import { useState } from 'react';

function App(): JSX.Element {
	const { visibilities } = useAppConfig();
	const [isInitialDataFetched, setIsInitialDataFetched]
		= useState<boolean>(false);

	const toggleIsDataFetched = () => {
		setIsInitialDataFetched(prevState => !prevState);
	}	
	
	return (
		<div className='app'>
			{
				visibilities.settings
					? <SettingsPanel />
					: <MainContent
						isInitialDataFetched={isInitialDataFetched}
						toggleIsDataFetched={toggleIsDataFetched}
					/>
			}
		</div>
	);
}

export default App;
