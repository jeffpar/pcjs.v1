all: tests.rom

tests.rom: tests.nasm
	nasm -f bin tests.nasm -l tests.lst -o tests.rom
