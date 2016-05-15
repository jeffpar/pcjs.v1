CA65 = ../../../../../projects/cc65/bin/ca65
LD65 = ../../../../../projects/cc65/bin/ld65
ECHO = @/bin/echo
FILEDUMP = node ../../../../../modules/filedump/bin/filedump

CA65_OPTS =
LD65_OPTS = --target none

all: vflag.65v vflag.json

vflag.obj: vflag.asm
	$(CA65) vflag.asm -I ../.. -l vflag.lst -o vflag.obj

vflag.bin: vflag.obj
	$(LD65) $(LD65_OPTS) $+ -o $@

vflag.65v: vflag.bin
	$(ECHO) -n ".0200/" > vflag.65v
	hexdump -e '1/1 "%02X\n"' -v vflag.bin >> vflag.65v
	$(ECHO) -n ".0200G" >> vflag.65v

vflag.json: vflag.65v
	$(FILEDUMP) --file=vflag.65v --format=bytes --output=vflag.json --overwrite --comments
