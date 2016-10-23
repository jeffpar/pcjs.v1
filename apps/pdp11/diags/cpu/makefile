#
# Don't have macro11?  Make yourself a copy from https://github.com/shattered/macro11
#

all: XCPA.json

XCPA.lst: XCPA.mac
	macro11 XCPA.mac -l XCPA.lst

XCPA.json: XCPA.lst
	node ../../../../modules/filedump/bin/filedump --file=XCPA.lst --format=octal --output=XCPA.json --overwrite
