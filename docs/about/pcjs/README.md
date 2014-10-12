About PCjs
---

PCjs is a IBM PC and PC XT simulator written entirely in JavaScript.  It's designed to load and run extremely
fast, it works well in all modern web browsers (both desktop and mobile), and it's easy to customize.  It is part of
the [PCjs Project](https://github.com/jeffpar/pcjs), an open source project on [GitHub](http://github.com/).

Check out the [Demos](/#demos) on the home page, and all the other PCjs [Application](/apps/pc/), [Boot Disk](/disks/pc/)
and [Machine](/configs/pc/machines/) demos, including an IBM PC XT "[Server Array](/configs/pc/machines/5160/cga/256kb/array/)"
featuring multiple PCs running side-by-side.

### Features

+ Build your own IBM PC and IBM PC XT simulations using simple XML machine configuration files.
You decide how much RAM you want, how many disk drives, which disk images to include (and which should be
pre-loaded), what kind of video adapter (MDA, CGA or EGA), serial ports, mouse, and more. See the
[Documentation](/docs/pcjs/) for details.
+ The modular design allows you to specify which components to enable, and which external controls
to display for each component. You can choose the size of the display window created by the [Video](/docs/pcjs/video/)
component, add **Halt** or **Speed** buttons to the [CPU](/docs/pcjs/cpu/) component, display clickable "DIP Switches"
for the [Chipset](/docs/pcjs/chipset/) component, or even design your own [Control Panel](/docs/pcjs/panel/).
+ A fully-integrated [Debugger](/docs/pcjs/debugger/) is available.  Disassemble code, set breakpoints on
memory write/read/execution addresses, dump and edit memory, dump disk sectors, enable/disable categories of diagnostic
messages, and view instruction history, cycle counts and more.  The Debugger does not rely on CPU breakpoint
instructions or the trace flag, and does not alter the machine state in any way, allowing you to debug anything,
including 8086 debuggers.
+ Machines created with the [Computer](/docs/pcjs/computer/) *resume* attribute set will save their entire machine
state using your browser's local storage, so that any changes are preserved when your browser closes, including
disk modifications. Any files you create or modify *inside* the machine will still be there when you return.
TIP: To restore a diskette's original contents, simply press the "Load" button again.
+ Machine states can also be dumped (using the built-in [Debugger](/docs/pcjs/debugger/)), saved as JSON files, and
pre-loaded into a machine, bypassing the normal boot process.  You can even combine a pre-defined state with the
"resume" feature, preserving any changes you make to the machine's original state.
+ Most modern web browsers are supported, including IE (v9.0 and higher), Safari, Firefox, Chrome and Opera, and no
JavaScript extensions (typed arrays) or third-party libraries are required.  Safari is recommended for iOS users,
Chrome or Firefox for other platforms.

### Future

More hardware support is targeted for version 1.15, including:

+ Complete EGA emulation
+ 80286 CPU emulation
+ PC AT hardware emulation

Limited EGA emulation is currently available as of version 1.14.

### History

+ v1.15 introduced PC AT (Model 5170) emulation, as discussed on our [Blog](/blog/2014/09/13/).
+ v1.14 introduced limited EGA emulation, as discussed on our [Blog](/blog/2014/07/30/).
+ v1.13 introduced manifest files that describe software packages that can be used with PCjs. 
More information on software manifests is available [here](/apps/).
+ v1.12.1 coincided with the first release of the new PCjs web server running on [Node.js](http://nodejs.org).
The new server includes ROM and disk image conversion APIs, as well as a [Markdown](http://daringfireball.net/projects/markdown/syntax)
module that supports link extensions for embedding C1Pjs and PCjs machine files in **JSMachines** README.md documents
and automatically converts them into web pages.
+ v1.11 improved the *embedPC()* and *embedC1P()* functions, so now you can embed XML machine configuration files
that reference other configuration files, such as an external [Keyboard](/docs/pcjs/keyboard/) or
[Control Panel](/docs/pcjs/panel/) XML layout.  It does this by building the entire XML configuration internally,
rather than relying on XSLT's *document()* function, which doesn't seem to work in all JavaScript XSLT processors.
+ v1.10 fixed embedding in Internet Explorer 11 (Microsoft removed "MSIE" from their default user-agent string).
The ability to embed multiple PCs on a single web page is now supported as well.
+ v1.08 added soft-keyboard support, which isn't quite finished (sticky-shift and auto-repeat will be added in a future
version), but it's good enough for use on iPads.  Browse [IBM PC Machine Configurations](/configs/pc/machines/) for
machines that include a soft-keyboard.
+ v1.06c added support for user-defined diskette images.  Select "User-defined URL..." from the diskette list and click
"Load".  See **Creating PCjs-Compatible Disk Images** in the [PCjs Documentation](/docs/pcjs/) for more information
about supported disk images.
+ v1.05b added support for webkitAudioContext, bringing your simulated IBM PC's speaker to life. Relive the thrill
of running MUSIC.BAS and listening to those classic tunes.  *Sound support is still experimental*.
