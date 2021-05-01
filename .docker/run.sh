#!/bin/sh

npm install --also=dev
npm start -- --host 0.0.0.0 --publicHost keyscom.local --disable-host-check

