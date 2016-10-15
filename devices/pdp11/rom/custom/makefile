all: boot.json

boot.lst: boot.mac
	macro11 boot.mac -l boot.lst

boot.json: boot.lst
	node ../../../../modules/filedump/bin/filedump --file=boot.lst --format=octal --output=boot.json --overwrite
