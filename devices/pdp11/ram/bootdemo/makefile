#
# Don't have macro11?  Make yourself a copy from https://github.com/shattered/macro11
#

all: bootdemo.json

bootdemo.lst: bootdemo.mac
	macro11 bootdemo.mac -l bootdemo.lst

bootdemo.json: bootdemo.lst
	node ../../../../modules/filedump/bin/filedump --file=bootdemo.lst --format=octal --output=bootdemo.json --overwrite
