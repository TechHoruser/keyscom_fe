#!/bin/sh

# generate new messages
node --max_old_space_size=4000 ./node_modules/.bin/ng extract-i18n --format=xlf2 --output-path=src/locale

# merge messages
./node_modules/.bin/xliffmerge --profile xliffmerge.json
