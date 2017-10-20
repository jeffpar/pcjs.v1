---
layout: page
title: Texas Instruments TI-57 ROM
permalink: /devices/ti57/rom/
---

TI-57 ROM
---------

Thanks to work by [Sean Riddle](http://seanriddle.com/tms1500.html) and [John McMaster](http://uvicrec.blogspot.com),
we have multiple TI-57 ROMs to choose from:

- [Raw ROM dump](ti57raw.bin) (from [siliconpr0n](http://siliconpr0n.org) [photo](http://siliconpr0n.org/archive/doku.php?id=mcmaster:ti:tmc1501nc))
- [Corrected ROM dump](ti57.bin)
- [ROM dump transcribed from patents](ti57pat.bin) (ie, [4,078,251](../patents/us4078251), [4,079,459](../patents/us4079459), [4,100,600](../patents/us4100600), [4,107,781](../patents/us4107781), [4,125,901](../patents/us4125901), [4,164,037](../patents/us4164037))

The "transcribed" version makes no mention of the ROM listings in patents:
 
- [4,125,867](../patents/us4125867) (somewhat readable)
- [4,146,928](../patents/us4146928) (readable)
- [4,277,675](../patents/us4277675) (not very readable)

Also, this post on [hpmuseum.org](http://www.hpmuseum.org/cgi-sys/cgiwrap/hpmuseum/archv021.cgi?read=248085)
points out the differences between the ROM listing in the patent(s) and that used in a Windows-based
[TI-57 emulator](http://www.hrastprogrammer.com/ti57e/):

	Dec Hex     037    901   Emu
	-----------------------------
	015 0x00F:  1abc   1a8c  1a8c
	081 0x051:  1aSd   1a8d  1a8d
	477 0x1DD:  19822  1982  1982
	511 0x1FF:  0e07   0e07* 0eff
	512 0x200:  0e07   0e07* 0e0d
	526 0x20E:  0cbd   0cbd* 0eff
	581 0x245:  07eb   07b8* 07e8
	631 0x277:  1abc   1a8c  1a8c
	636 0x27C:  17b0   1780  1780
	638 0x27E:  1abf   1a8f  1a8f
	697 0x2B9:  0bc7   08c7  08c7

The **037** values in the above table are the same as the values in [4,164,037](../patents/us4164037), whereas
the **901** values from [4,125,901](../patents/us4125901) are more in agreement with the "Emu" values, except for
those marked by `*`.
