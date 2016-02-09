#
# Steps to regenerate a ROM by disassembling and re-assembling the JSON-encoded ROM.
#

FILEDUMP=node ../../../../../../modules/filedump/bin/filedump
TEXTOUT=node ../../../../../../modules/textout/bin/textout

all: tmp tmp/1988-01-28-regen.rom

tmp:
	mkdir tmp

tmp/1988-01-28.rom: 1988-01-28.json
	$(FILEDUMP) --file=1988-01-28.json --output=tmp/1988-01-28.rom --format=rom

tmp/1988-01-28-regen.nasm: tmp/1988-01-28.rom
	ndisasm -o0x8000 -se105h -se05ah -se6ffh -sf025h -sf8aah tmp/1988-01-28.rom > tmp/1988-01-28-regen.nasm
	$(TEXTOUT) --file=tmp/1988-01-28-regen.nasm --nasm > tmp/t.nasm
	mv tmp/t.nasm tmp/1988-01-28-regen.nasm

tmp/1988-01-28-regen.rom: tmp/1988-01-28-regen.nasm
	nasm -f bin tmp/1988-01-28-regen.nasm -l tmp/1988-01-28-regen.lst -o tmp/1988-01-28-regen.rom
