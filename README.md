# ![Node.js / Express / Typescript / MySql / Knex Example App](./.github/images/logo.png)

<p align="center">
  Example Node (Express + Knex) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the <a href="https://github.com/gothinkster/realworld-example-apps">RealWorld</a> API spec.
</p>
<!-- The badges section -->
<p align="center">
<a href="https://github.com/kenyipp/realworld-nodejs-example-app/actions/workflows/ci.yml"><img src="https://github.com/kenyipp/realworld-nodejs-example-app/workflows/Continuous Integration/badge.svg" alt="Actions Status"></a>
<a href="https://codecov.io/gh/kenyipp/realworld-nodejs-example-app"><img src="https://codecov.io/gh/kenyipp/realworld-nodejs-example-app/branch/master/graph/badge.svg?token=AMBNXM57T8" alt="codecov"></a>
<!-- Snyk.io vulnerabilities badge -->
<a href="https://snyk.io/test/github/kenyipp/realworld-nodejs-example-app"><img src="https://snyk.io/test/github/kenyipp/realworld-nodejs-example-app/badge.svg" alt="Known Vulnerabilities"></a>
<!-- Shields.io license badge -->
<a href="https://github.com/kenyipp/realworld-nodejs-example-app/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/downsample"/></a>
</p>

<p align="center">
This repository has been approved and included on the <a href="https://codebase.show/projects/realworld?category=backend&language=typescript">project page</a> by the <a href="https://codebase.show">Codebase.show</a>  team. I am committed to continuously improving this codebase and incorporating new technologies and useful Node modules as I discover them.
</p>

<p align="center"> I created a separate <a href="https://github.com/kenyipp/realworld-nodejs-example-app-infra?tab=readme-ov-file">repository</a> to deploy this project architecture via <a href="https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html">Aws Cdk</a>. Please check this repository. </p>

<p align="center"> This repository has complete functionality — pull requests and issues are welcome! </p>

<p align="center">
<a href="#demo">Demo</a>
<span>|</span>
<a href="#get_started">Get Started</a>
<span>|</span>
<a href="#architecture">Architecture</a>
<span>|</span>
<a href="#contributing">Contributing</a>
</p>

## Demo

To demonstrate the functionality of the backend, we have deployed a live demo version of the application. You can visit the demo by following this link: [https://conduit-api-prod.kenyip.cc](https://conduit-api-prod.kenyip.cc).

The API has several endpoints that you can test out using a tool like Postman or cURL. You can find the documentation for the API endpoints on the [API documentation page](https://conduit-api-develop.kenyip.cc). Feel free to use this endpoint to create your amazing frontend applications!

Please note that the demo version of the application is intended for demonstration purposes only and may not be suitable for production use. If you would like to deploy the application yourself, please follow the instructions in the <a href="#get_started">Get Started</a> section of this README.

<a id="get_started"></a>

## Get Started
This project utilizes [Yarn](https://classic.yarnpkg.com/en/) as its package manager. Please ensure that Yarn is installed before you begin working on this project.

### Start the Program Using Docker

To start the Docker setup, run the following commands:

```sh
docker-compose build
docker-compose up -d
```

The Docker Compose configuration includes the API server, MySQL database, and the necessary program to set up the required tables for the application to function correctly.

### Local Development

1. Configure the environment variables according to the table below:

| Env                         | Description                                   | Required |
|------------------------------|-----------------------------------------------|----------|
| NODE_ENV                     | Environment in which the application is running (e.g., develop, test, ci, production) | Yes      |
| DOMAIN                       | Domain name for the application               | No       |
| AUTH_EXPIRES_IN             | Duration for which the authentication token is valid | No       |
| AUTH_JWT_SECRET              | Secret key used for signing JWT tokens        | Yes      |
| DATABASE_HOST                | Hostname of the database server               | Yes      |
| DATABASE_PORT                | Port number on which the database is listening | Yes      |
| DATABASE_USER                | Username for database authentication           | Yes      |
| DATABASE_PASSWORD            | Password for database authentication           | Yes      |
| DATABASE_NAME                | Name of the database to connect to            | Yes      |

2. Execute the following commands to install all dependencies and launch the development server:

	```sh
	yarn
	yarn dev
	```

3. Afterward, navigate to [http://localhost:3100/api/health-check](http://localhost:3100/api/health-check) to verify if the server is operating correctly.

### Deployment

This project utilizes the <a href="https://github.com/vendia/serverless-express">Express Serverless</a> framework along with <a href="https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html">Amazon CDK</a> to deploy the server in a serverless architecture. You can find the [./infra](infra) folder in the root directory, which contains all the setup code related to this server. To view the entire architecture, including roles, buckets, and the CodeBuild pipeline, please refer to [this repository](https://github.com/kenyipp/realworld-nodejs-example-app-infra).

To deploy the application, run `yarn deploy --all` in the command line interface. If you need more detailed explanations on the techniques and application architecture, refer to the <a href="#architecture">architecture</a> section.

For more information on deploying a serverless application with Amazon SAM, please visit the [AWS documentation](https://docs.aws.amazon.com/serverless-application-model/?icmpid=docs_homepage_compute).

## Architecture
I have written a blog post about the techniques, structure, architecture, and my reflections on this project. For more details, click [here](https://blog.kenyip.cc/realworld-node-js-example-app)!

## Contributing

Please review the existing issues in this repository for areas that require improvement.
If you identify any missing or potential areas for improvement, feel free to open a new issue for them.

### Before commit

Before deploying and integrating the application, it is necessary to perform a series of validations such as testing, linting, and formatting. We recommend running `make pre-commit` before making each commit to ensure compliance.

## License
This project is licensed under the MIT License - see the [MIT](LICENSE) file for details.
