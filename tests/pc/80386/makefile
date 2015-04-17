all: tests.json

tests.rom: tests.nasm
	nasm -f bin tests.nasm -l tests.lst -o tests.rom

tests.json: tests.rom
	node ../../../modules/filedump/bin/filedump --file=tests.rom --output=tests.json --overwrite
