import md5 from "md5";
import jsonwebtoken from "jsonwebtoken";
import { v4 as Uuid } from "uuid";
import { appConfig } from "@conduit/config";
import { type DbDtoUser } from "@conduit/core/database/dto";
import { pick } from "lodash";

const signature = appConfig.server.appSignature;

export const signJsonWebToken = ({ dbDtoUser }: SignJsonWebTokenInput): SignJsonWebTokenOutput => {
	const hash = hashDbDtoUser({ dbDtoUser });
	const accessToken = jsonwebtoken.sign(
		{
			userId: dbDtoUser.id,
			hash
		},
		signature,
		{
			issuer: "Conduit",
			expiresIn: appConfig.server.tokenExpiresIn,
			jwtid: Uuid()
		}
	);
	return { accessToken };
};

export const verifyJsonWebToken = ({ accessToken }: VerifyJsonWebTokenInput): VerifyJsonWebTokenOutput => {
	const decoded = jsonwebtoken.verify(accessToken, signature);
	if (typeof decoded === "object" && decoded.userId && decoded.hash) {
		return {
			userId: decoded.userId,
			hash: decoded.hash
		};
	}
	throw new Error("Invalid encrypted payload");
};

/**
 *
 * Calculates the hash of the specified keys in the user object.
 *
 * @param {object} dbDtoUser - The user object in the database DTO format.
 *
 * @returns {string} - The hash of the selected user keys.
 *
 */
export const hashDbDtoUser = ({ dbDtoUser }: { dbDtoUser: DbDtoUser }): string => {
	const hash = md5(JSON.stringify(pick(dbDtoUser, KEYS_TO_CHECK)));
	return hash;
};

interface SignJsonWebTokenInput {
	dbDtoUser: DbDtoUser;
}

interface SignJsonWebTokenOutput {
	accessToken: string;
}

interface VerifyJsonWebTokenInput {
	accessToken: string;
}

interface VerifyJsonWebTokenOutput {
	userId: string;
	hash: string;
}

// If one of the keys has changed, the JSON Web Token for the user should be expired
const KEYS_TO_CHECK = [
	"id",
	"email",
	"hash"
];
