#!/bin/sh

npm install --also=dev && \
npm start -- --host 0.0.0.0 --public-host keyscom.local --disable-host-check
