import { type DbDtoUser } from "@conduit/core/database/dto";

declare global {
	namespace Express {
		interface Request {
			user?: DbDtoUser
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { };
