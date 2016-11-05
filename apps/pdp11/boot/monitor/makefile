#
# Don't have macro11?  Make yourself a copy from https://github.com/shattered/macro11
#

all: PDPJSMON.json

PDPJSMON.txt: PDPJSMON.mac
	macro11 PDPJSMON.mac -l PDPJSMON.txt

PDPJSMON.json: PDPJSMON.txt
	node ../../../../modules/filedump/bin/filedump --file=PDPJSMON.txt --format=octal --output=PDPJSMON.json --overwrite
