pre-commit:
	pnpm test
	pnpm run lint:fix
	pnpm run format
	pnpm run spell-check

install:
	cd ./apps/server && rm -r ./node_modules
	pnpm install

deploy:
	pnpm run build
	cd ./apps/server && rm -r ./node_modules && find . -name "*.ts" -type f -delete && yarn install --production
	sam deploy

