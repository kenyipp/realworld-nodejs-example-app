#!/bin/bash

TEST_COLLECTIONS_LIST=( \
	full
)

for collection in ${TEST_COLLECTIONS_LIST[@]}; do
	newman run ./postman-collections/$collection.json \
	  --bail										  \
	  -e "./testing-environment.json"
done
