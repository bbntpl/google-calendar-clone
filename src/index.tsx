import React from 'react';
import ReactDOM from 'react-dom/client';

import StoreProvider from './context/global/StoreProvider';

import './styles/index.css';

import App from './App';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement,
);

root.render(
	<React.StrictMode>
		<StoreProvider>
			<App />
		</StoreProvider>
	</React.StrictMode>,
);