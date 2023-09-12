import './styles/main.scss';
import './styles/flexbox.css';

import SettingsPanel from './components/SettingsPanel/index';
import MainContent from './components/MainContent/index';

import { useAppConfig } from './contexts/AppConfigContext';
import { useEffect, useState } from 'react';
import { useStore } from './contexts/StoreContext';

function App(): JSX.Element {
	const { visibilities } = useAppConfig();
	const { status } = useStore();
	const [isInitialLoad, setIsInitialLoad]
		= useState<boolean>(true);

	useEffect(() => {
		const {
			isExternalEventsInitialized,
			isFetchedDataInitialized,
		} = status;

		// If required dataset is initialized then unmount initial loading component
		const storeIsReady = isExternalEventsInitialized && isFetchedDataInitialized;
		const storeIsInResetMode = !isExternalEventsInitialized && !isFetchedDataInitialized;
		if (storeIsReady && isInitialLoad) {
			setIsInitialLoad(false);
		}
		if (storeIsInResetMode && !isInitialLoad) {
			setIsInitialLoad(true);
		}
	}, [status])

	return (
		<div className='app'>
			{
				visibilities.settings
					? <SettingsPanel />
					: <MainContent isInitialLoad={isInitialLoad} />
			}
		</div>
	);
}

export default App;
