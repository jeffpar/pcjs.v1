#
# Steps to produce a binary ROM from a JSON-encoded ROM, and then disassemble and re-assemble it.
#

FILEDUMP=node ../../../../../../modules/filedump/bin/filedump
TEXTOUT=node ../../../../../../modules/textout/bin/textout

all: 1988-01-28-test.rom

1988-01-28.rom: 1988-01-28.json
	$(FILEDUMP) --file=1988-01-28.json --output=1988-01-28.rom --format=rom

1988-01-28-test.nasm: 1988-01-28.rom
	ndisasm -o0x8000 -se105h -se05ah -se6ffh -sf025h -sf8aah 1988-01-28.rom > 1988-01-28-test.nasm
	$(TEXTOUT) --file=1988-01-28-test.nasm --nasm > temp.nasm
	mv temp.nasm 1988-01-28-test.nasm

1988-01-28-test.rom: 1988-01-28-test.nasm
	nasm -f bin 1988-01-28-test.nasm -l 1988-01-28-test.lst -o 1988-01-28-test.rom
