---
layout: page
title: DEC VT100 ROMs
permalink: /devices/pc8080/rom/vt100/
---

DEC VT100 ROMs
--------------

### 8080 Firmware (8Kb)

The DEC VT100 Terminal used four 2Kb ROMs to store all the firmware used by the 8080 processor.
The combined contents of those ROMs have been stored as an 8Kb JSON image in [VT100.json](VT100.json).

As Trammell Hudson's [VT100 Page](https://trmm.net/VT100) explains:

	There are four 8316E ROM chips for the 8080 CPU on the logic board. Since they are custom mask ROMs,
	Digital was able to have a different chip-select bit pattern and avoided having separate NOT gates on the inputs.
	Note that the schematic appears to be incorrect -- E56 is the low order, and E40 is the high order address bits.

He then describes the memory map as follows:

	ROM chip    CS1 (20)    A11/CS2 (18)    A12/CS3 (21)    Mapped address
	E40         H           H               H               0x1800
	E45         H           L               H               0x1000
	E52         H           H               L               0x0800
	E56         H           L               L               0x0000

The above PCB chip locations correspond to the following [DEC ROMs](/devices/roms/dec/):

* E56: [23-061E2.bin](https://web.archive.org/web/20140723115846/http://www.dunnington.u-net.com/public/DECROMs/23-061E2.bin)
* E52: [23-032E2.bin](https://web.archive.org/web/20140723115846/http://www.dunnington.u-net.com/public/DECROMs/23-032E2.bin)
* E45: [23-033E2.bin](https://web.archive.org/web/20140723115846/http://www.dunnington.u-net.com/public/DECROMs/23-033E2.bin)
* E40: [23-034E2.bin](https://web.archive.org/web/20140723115846/http://www.dunnington.u-net.com/public/DECROMs/23-034E2.bin)

And sure enough, concatenating those four DEC ROMs:

	cat 23-061E2.bin 23-032E2.bin 23-033E2.bin 23-034E2.bin > VT100.bin

produces a perfect match for Trammell Hudson's [VT100.bin](http://trmm.net/images/2/20/VT100.bin).

### Character Generator (2Kb)

The VT100 also used one 2Kb character generator ROM, which is stored in [23-018E2.json](23-018E2.json).
The ROM contains 128 rows of character data, 16 bytes per character.  More on the format of that data later.

### Disassembling the 8080 Firmware

Following in the footsteps of [vt100romhax](http://vt100romhax.tumblr.com/post/90697428973/the-vt100-memory-map-and-8080-disassembly),
I disassembled the ROM, using `dz80` from [D52](http://www.brouhaha.com/~eric/software/d52/) ([manual](http://www.bipom.com/documents/dis51/d52manual.html)):

	dz80 -80 VT100.bin

This produced VT100.d80, which I renamed to [VT100.asm](VT100.asm).  I fixed one `dz80` bug, replacing references to
`X2000` with `2000h`, and then hand-merged most of the comments from [haxrom.d80](https://github.com/phooky/VT100-Hax/blob/master/ROMs/haxrom.d80).
This required some selectivity, because I didn't want to inadvertently include any of [phooky's](https://github.com/phooky)
screensaver-related mods to the ROM.

Finally, I verified that reassembling [VT100.asm](VT100.asm) with [asm8080](https://github.com/begoon/asm8080) produced the
original VT100.bin; after adding the correct number of `nop` instructions to the end to the source file, the binaries matched.

The other advantage of reassembling the code is that the resulting [VT100.lst](VT100.lst) makes it easy to export comments
and other symoblic information to [VT100.map](VT100.map), which can then be included in the [VT100.json](VT100.json) ROM dump
and passed on to the PC8080 Debugger.  Here are the rebuild steps:

	asm8080 -lVT100.lst VT100.asm
	grep -E "[0-9]+ [0-9A-D]+.*;;" VT100.lst | sed -E "s/ *[0-9]+ ([0-9A-F]+).*;(;.*)/     \1   .   \2/" > VT100.map
	filedump --file=VT100.bin --format=bytes --output=VT100.json --comments --overwrite

You can omit `--comments` to reduce the size of the [VT100.json](VT100.json) file.

Some [VT100.asm](VT100.asm) clean-up remains, because there are still chunks of data that were incorrectly disassembled as code.
From a reassembly standpoint, it doesn't matter too much, because such instructions get reassembled into the same original binary
patterns, but from a readability standpoint, it's a nuisance.
