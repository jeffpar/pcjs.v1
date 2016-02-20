#!/bin/sh
if [ ! -d zips ]; then mkdir zips; fi
zip -q zips/$1 * -x examples*.zip zip.sh
cp zips/$1 examples.zip
