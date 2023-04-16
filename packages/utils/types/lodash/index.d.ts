declare namespace _ {
	interface LoDashStatic {
		indexToDoc: <T extends object>(docs: T[], key: keyof T) => { [key: string]: T };
	}
}
