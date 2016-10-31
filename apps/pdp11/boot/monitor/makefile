#
# Don't have macro11?  Make yourself a copy from https://github.com/shattered/macro11
#

all: PDPJSMON.json

PDPJSMON.lst: PDPJSMON.mac
	macro11 PDPJSMON.mac -l PDPJSMON.lst

PDPJSMON.json: PDPJSMON.lst
	node ../../../../modules/filedump/bin/filedump --file=PDPJSMON.lst --format=octal --output=PDPJSMON.json --overwrite
