# ![Node.js / Express / Typescript / MySql / Knex Example App](./.github/images/logo.png)

[![Actions Status](https://github.com/kenyipp/realworld-nodejs-example-app/workflows/CI/badge.svg)](https://github.com/kenyipp/realworld-nodejs-example-app/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/kenyipp/realworld-nodejs-example-app/branch/master/graph/badge.svg?token=AMBNXM57T8)](https://codecov.io/gh/kenyipp/realworld-nodejs-example-app)

> ### Example Node (Express + MySql) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.

This repository has complete functionality — pull requests and issues are welcome!

## Get Started
This project utilizes [PNPM](https://pnpm.io) as its package manager. Kindly ensure that you have installed PNPM before commencing work on this project.

### Local Development

To install all dependencies and launch the development server, execute the following commands:

```sh
pnpm install
pnpm run dev
```

Afterward, navigate to [http://localhost:3100/api/health-check](http://localhost:3100/api/health-check) to verify if the server is operating correctly.

To initialize the database in a non-production environment, you can use the POST API at [http://localhost:3100/api/reset](http://localhost:3100/api/reset), which quickly resets the database.

## Contributing

Please review the existing issues in this repository for areas that require improvement.
If you identify any missing or potential areas for improvement, feel free to open a new issue for them.

### Before commit

Before deploying and integrating the application, it is necessary to perform a series of validations such as testing, linting, and formatting. We recommend running `make pre-commit` before making each commit to ensure compliance.

## License
This project is licensed under the MIT License - see the [MIT](LICENSE) file for details.
