all: tests.json

tests.com: tests.nasm ../inc/dos.inc ../inc/misc.inc ../inc/x86.inc
	nasm -i../inc/ -f bin tests.nasm -l tests.lst -o tests.com

tests.json: tests.com
	node ../../../modules/filedump/bin/filedump --file=tests.com --output=tests.json --overwrite
