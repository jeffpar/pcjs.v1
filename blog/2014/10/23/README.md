Release of PCjs v1.15.6
---
This is a fairly minor update that fixes a few Floppy Disk Controller (FDC) issues and one CPU emulation bug
that prevented PC-DOS 7.00 from working properly.

There are also some Debugger improvements; for example, if you turn on "fdc" and "int" messages in the
Debugger using the "m fdc on" and "m int on" commands, all FDC (INT 0x13) software interrupts will be logged,
including descriptions and register values.

PC-DOS 7.00 still can't be setup from its specially-formatted 1.84Mb [XDF](http://www.os2museum.com/wp/the-xdf-diskette-format/)
distribution disk images, "PC-DOS 7.00 (SETUP Disk 2)" through "PC-DOS 7.00 (SETUP Disk 5)", so your best bet is to boot
from the 1.44Mb "PC-DOS 7.00 (Boot Disk)".

Note that you must also use a fairly new 80286 machine configuration, like this [8Mhz IBM PC AT](/devices/pc/machine/5170/ega/1152kb/rev3/),
in order to use 1.44Mb diskette images; previous models did not support 3.5-inch diskette drives, unless they had been retrofitted
with a newer [BIOS](/devices/pc/bios/5170/).

*[@jeffpar](http://twitter.com/jeffpar)*  
*October 23, 2014*
