---
layout: page
title: "Q66513: Memory Requirements for Real-Mode CodeView (CV.EXE)"
permalink: /pubs/pc/reference/microsoft/kb/Q66513/
---

## Q66513: Memory Requirements for Real-Mode CodeView (CV.EXE)

	Article: Q66513
	Version(s): 3.00 3.10 3.11 | 3.00 3.10 3.11
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 11-NOV-1990
	
	Real-mode versions of CodeView (CV) beginning with version 3.00 offer
	a number of ways to utilize available memory in order to make the
	greatest amount of conventional memory available to the program being
	debugged. The amount of memory actually used depends on the
	command-line options specified as well as the configuration of the
	system used for debugging.
	
	The following table shows the size of CodeView in standard DOS memory
	with each of the memory-specific command-line options (see the "More
	Information" section below for further details):
	
	   Option  RAM Usage                   Option  RAM Usage
	   ------  ---------                   ------  ---------
	
	    /X       16K                       /D16     210K
	    /E      192K                       /D32     225K
	    /D      256K (same as /D64)        /D128    320K
	
	The following descriptions of the three memory-related CodeView
	options explain the ways in which each option affects memory
	utilization in addition to the respective amounts of conventional
	memory that CodeView requires with each. (This information pertains
	only to CodeView versions 3.00 and later -- versions of CodeView
	earlier than 3.00 require approximately 230K of RAM specifically for
	CodeView.)
	
	/X - Specifies that CodeView should utilize extended memory. Assuming
	     that enough extended memory is available, this option moves both
	     the symbolic information and most of CV itself into extended
	     memory. Allowing CV to be loaded into high memory requires that
	     approximately 16K to 19K of "control" code remain in conventional
	     memory, thus all free conventional RAM over 19K is available to
	     load the program to be debugged (the "debuggee").
	
	/E - Specifies that CodeView should utilize expanded memory. Assuming
	     that enough expanded memory is available, this option moves both
	     the symbolic information and CodeView's own overlays into
	     expanded memory. The size of the CV "root" without the extra
	     overlayed code is approximately 192K. Since the overlays do not
	     cause any additional overhead with /E, all free conventional RAM
	     over 192K is available to load the debuggee.
	
	/D - Specifies that CodeView should utilize disk overlays in
	     conventional memory. By default, this option creates a 64K buffer
	     area for loading disk overlays. With the 192K root, the 64K
	     buffer means CV will take about 256K of conventional memory with
	     /D. In addition, the symbolic information must also be loaded
	     into conventional memory; therefore, since symbolic data varies
	     with each program, it is not possible to specify the amount of
	     memory available for the debuggee alone.
	
	     The /D option can also be specified with a value that indicates
	     the size of the overlay buffer area. This parameter can be any
	     value from 16 to 128, which represents an overlay buffer size
	     from 16K to 128K. Specifying /D16 will minimize CodeView's size
	     with disk overlays to approximately 210K. This maximizes the
	     amount of conventional memory that will be available to load the
	     debuggee and the symbolic information. At the other extreme,
	     /D128 causes CV to use approximately 320K of conventional RAM.
	     This provides faster CodeView execution speed, but it will only
	     work with smaller debuggees.
	
	Note: CodeView will default to the best memory usage possible. In
	other words, if NO memory usage option is specified, CV will try to
	use extended memory. If extended memory is unavailable, CV looks for
	expanded memory. CV will use disk overlays on its own only if expanded
	memory is not found.
