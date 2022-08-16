import { createContext } from 'react';
import GlobalContextInterface from './index.model';

const GlobalContext =
	createContext<GlobalContextInterface | null>(null);

export default GlobalContext;