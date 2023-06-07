#!/bin/bash

function install {
    echo "Installing dependencies for $1"
    (cd $1 && yarn install)
}

install ./packages/types
install ./packages/config
install ./packages/utils
install ./packages/core
install ./apps/server
