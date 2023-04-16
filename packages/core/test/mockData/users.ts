import { faker } from "@faker-js/faker";
import { CreateUserInput } from "../../service/user/implementation";

/**
 *
 * Creates a user input object based on the provided values or generates random values using Faker.js
 *
 * @param {GetCreateUserInput} input - An object containing the user input values.
 * @param {string} input.email - The email address for the user.
 * @param {string} input.username - The username for the user.
 * @param {string} input.password - The password for the user.
 * @param {string} input.image - The URL for the user's profile image.
 * @param {string} input.bio - A brief biography of the user.
 *
 * @returns {CreateUserInput} - A CreateUserInput object containing the provided or generated user input values.
 *
 */
export const getCreateUserInput = ({
	email,
	username,
	password,
	image,
	bio
}: GetCreateUserInput): CreateUserInput => {
	const input: CreateUserInput = {
		email: email ?? faker.internet.email(),
		username: username ?? faker.internet.userName(),
		password: password ?? "abc123",
		image: image ?? faker.image.avatar(),
		bio: bio ?? faker.lorem.paragraph(1)
	};
	return input;
};

export interface GetCreateUserInput {
	email?: string;
	username?: string;
	password?: string,
	image?: string;
	bio?: string;
}
