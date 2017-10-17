---
layout: page
title: "Q59890: Minimum Extended Memory (384K) Causes CV 3.00 to Use Extra RAM"
permalink: /pubs/pc/reference/microsoft/kb/Q59890/
---

## Q59890: Minimum Extended Memory (384K) Causes CV 3.00 to Use Extra RAM

	Article: Q59890
	Version(s): 3.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr HIMEM
	Last Modified: 27-SEP-1990
	
	Real-mode CodeView (CV) Version 3.00 is documented as being able to
	run in extended memory as long as there is at least 384K of extended
	memory available. This 384K minimum is accurate as far as CV being
	able to utilize the extended memory, but it is not enough for CodeView
	to remove all of itself from conventional RAM. In fact, a system
	configuration with only 384K extended memory will result in LESS
	memory being available for the debuggee (the program being debugged)
	than if no extended memory is utilized at all.
	
	The CodeView 3.00 documentation states that "if HIMEM.SYS or another
	extended-memory driver is installed, all but 16K of CodeView, plus all
	of the symbolic information for the program you are debugging, are
	placed in extended memory." But, for CodeView to truly work with this
	16K "footprint" in conventional memory, a minimum of approximately
	600K extended memory must be available.
	
	When no extended memory is available, CodeView normally utilizes
	overlays to keep as much of itself out of memory as possible, so that
	the debuggee can have more space to load. (The new /Dnnn option
	actually allows you to specify the size of the overlays -- a bigger
	overlays means CV runs faster, but a smaller overlays mean a bigger
	program can be loaded for debugging.)
	
	Once CodeView detects extended memory, it assumes that overlays are no
	longer needed, since CV itself and the debuggee's symbolic information
	will both (supposedly) be loaded into extended memory. However, the
	result may be that CodeView seems to get bigger because what Codeview
	can't fit into extended memory is loaded into conventional memory.
	
	Since no overlays are used, this can result in a much larger
	footprint. For instance, if the minimum of 384K extended memory is all
	that is available, then the footprint will be well over 200K.
	Obviously, as the amount of extended memory is increased from 384K,
	the footprint will shrink accordingly.
	
	The /X command-line option instructs CodeView to use extended memory.
	However, CV will automatically detect extended memory and use it if it
	is available. Consequently, if the /X option is not specified, CodeView
	will still use extended memory.
	
	Thus, if you have a limited amount of extended memory and decide to
	run CodeView in conventional RAM only, you have two options. You can
	explicitly specify /D (for example, /D16) to tell CodeView to use
	overlays, or you can remove (or comment out) the line in your
	CONFIG.SYS file that loads the extended memory driver (HIMEM.SYS) and
	reboot.
