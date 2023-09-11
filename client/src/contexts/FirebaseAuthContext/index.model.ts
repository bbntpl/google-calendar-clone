import { User as FirebaseUser } from 'firebase/auth';

export type UserState = FirebaseUser | null | 'INITIAL';
export type ContextState = { user: UserState };