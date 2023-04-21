# ![Node.js / Express / Typescript / MySql / Knex Example App](./.github/images/logo.png)

<p align="center">
  Example Node (Express + Knex) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the <a href="https://github.com/gothinkster/realworld-example-apps">RealWorld</a> API spec.
</p>
<p align="center">
The <a href="https://codebase.show">codebase.show</a> team has approved and included this repository on their <a href="https://codebase.show/projects/realworld?category=backend&language=typescript">project page</a>.
</p>

<!-- The badges section -->
<p align="center">
<a href="https://github.com/kenyipp/realworld-nodejs-example-app/actions/workflows/ci.yml"><img src="https://github.com/kenyipp/realworld-nodejs-example-app/workflows/CI/badge.svg" alt="Actions Status"></a>
<a href="https://app.codacy.com/gh/kenyipp/realworld-nodejs-example-app/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade"><img src="https://img.shields.io/codacy/grade/d920979be4dc45feb55dcd462ef88229" /></a>
<a href="https://codecov.io/gh/kenyipp/realworld-nodejs-example-app"><img src="https://codecov.io/gh/kenyipp/realworld-nodejs-example-app/branch/master/graph/badge.svg?token=AMBNXM57T8" alt="codecov"></a>
<!-- Snyk.io vulnerabilities badge -->
<a href="https://snyk.io/test/github/kenyipp/realworld-nodejs-example-app"><img src="https://snyk.io/test/github/kenyipp/realworld-nodejs-example-app/badge.svg" alt="Known Vulnerabilities"></a>
<!-- Shields.io license badge -->
<a href="https://github.com/kenyipp/realworld-nodejs-example-app/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/downsample"/></a>
</p>

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

<a id="demo"></a>

## Demo

To demonstrate the functionality of the backend, we have deployed a live demo version of the application. You can visit the demo by following this link: [https://conduit-api-production.kenyip.cc](https://conduit-api-production.kenyip.cc).

The API has several endpoints that you can test out using a tool like Postman or cURL. You can find the documentation for the API endpoints on the [API documentation page](https://conduit-api-production.kenyip.cc). Feel free to use this endpoint to create your amazing frontend applications!

Please note that the demo version of the application is intended for demonstration purposes only and may not be suitable for production use. If you would like to deploy the application yourself, please follow the instructions in the <a href="#get_started">Get Started</a> section of this README.

<a id="get_started"></a>

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

### Deployment

This project uses the [Express Serverless](https://github.com/vendia/serverless-express) framework and [Amazon SAM](https://aws.amazon.com/tw/serverless/sam) to deploy the server as a serverless structure. In the root directory, you'll find a [deployment template](./template.yaml) with hints to guide you through the deployment process.

To deploy the application, run `sam deploy --guide` in the command line interface. You'll be prompted with questions to configure the deployment. If you need more detailed explanations on the techniques and application architecture, refer to the <a href="#architecture">architecture</a> section.

For more information on deploying a serverless application with Amazon SAM, please visit the [AWS documentation](https://docs.aws.amazon.com/serverless-application-model/?icmpid=docs_homepage_compute).

<a id="contributing"></a>

## Contributing

Please review the existing issues in this repository for areas that require improvement.
If you identify any missing or potential areas for improvement, feel free to open a new issue for them.

### Before commit

Before deploying and integrating the application, it is necessary to perform a series of validations such as testing, linting, and formatting. We recommend running `make pre-commit` before making each commit to ensure compliance.

## License
This project is licensed under the MIT License - see the [MIT](LICENSE) file for details.
