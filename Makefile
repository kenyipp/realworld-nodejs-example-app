pre-commit:
	pnpm test
	pnpm run lint
	pnpm run spell-check

build:
	pnpm run build
	cd ./apps/server && rm -r ./node_modules && yarn install --production
	sam deploy
