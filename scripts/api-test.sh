#!/bin/bash

TEST_COLLECTIONS_LIST=( \
	full
)

for collection in ${TEST_COLLECTIONS_LIST[@]}; do
	newman run ./tests/integration/postman-collections/$collection.json \
	  --bail										  \
	  -e "./tests/integration/testing-environment.json"
done

