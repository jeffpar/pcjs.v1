all: test386.json test386.img

test386.com: test386.nasm ../inc/dos.inc ../inc/misc.inc ../inc/x86.inc
	nasm -i../inc/ -f bin test386.nasm -l test386.lst -o test386.com

test386.json: test386.com
	node ../../../modules/filedump/bin/filedump --file=test386.com --output=test386.json --overwrite

test386.img: test386.com
	node ../../../modules/diskdump/bin/diskdump --path=test386.com --output=test386.img --format=img --overwrite
