---
layout: page
title: VT100 ROMs
permalink: /devices/vt100/rom/
---

VT100 ROMs
----------

The VT100 used four 2Kb ROMs to store the code used by its 8080 processor.
Their combined contents are stored in [VT100.json](VT100.json).

As Trammell Hudson's [VT100 Page](https://trmm.net/VT100) explains:

	There are four 8316E ROM chips for the 8080 CPU on the logic board. Since they are custom mask ROMs,
	Digital was able to have a different chip-select bit pattern and avoided having separate NOT gates on the inputs.
	Note that the schematic appears to be incorrect -- E56 is the low order, and E40 is the high order address bits.

He then describes the memory mapping as follows:

	ROM chip    CS1 (20)    A11/CS2 (18)    A12/CS3 (21)    Mapped address
	E40         H           H               H               0x1800
	E45         H           L               H               0x1000
	E52         H           H               L               0x0800
	E56         H           L               L               0x0000

The above PCB chip locations correspond to the following [DEC ROM](/devices/roms/dec/) dumps:

* E56: [23-061E2.bin](https://web.archive.org/web/20140723115846/http://www.dunnington.u-net.com/public/DECROMs/23-061E2.bin)
* E52: [23-032E2.bin](https://web.archive.org/web/20140723115846/http://www.dunnington.u-net.com/public/DECROMs/23-032E2.bin)
* E45: [23-033E2.bin](https://web.archive.org/web/20140723115846/http://www.dunnington.u-net.com/public/DECROMs/23-033E2.bin)
* E40: [23-034E2.bin](https://web.archive.org/web/20140723115846/http://www.dunnington.u-net.com/public/DECROMs/23-034E2.bin)

And sure enough, concatenating those DEC ROM four dumps produces a perfect match for Trammell Hudson's
[VT100.bin](http://trmm.net/images/2/20/VT100.bin).

The VT100 also used one 2Kb character generator ROM, which is stored in [23-018E2.json](23-018E2.json).
