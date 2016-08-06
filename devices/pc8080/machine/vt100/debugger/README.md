---
layout: page
title: DEC VT100 Terminal
permalink: /devices/pc8080/machine/vt100/debugger/
machines:
  - type: pc8080
    id: vt100
    debugger: true
---

DEC VT100 Terminal with Debugger
--------------------------------

The [PC8080](/modules/pc8080/) machine below is configured to simulate a [VT100 Terminal](/devices/pc8080/machine/vt100/)
with a Control Panel and Debugger.  It is running the original [VT100 Firmware](/devices/pc8080/rom/vt100/) inside the
[PC8080](/modules/pc8080/) CPU emulator.

Click the "Run" button to start the simulation.  You'll also find assorted
[Hardware Notes](#vt100-memory-usage) below.

{% include machine.html id="vt100" %}

VT100 Memory Usage
------------------

As described in the [Technical Manual (July 1982)](http://bitsavers.informatik.uni-stuttgart.de/pdf/dec/terminal/vt100/EK-VT100-TM-003_VT100_Technical_Manual_Jul82.pdf),
p. 4-15, 8Kb (0x2000) of ROM is located at 0x0000, and 3Kb (0x0C00) of RAM immediately follows it at 0x2000.  The ROM at
0x0000 contains all the VT100's 8080 code.  The VT100 also contains a 2Kb character generator ROM, but that ROM is not
addressable by the CPU; it is used directly by the Video Processor.

See [DEC VT100 ROMs](/devices/pc8080/rom/vt100/) for more information about the ROMs.

[vt100romhax](http://vt100romhax.tumblr.com/post/90697428973/the-vt100-memory-map-and-8080-disassembly)
(aka [phooky](https://github.com/phooky) aka Adam Mayer) further explains VT100 memory usage:

	Start   End     Size    Description
	0x0000  0x1fff  8K      Basic ROM
	0x2000  0x2012  18B     Blank lines for refresh (6 x 3B)
	0x2012  0x204f  61B     Stack area (grows down from 0x204e)
	0x204f  0x22d0  641B    Scratch Pad/Setup Area(?)
	0x22d0  0x2c00  2352B   Screen RAM

VT100 I/O Ports
---------------

From p. 4-17 of the Technical Manual:

	READ OR WRITE
	00H     PUSART data bus
	01H     PUSART command port
	
	WRITE ONLY (Decoded with I/O WR L)
	02H     Baud rate generator
	42H     Brightness D/A latch
	62H     NVR latch
	82H     Keyboard UART data input
	A2H     Video processor DC012
	C2H     Video processor DC011
	E2H     Graphics port
	
	READ ONLY (Decoded with I/O RD L)
	22H     Modem buffer
	42H     Flags buffer
	82H     Keyboard UART data output

The PC8080 ChipSet component deals with the ER1400's Non-volatile RAM (NVR) ports, the Flags buffer, and the
DC011 and DC012 circuits, while the Keyboard component deals with the Keyboard UART.

You might wonder why the PC8080 Video component doesn't manage the DC011 and DC012.  In fact, the above labels are misleading.
If you look at the Functional Diagram on p. 4-53 of the Technical Manual, you'll see that DC011 and DC012 are really
peripheral components providing inputs to the Video Processor.  Moreover, they are not exclusive to the Video Processor.
For example, the LBA7 output of the DC011 is also used to clock the NVR chip.

In most respects, the VT100 Technical Manual provides a phenomenal amount of detail.
However, documentation for some of the above ports is almost non-existent.  It's only thanks to
[third parties](https://github.com/phooky/VT100-Hax/blob/master/Platform%20Notes.md) that we have, for example, the following
information about the Flags buffer (port 0x42):

	Bit Active? Description
	7   H       KBD Transmit Buffer Empty
	6   H       LBA 7(?) (It's a pin on the backplane connector...) - used to clock NVR - line buffer address
	5   H       NVR DATA
	4   L       EVEN FIELD (comes out of the video timing generator)
	3   H       OPTION PRESENT (terminal output option???)
	2   L       GRAPHICS FLAG (is VT52 graphics card present) [I think he meant VT125 -JP]
	1   L       ADVANCED VIDEO (is AVO present)
	0   H       XMIT FLAG

VT100 Video Processor
---------------------

Normally, the PC8080 Video component allocates its own video buffer, based on the specified buffer address
(*bufferAddr*) and other dimensions (eg, *bufferCols* and *bufferRows*), but the VT100 is a little unusual:
it has a custom Video Processor that uses DMA to request character data from any region of RAM, one line at a time.
It always defaults to address 0x2000 for the first line of character data, but each line terminates with 3 bytes
containing the attributes and address of the next line, so the location of subsequent lines will vary, depending
on the type of line:

- Single-wide characters (80 or 132 columns)
- Double-wide characters (40 or 66 columns)

In addition to single-wide vs. double-wide, line attributes can also specify double-high, along with whether the
top or bottom halves of the double-high characters should be displayed, because double-high always implies double-wide
(ie, there is no support for double-high, single-wide characters).

Conssequently, a VT100 [machine XML file](machine.xml) must set the Video component's *bufferRAM* property
to "true", indicating that existing RAM should be used, and a new property, *bufferFormat* must be set to "vt100",
enabling support for the VT100's line data format; eg:

	<ram id="ram" addr="0x2000" size="0x0C00"/>
	<video id="video" screenWidth="1600" screenHeight="960" bufferAddr="0x2000" bufferRAM="true" bufferFormat="vt100" bufferCols="80" bufferRows="24" ...>

VT100 Screen and Character Dimensions
-------------------------------------

Ordinarily, the VT100 screen displays 800 dots per horizontal scan, and a total of 240 horizontal scans, and by default,
it uses a 10x10 character cell, for a total of 80 columns and 24 rows of characters.  However, in 132-column mode, it
uses a 9x10 character cell instead, implying a total of 1188 dots displayed per horizontal scan.  This means we will have
to dynamically reallocate our internal buffers whenever the horizontal dimensions change.  Also, if no AVO expansion
card is present, there is only enough RAM available for 14 rows of characters in 132-column mode. 

For optimum scaling, I define the virtual screen size using multiples of the VT100's default "dot" dimensions; eg, 1600x960
(a horizontal multiplier of 2 and a vertical multiplier of 4).  That gives us a virtual screen aspect ratio of 1.67.

According to the Technical Manual, a physical VT100 screen measures 12 inches diagonally, and in 80-column mode, characters
measure 2.0mm x 3.35mm (in 132-column mode, they measure 1.3mm x 3.35mm), which suggests that the text area of the screen is
roughly 160mm x 80mm, implying a screen aspect ratio of 2.0.  However, after visually comparing the Technical Manual's SET-UP
screenshots to our test screens, 1.67 appears to be closer to reality than 2.0.  I'll revisit this issue at a later date.  

Additional VT100 Resources
--------------------------

[VT100 Publications](/pubs/dec/vt100/)

