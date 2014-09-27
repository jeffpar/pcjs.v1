#!/bin/sh
if [ ! -d zips ]; then mkdir zips; fi
zip -q zips/$1 * -x samples*.zip zip.sh
cp zips/$1 samples.zip