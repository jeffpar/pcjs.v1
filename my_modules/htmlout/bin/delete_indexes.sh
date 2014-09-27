#!/bin/sh
#
# This script was created for the Grunt "delete_indexes" task in /Gruntfile.js; it lives here
# because htmlout is the module responsible for "littering" the project with "index.html" files,
# therefore it bears responsibility for cleaning them up.  This is its "poor man's" solution.
#
find . -name "index.html" -exec grep -H -l -e "<title>pcjs.org" {} \; | sed -E "s/(.*)/rm -v \"\1\"/" | bash