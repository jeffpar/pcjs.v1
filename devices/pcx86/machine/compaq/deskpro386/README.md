---
layout: page
title: COMPAQ DeskPro 386 Machines
permalink: /devices/pcx86/machine/compaq/deskpro386/
---

COMPAQ DeskPro 386 Machines
---------------------------

All our EGA configurations use the `Rev F` [COMPAQ DeskPro 386 ROM](/devices/pcx86/rom/compaq/deskpro386/), dated
September 4, 1986.  It is currently the oldest available DeskPro 386 ROM.  The VGA did not exist until 1987, so it
makes sense to use the EGA with a contemporary ROM.

All our VGA configurations use the `Rev J.4` [COMPAQ DeskPro 386 ROM](/devices/pcx86/rom/compaq/deskpro386/), dated
January 28, 1988.

All these machine configurations also include an unformatted "Type 5" [47Mb Hard Disk](/disks/pcx86/drives/47mb/).  To
create a single 47Mb partition, you must use [COMPAQ MS-DOS 3.31](/disks/pcx86/dos/compaq/3.31/) or newer; older versions
of DOS could create partitions only up to 32Mb, and all partitions had to reside within the first 32Mb of disk space.

In addition, all the **Visualizer** configurations are running the "uncompiled" version of PCx86, so that
[BackTrack](/modules/pcx86/#backtrack-support) information is available to the PCjs Debugger.  As a result, those
machines run much slower.  To reduce **DEBUG** or **BACKTRACK** overhead, you can add *debug=false* or *backtrack=false*
to an uncompiled machine's URL; for example, this [DeskPro 386 with Visualizer](vga/2048kb/debugger/visual/?debug=false)
will run much faster than the link provided below.

Since **DEBUG** support is automatically enabled in uncompiled code, you get automatic instruction history buffering
(up to 100,000 instructions), which can then be dumped with the PCjs Debugger's "dh" command.  Instruction history is
supported in the compiled version as well, but only up to 1,000 instructions and only if one or more breakpoints are set.  

* [COMPAQ DeskPro 386 with 2Mb RAM and IBM EGA](ega/2048kb/) ([Debugger](ega/2048kb/debugger/))
* [COMPAQ DeskPro 386 with 4Mb RAM and IBM EGA](ega/4096kb/) ([Debugger](ega/4096kb/debugger/))
* [COMPAQ DeskPro 386 with 2Mb RAM and COMPAQ VGA (Debugger)](other/2048kb/debugger/), ([Visualizer](other/2048kb/debugger/visual/))
* [COMPAQ DeskPro 386 with 2Mb RAM and IBM VGA](vga/2048kb/) ([Debugger](vga/2048kb/debugger/), [Visualizer](vga/2048kb/debugger/visual/))
* [COMPAQ DeskPro 386 with 4Mb RAM and IBM VGA](vga/4096kb/) ([Debugger](vga/4096kb/debugger/), [Visualizer](vga/2048kb/debugger/visual/))
* [COMPAQ DeskPro 386 with 4Mb RAM and IBM VGA running Windows 95](/disks/pcx86/windows/win95/4.00.950/) ([Debugger](/disks/pcx86/windows/win95/4.00.950/debugger/))
