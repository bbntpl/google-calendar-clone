import { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser | null;
export type ContextState = { user: User };