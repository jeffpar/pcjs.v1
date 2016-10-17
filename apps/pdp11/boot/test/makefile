#
# Don't have macro11?  Make yourself a copy from https://github.com/shattered/macro11
#

all: TEST.json

TEST.lst: TEST.mac
	macro11 TEST.mac -l TEST.lst

TEST.json: TEST.lst
	node ../../../../modules/filedump/bin/filedump --file=TEST.lst --format=octal --output=TEST.json --overwrite
