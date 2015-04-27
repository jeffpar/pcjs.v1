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

all: 1988-01-28/1988-01-28-test.rom 1989-04-14/1989-04-14-test.rom

1988-01-28/1988-01-28.rom: 1988-01-28/1988-01-28.json
	node ../../../../../modules/filedump/bin/filedump --file=1988-01-28/1988-01-28.json --output=1988-01-28/1988-01-28.rom --format=rom

1988-01-28/1988-01-28-test.nasm: 1988-01-28/1988-01-28.rom
	ndisasm -o0x8000 -se105h -se05ah -se6ffh -sf025h -sf8aah 1988-01-28/1988-01-28.rom > 1988-01-28/1988-01-28-test.nasm
	node ../../../../../modules/textout/bin/textout --file=1988-01-28/1988-01-28-test.nasm --nasm > 1988-01-28/temp.nasm
	mv 1988-01-28/temp.nasm 1988-01-28/1988-01-28-test.nasm

1988-01-28/1988-01-28-test.rom: 1988-01-28/1988-01-28-test.nasm
	nasm -f bin 1988-01-28/1988-01-28-test.nasm -l 1988-01-28/1988-01-28-test.lst -o 1988-01-28/1988-01-28-test.rom

1989-04-14/1989-04-14.rom: 1989-04-14/1989-04-14.json
	node ../../../../../modules/filedump/bin/filedump --file=1989-04-14/1989-04-14.json --output=1989-04-14/1989-04-14.rom --format=rom

1989-04-14/1989-04-14-test.nasm: 1989-04-14/1989-04-14.rom
	ndisasm -o0x8000 1989-04-14/1989-04-14.rom > 1989-04-14/1989-04-14-test.nasm
	node ../../../../../modules/textout/bin/textout --file=1989-04-14/1989-04-14-test.nasm --nasm > 1989-04-14/temp.nasm
	mv 1989-04-14/temp.nasm 1989-04-14/1989-04-14-test.nasm

1989-04-14/1989-04-14-test.rom: 1989-04-14/1989-04-14-test.nasm
	nasm -f bin 1989-04-14/1989-04-14-test.nasm -l 1989-04-14/1989-04-14-test.lst -o 1989-04-14/1989-04-14-test.rom
