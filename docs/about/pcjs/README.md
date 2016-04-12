---
layout: page
title: About PCjs
permalink: /docs/about/pcjs/
redirect_from:
  - /pc/
  - /pcjs/
---

About PCjs
---

PCjs is a IBM PC/XT/AT simulator written entirely in JavaScript.  It's designed to load and run extremely
fast, it works well in all modern web browsers (both desktop and mobile), and it's easy to customize.  It is part of
the [PCjs Project](https://github.com/jeffpar/pcjs), an open source project on [GitHub](http://github.com/).

Check out the [Demos](/#demos) on the home page, and all the other PCjs [Application](/apps/pc/), [Disk](/disks/pc/),
and [Machine](/devices/pc/machine/) demos, including an [IBM PC Dual Display System](/devices/pc/machine/5150/dual/64kb/)
demo of multiple monitor support, and [IBM PC XT "Server Array"](/devices/pc/machine/5160/cga/256kb/array/) and
[Windows 1.01 "Server Array"](/devices/pc/machine/5160/ega/640kb/array/) demos of multiple machines running side-by-side.

### Features

+ Build your own IBM PC, PC XT, and PC AT simulations using simple XML machine configuration files.
You decide how much RAM you want, how many disk drives, which disk images to include (and which should be
pre-loaded), what kind of video adapter (MDA, CGA, EGA or VGA), serial ports, mouse, and more. See the
[Documentation](/docs/pcjs/) for details.

+ Excellent IBM hardware compatibility ensures all the original IBM BIOS ROMs operate properly, and that the
machines run at their original speed.  Even obsolete hardware, such as the original PC XT hard disk controller,
is supported.

+ The CPU component is easily configured to emulate an 8088, 80186, 80286, or 80386.  A target speed can also
be specified, and in some cases, even specific CPU *steppings* (including specific errata) can be enabled.

+ Similarly, the FPU (floating-point) component can be configured to emulate an 8087, 80287, or 80387; however,
only 8087 support is complete at this point.

+ The modular design allows you to specify which components to enable, and which external controls
to display for each component. You can choose the size of the display window created by the [Video](/docs/pcjs/video/)
component, add **Halt** or **Speed** buttons to the [CPU](/docs/pcjs/cpu/) component, display clickable "DIP Switches"
for the [Chipset](/docs/pcjs/chipset/) component, or even design your own [Control Panel](/docs/pcjs/panel/).

+ The UI includes a responsive design that tailors itself to your browser and device, and support for touch events
and soft keyboards means you get the best possible emulation experience -- better than any other browser-based
emulator currently available.  It almost feels like your DOS and Windows mouse-based applications have been rewritten
to work with your iPad or iPhone -- almost.  Please note, however, that some mobile devices provide better support than
others.

+ A fully-integrated [Debugger](/docs/pcjs/debugger/) is available.  Disassemble code, set breakpoints on
memory write/read/execution addresses, dump and edit memory, dump disk sectors, enable/disable categories of diagnostic
messages, and view instruction history, cycle counts and more.  The Debugger does not rely on CPU breakpoint
instructions or the trace flag, and does not alter the machine state in any way, allowing you to debug anything,
including 8086 debuggers.

+ Machines created with the [Computer](/docs/pcjs/computer/) *resume* property set will save their entire machine
state using your browser's local storage, so that any changes are preserved when your browser closes, including
disk modifications. Any files you create or modify *inside* the machine will still be there when you return.
TIP: To restore a diskette's original contents, simply press the "Download" button again.

+ Machine states can also be dumped (using the built-in [Debugger](/docs/pcjs/debugger/)), saved as JSON files, and
pre-loaded into a machine, bypassing the normal boot process.  You can even combine a pre-defined state with the
"resume" feature, preserving any changes you make to the machine's original state.

+ Most modern web browsers are supported, including IE (v9.0 and higher), Edge, Safari, Firefox, Chrome and Opera,
and no JavaScript extensions (typed arrays) or third-party libraries are required.  Safari is recommended for iOS
users, Chrome or Firefox for other platforms.

### Future

PCjs has been been steadily evolving for almost 4 years now, in much the same way that the PC architecture evolved,
first with the 8088-based IBM PC in 1981, then with the 80286-based IBM PC AT in 1984, and finally the 80386 and the
first 32-bit PC architecture introduced by COMPAQ in late 1986.

PCjs will remain focused on 1980's era hardware and software, so there are currently no plans to move beyond the
80386.  Some of the PCjs demos do include software from the 1990's (eg, DOS 5.0, Windows 3.x, and Windows 95), but the
project's priority is older software, especially software that is difficult and sometimes impossible to run on newer
hardware.

Some of the features planned for future releases include:

+ Improved FPU compatibility, with accurate cycle counts

+ Improved Video compatibility (eg, custom EGA and VGA fonts)

### History

A more [complete list of releases](https://github.com/jeffpar/pcjs/releases) is on GitHub, but here are some highlights:

+ v1.20 added 8087 coprocessor (FPU) support, [OS/2 improvements](http://www.pcjs.org/blog/2016/02/08/),
and new Disk/Machine [Save Options](http://www.pcjs.org/blog/2016/02/17/).

+ v1.19 improved 80386 compatibility and added support for [Windows 95](http://www.pcjs.org/blog/2015/09/21/).

+ v1.18 added basic 80386 CPU functionality and [COMPAQ DeskPro 386](http://www.pcjs.org/blog/2015/04/16/) emulation.

+ v1.16 added support for [OS/2 1.0](http://www.pcjs.org/blog/2014/12/04/), the Microsoft/IBM multitasking operating
system introduced in December 1987 for 80286-based machines.

+ v1.15 introduced [IBM PC AT](http://www.pcjs.org/blog/2014/09/13/) (Model 5170) emulation.

+ v1.14 added basic [EGA Support](http://www.pcjs.org/blog/2014/07/30/) and the ability to run Windows 1.01
in color.

+ v1.13 introduced manifest files that describe software packages that can be used with PCjs. 
More information on software manifests is available [here](/apps/).

+ v1.12.1 coincided with the first release of the new PCjs web server running on [Node.js](http://nodejs.org).
The new server includes ROM and disk image conversion APIs, as well as a
[Markdown](http://daringfireball.net/projects/markdown/syntax) module that supports link extensions
for embedding C1Pjs and PCjs machine files in Markdown documents and automatically converts "README.md"
files into "index.html" web pages.

+ v1.11 improved the *embedPC()* and *embedC1P()* functions, so now you can embed XML machine configuration files
that reference other configuration files, such as an external [Keyboard](/docs/pcjs/keyboard/) or
[Control Panel](/docs/pcjs/panel/) XML layout.  It does this by building the entire XML configuration internally,
rather than relying on XSLT's *document()* function, which doesn't seem to work in all JavaScript XSLT processors.

+ v1.10 fixed embedding in Internet Explorer 11 (Microsoft removed "MSIE" from their default user-agent string).
The ability to embed multiple PCs on a single web page is now supported as well.

+ v1.08 added soft-keyboard support, which isn't quite finished (sticky-shift and auto-repeat will be added in a future
version), but it's good enough for use on iPads.  Browse [IBM PC Machine Configurations](/devices/pc/machine/) for
machines that include a soft-keyboard.

+ v1.06c added support for user-defined diskette images.  Select "Remote Disk" from the diskette list, click
"Download", and enter a URL at the prompt.  See **Creating PCjs-Compatible Disk Images** in the
[PCjs Documentation](/docs/pcjs/) for more information about supported disk images.

+ v1.05b added support for webkitAudioContext, bringing your simulated IBM PC's speaker to life. Relive the thrill
of running MUSIC.BAS and listening to those classic tunes.  *Sound support is still experimental*.
