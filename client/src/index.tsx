import React from 'react';
import ReactDOM from 'react-dom/client';

import FirebaseAuthProvider from './contexts/FirebaseAuthContext';
import StoreProvider from './contexts/StoreContext/index';
import AppConfigProvider from './contexts/AppConfigContext';
import CalendarConfigProvider from './contexts/CalendarConfigContext';

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