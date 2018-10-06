---
layout: page
title: COMPAQ Portable (128Kb) with Monochrome Graphics Display and Debugger
permalink: /devices/pcx86/machine/compaq/vdu/128kb/debugger/
machines:
  - id: compaq-portable-128kb
    type: pcx86
    debugger: true
---

{% include machine.html id="compaq-portable-128kb" %}

Debugging Notes
---------------

I originally created the [XML File](machine.xml) for this machine by copying an IBM PC configuration with
a monochrome display adapter and motherboard SW1 settings `01000001`.  Note that the SW1 monitor switches,
SW1[5] and SW1[6], are both off (`0`), indicating a monochrome monitor.

However, when I booted the machine, the BIOS displayed two errors: 501 in the top left corner, and 4011
toward the middle of the screen.  The machine then crashed in RAM; the last ROM instruction executed was:

    &F000:E769 CF               IRET                              ;history=6102

A [1986 COMPAQ Maintenance and Service Guide](http://www.minuszerodegrees.net/manuals/Compaq%20Portable_Plus_286%20-%20Maintenance%20and%20Service%20Guide.pdf)
indicated that error 501 was a "Display Controller Failure (Video Display or Video Controller Board)".
And the [1982 COMPAQ Operations Guide](/pubs/pc/software/dos/compaq/1.10) contained some information on switch
settings on p. 18 of the "320-KBYTE DISK DRIVE" manual (p. 259 of the entire PDF).

COMPAQ documented only two values for the SW1 monitor switches:

- `10`: COMPAQ VIDEO BOARD (DEFAULT)
- `00`: COMPAQ VIDEO & IBM MONOCHROME BOARDS

The descriptions were a bit cryptic, but since I had already tried `00`, there was no harm in trying `10`.

On this new boot attempt, there was no cursor initially, and two different errors were displayed: 301
and 401.  But then the COMPAQ MS-DOS 1.10 date and time prompts appeared -- success!

I never expected this machine to work the first time, or even the second time, because I had never executed
a COMPAQ Portable ROM before, and the PCx86 [Video](/modules/pcx86/lib/video.js) component doesn't yet know how
to properly emulator a COMPAQ video (VDU) board, which is capable of mimicking both MDA and CGA adapters.

I had assumed that a COMPAQ Portable would prefer to boot up in a monochrome mode, since the boot process is
text-based, and monochrome text looks better than color graphics text.  And that may still be true.  The BIOS
may simply be confused by how the video card is responding, and it may be falling back to some default behavior
that is less "fatal" than my first attempt.

Ignoring VDU compatibility for the moment, the next order of business was to isolate the cause of other errors:
301 ("Keyboard Error") and 401 ("Printer Error").

It turned out that the printer issue was easily resolved by changing the parallel port's adapter number from 2 to 1,
which changes the port's base I/O address from 0x378 to 0x3BC.  The latter is what's normally used by the built-in
parallel port on an IBM monochrome adapter, so either COMPAQ used the same default address *or* the BIOS assumed that
a monochrome card was installed.  Or something like that.

Next, I'll work on figuring out the keyboard error, and then I'll start analyzing how the COMPAQ BIOS detects and
initializes the video hardware.
