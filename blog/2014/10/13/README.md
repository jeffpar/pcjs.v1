The 8Mhz IBM PC AT 5170 
---
I just added my first [IBM PC AT "Rev 3"](/configs/pc/machines/5170/ega/1152kb/rev3/) machine configuration
to the list of [IBM PC Machine Configurations](/configs/pc/machines/), and not surprisingly, the new machine
fails to boot.

I call it "Rev 3" because it uses the 3rd [ROM BIOS](/devices/pc/bios/5170/) that IBM released for the PC AT,
a revision that is supposed to include support for 3.5-inch 1.44Mb diskettes -- which would be great, because I
have a number of 1.44Mb diskette images it would be nice to be able to read in a PCjs machine.

Machines with this BIOS also ran at 8Mhz, so I've bumped the CPU speed up to 8,000,000 cycles/second.  It'll be
interesting to see whether this BIOS also increased any of its hard-coded timing delay-loops as a result.

Anyway, when I enabled ChipSet I/O port messages in the Debugger:

	m chipset on
	m port on

I can see that the BIOS Power-On Self Test (POST) progresses nicely until it starts generating lots of port 0x61
activity:

	chipset.inPort(0x0061,8042_RWREG): 0x30 at F000:05A8
	chipset.inPort(0x0061,8042_RWREG): 0x20 at F000:05AE

I know what I'm going to be doing this afternoon now.

*[@jeffpar](http://twitter.com/jeffpar)*  
*October 13, 2014*