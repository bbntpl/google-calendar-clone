import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';

import App from './App';
import StoreProvider from './context/global/StoreProvider';

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