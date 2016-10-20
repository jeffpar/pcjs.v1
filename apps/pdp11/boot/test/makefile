#
# Don't have macro11?  Make yourself a copy from https://github.com/shattered/macro11
#

all: BOOTTEST.json

BOOTTEST.lst: BOOTTEST.mac
	macro11 BOOTTEST.mac -l BOOTTEST.lst

BOOTTEST.json: BOOTTEST.lst
	node ../../../../modules/filedump/bin/filedump --file=BOOTTEST.lst --format=octal --output=BOOTTEST.json --overwrite
