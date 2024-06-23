#!/bin/bash

# if 1st argument is not provided, exit
if [ -z "$1" ]; then
    echo "Arg 1: Registry URL is required"
    exit 1
fi

# if 2nd argument is not provided, exit
if [ -z "$2" ]; then
    echo "Arg 2: npmrc output file is required"
    exit 1
fi

# strip http(s):// from registry URL
domain="${1//http:\/\//}"
domain="${domain//https:\/\//}"

echo "//${domain}/:_authToken=\${NPM_AUTH_TOKEN}" >"$2"
echo "registry=${1}" >>"$2"
echo "always-auth=true" >>"$2"
