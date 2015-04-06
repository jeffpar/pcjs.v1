#
# For anyone who wants to experiment with reverse-engineering Compaq DeskPro 386 BIOS
# source code by disassembling one of the original DeskPro ROMs, here are the initial steps:
#
#	1) Regenerate an original ROM binary from one of the JSON-encoded ROM files
#	2) Create ready-to-assemble code by feeding NDISASM output into the TextOut preprocessor
#
# @jeffpar
# 06-Apr-2015
#

all: test.rom

1988-01-28.rom: 1988-01-28.json
	node ../../../../../modules/filedump/bin/filedump --file=1988-01-28.json --output=1988-01-28.rom --format=rom

test.nasm: 1988-01-28.rom
	ndisasm -o0x8000 -se105h -se05ah -se6ffh -sf025h -sf8aah 1988-01-28.rom > test.nasm
	node ../../../../../modules/textout/bin/textout --file=test.nasm --nasm > temp.nasm
	mv temp.nasm test.nasm

test.rom: test.nasm
	nasm -f bin test.nasm -l test.lst -o test.rom
