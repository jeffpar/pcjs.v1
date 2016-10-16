#
# Don't have macro11?  Make yourself a copy from https://github.com/shattered/macro11
#

all: boot.json

boot.lst: boot.mac
	macro11 boot.mac -l boot.lst

boot.json: boot.lst
	node ../../../../modules/filedump/bin/filedump --file=boot.lst --format=octal --output=boot.json --overwrite
