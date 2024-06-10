export interface ExecuteActionProps<S, A> {
	state: S[] | []
	action: A
	propKey: string
}

export interface ExecuteActionHandlerProps<S, A> extends ExecuteActionProps<S, A> {
	authenticatedUserId: string | undefined;
}