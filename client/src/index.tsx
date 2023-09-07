import React from 'react';
import ReactDOM from 'react-dom/client';

import FirebaseAuthProvider from './context/FirebaseAuthContext';
import StoreProvider from './context/StoreContext/index';
import AppConfigProvider from './context/AppConfigContext';
import CalendarConfigProvider from './context/CalendarConfigContext';

import './styles/index.css';

import App from './App';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement,
);

root.render(
	// <React.StrictMode>
		<FirebaseAuthProvider>
			<AppConfigProvider>
				<CalendarConfigProvider>
					<StoreProvider>
						<App />
					</StoreProvider>,
				</CalendarConfigProvider>
			</AppConfigProvider>
		</FirebaseAuthProvider>,
	// </React.StrictMode>,
);