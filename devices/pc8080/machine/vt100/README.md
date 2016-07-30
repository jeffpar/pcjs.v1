---
layout: page
title: VT100 Terminal
permalink: /devices/pc8080/machine/vt100/
machines:
  - type: pc8080
    id: vt100
    debugger: true
---

VT100 Terminal
--------------

This is where we'll be testing another 8080-based machine: the VT100 Terminal. Unlike other VT100 emulations,
this will simulate a VT100 by running the terminal's original firmware inside the [PC8080](/modules/pc8080/) CPU emulator.

As described in the [Technical Manual (July 1982)](http://bitsavers.informatik.uni-stuttgart.de/pdf/dec/terminal/vt100/EK-VT100-TM-003_VT100_Technical_Manual_Jul82.pdf),
p. 4-15, 8Kb (0x2000) of ROM is located at 0x0000, and 3Kb (0x0C00) of RAM immediately follows it at 0x2000.  The ROM at
0x0000 contains all the VT100's 8080 code.  The VT100 also contains a 2Kb character generator ROM, but it is not
mapped into the 8080's address space.

[vt100romhax](http://vt100romhax.tumblr.com/post/90697428973/the-vt100-memory-map-and-8080-disassembly)
(aka [phooky](https://github.com/phooky)) further explains VT100 memory usage:

	Start   End     Size    Description
	0x0000  0x1fff  8K      Basic ROM
	0x2000  0x2012  18B     Blank lines for refresh (6 x 3B)
	0x2012  0x204f  61B     Stack area (grows down from 0x204e)
	0x204f  0x22d0  641B    Scratch Pad/Setup Area(?)
	0x22d0  0x2c00  2352B   Screen RAM

Normally, the PC8080 Video component allocates its own video buffer, based on the specified buffer address
(*bufferAddr*) and other dimensions (eg, *bufferCols* and *bufferRows*), but the VT100 is a little unusual:
it has a custom video processor that uses DMA to request character data from any region of RAM, one line at a time.
It always defaults to address 0x2000 for the first line of character data, but each line terminates with 3 bytes
containing line attributes and the address of the next line, so the location of subsequent lines will vary,
depending on the following line attributes:

- Single-width characters (80 or 132 columns)
- Double-width characters (40 or 66 columns)

In addition to single vs. double width, line attributes can also specify double height (along with whether the
top half or bottom half of the character should be displayed).

In light of the above, the [machine XML file](machine.xml) must set the Video component's *bufferRAM* property
to "true", indicating that existing RAM should be used, and a new property, *bufferFormat* must be set to "vt100",
enabling support for the VT100's line data format; eg:

	<ram id="ram" addr="0x2000" size="0x0C00"/>
	<video id="video" screenWidth="1600" screenHeight="800" bufferAddr="0x2000" bufferRAM="true" bufferFormat="vt100" bufferCols="80" bufferRows="24" ...>

Ordinarily, the VT100 screen displays 800 dots per horizontal scan, and a total of 240 horizontal scans, and by default,
it uses a 10x10 character cell, for a total of 80 columns and 24 rows of characters.  However, in 132-column mode, it
uses a 9x10 character cell instead, and assuming no AVO expansion card is present, there is only enough screen RAM available
for 14 rows of characters; this implies a total of 1188 dots displayed per horizontal scan, and a total of only 140 horizontal
scans.  This means we will have to dynamically reallocate the buffer display context whenever the horizontal dimensions change
(ie, from 800 to 1188, or from 1188 back to 800).

For optimum scaling, I would normally define the virtual screen size using multiples of the VT100's "dot" dimensions;
eg, 1600x960 (a horizontal multiplier of 2 and a vertical multiplier of 4).  However, that would give us a virtual screen
aspect ratio of 1.67, which is less than the (apparent) 2.0 aspect ratio of a physical VT100 screen, so I've changed the
test machine's screen dimensions to 1600x800.

Regarding physical dimensions, a VT100 screen measures 12 inches diagonally, and in 80-column mode, characters measure
2.0mm x 3.35mm (in 132-column mode, they measure 1.3mm x 3.35mm).  This means that the text area of the screen is roughly
160mm x 80mm, implying a screen aspect ratio of 2.0.

{% include machine.html id="vt100" %}

VT100 Resources
---------------

[VT100 Publications](/pubs/dec/vt100/)
