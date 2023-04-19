pre-commit:
	pnpm test
	pnpm run lint
	pnpm run spell-check

build:
	pnpm run build:packages
	cd ./apps/server && pnpm run build:deploy
	cp -r ./apps/server/build ./output
	rsync -a --copy-links ./apps/server/node_modules ./output

post-build:
	cp ./config/template.yaml ./output/template.yaml

deploy:
	cd ./output && sam deploy
