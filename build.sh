#!/bin/bash

pushd server > /dev/null
echo "building server..."
[[ ! -d node_modules ]] && npm install
tsc -p .
popd > /dev/null

pushd client > /dev/null
echo "building client..."
[[ ! -d node_modules ]] && npm install
webpack
popd > /dev/null
