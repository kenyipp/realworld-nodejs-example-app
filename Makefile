pre-commit:
	pnpm test
	pnpm run lint
	pnpm run spell-check

install:
	cd ./apps/server && rm -r ./node_modules
	pnpm install

deploy:
	pnpm run build
	cd ./apps/server && rm -r ./node_modules && yarn install --production
	sam deploy

