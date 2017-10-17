---
layout: page
title: "Q51416: How to Use Link Overlays in BASIC PDS 7.00 and 7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q51416/
---

## Q51416: How to Use Link Overlays in BASIC PDS 7.00 and 7.10

	Article: Q51416
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891017-94 S_LINK
	Last Modified: 5-SEP-1990
	
	When using the linker (LINK.EXE) to generate code overlays for
	Microsoft BASIC Professional Development System (PDS) version 7.00 or
	7.10 under MS-DOS, you must put the modules you want to overlay in
	parentheses on the LINK command line. The modules that make up one
	overlay must be compiled with the same switches. Code is the only part
	of the program that is overlaid. Data is not overlaid. Examples and
	further restrictions for using linker overlays are given below.
	
	This information applies to Microsoft BASIC PDS versions 7.00 and 7.10
	for MS-DOS (but does NOT apply to earlier BASIC compiler versions).
	
	Note that link overlays are not needed and not supported under OS/2
	protected mode, since OS/2 itself automatically provides a similar
	feature to support swapping of very large .EXE programs in OS/2's
	extended and virtual memory.
	
	The following is an example of how to produce code overlays
	
	   LINK test1+(test2+test3)+test4+(test5)+(test6),TEST1.EXE,TEST1.MAP;
	
	where the following apply:
	
	1. test1 (TEST1.OBJ) is the main module.
	
	2. test2 and test3 (TEST2.OBJ and TEST3.OBJ) are separately compiled
	   modules that make up one overlay.
	
	3. test4 (TEST4.OBJ) stays resident in memory along with the main
	   module (test1) at run time and is not swapped out of memory to disk.
	
	4. test5 and test6 (TEST5.OBJ and TEST6.OBJ) are two separate overlays.
	
	5. TEST1.EXE is the executable overlaid program created by this LINK.
	
	6. TEST1.MAP is a text file (created by the above LINK) that tells
	   you the code sizes of all overlays and procedures.
	
	To invoke an overlay, you call a SUB or FUNCTION in a module contained
	in that overlay, and the Overlay Manager automatically moves the
	overlay (if it is not already loaded) into DOS memory, overlaying any
	previous overlay in memory.
	
	You can call any module or overlay from any other module or overlay.
	
	Overlays provide an alternative to CHAINing when a program is too
	large to fit into memory all at once. An overlaid program is made up
	of a single .EXE file (which can be an advantage in some cases),
	unlike CHAINed programs, which are composed of several .EXE files.
	
	Restrictions on Using Overlays
	------------------------------
	
	The restrictions on using overlays in Microsoft BASIC PDS versions
	7.00 and 7.10 for MS-DOS are as follows:
	
	1. Each Microsoft BASIC overlay cannot exceed 256K in code (see LINK
	   .MAP for size of each overlay). You can have up to 64 overlays
	   per .EXE program. This means you may be able to make .EXE programs
	   up to 16 MB in code size under MS-DOS.
	
	2. The main module must be the first module in the LINK command line,
	   and it must NOT be specified as an overlay. If you incorrectly make
	   the first module in the LINK command line an overlay, the machine
	   will hang when the program first loads.
	
	3. When you create an overlaid version of a program, make sure that
	   each module contained in the program is compiled with the same
	   options.
	
	4. You cannot use the LINK /PACKCODE or /EXEPACK option when linking a
	   program that uses overlays.
	
	5. You cannot have a stub file as an overlay. Do not specify stub
	   files (NOxxx.OBJ) in the parentheses for link overlays, or the
	   program will hang. Stub files may only be specified outside
	   parentheses in the LINK command line.
	
	Using Expanded Memory with Overlays
	-----------------------------------
	
	386Max (386MAX.SYS) from Qualitas, Inc. is an example of an expanded
	memory driver that can be used with BASIC PDS 7.00 and 7.10. BASIC PDS
	7.00 and 7.10 require an expanded memory driver that uses the
	Lotus-Intel-Microsoft (LIM) version 4.0 Expanded Memory Specification
	(EMS).
	
	If you have loaded an expanded memory driver, and if all the overlays
	can fit together at one time in expanded memory, and if each overlay
	has less than 64K of code, then overlays are loaded from expanded
	memory. Otherwise, overlays are swapped from disk, which is slower
	than loading from expanded memory.
	
	Assume that the overlaid program satisfies the above conditions for
	using expanded memory. Note that the overlaid modules are not loaded
	when the EXE file is first invoked. They remain on disk until the
	first overlay is called. When this occurs, all the overlaid modules
	are loaded at once from disk into expanded memory. From then on, the
	overlays are swapped from expanded memory into DOS memory, and the
	disk is no longer used for loading overlays.
	
	The overlay manager in BASIC 7.00 and 7.10 requests expanded memory in
	16K pages (blocks). The overlay manager only knows the size of the
	largest overlay, and must make a "best guess" at the size of the
	smaller overlays. When the overlay manager estimates how many 16K
	pages are necessary to hold all overlays at once in expanded memory,
	the estimate could be over or under the actual number of pages needed.
	If your overlays are all between 16K and 64K in size (according to the
	LINK .MAP file), and if the estimated or actual size of all overlays
	together exceeds the available expanded memory, the following
	initialization error occurs when the first overlay is called at
	run-time:
	
	   Insufficient EMS to load overlays
	
	Note: This error is documented on Page 656 of the "Microsoft BASIC
	7.0: Language Reference" manual for versions 7.00 and 7.10. You will
	never see this error if all your overlays are smaller than 16K each.
	
	If you want to force loading overlays from disk, thus avoiding the
	possibility of this overlay initialization error in expanded memory,
	you must link with the stub file NOEMS.OBJ (with no parentheses around
	NOEMS.OBJ on the LINK command line). Alternatively, you can try
	reconfiguring expanded memory so more of it is available for BASIC
	overlays. Another alternative is to make overlays similar in size.
	
	DOS Memory Map When Using Overlaid .EXE Program
	------------------------------------------------
	
	[Low Memory]
	
	* MS-DOS.
	* Main program and non-overlaid modules.
	* Contiguous overlay memory area, equal to the size of biggest overlay.
	* DGROUP (default data segment, which is shared by all routines).
	* Far heap (dynamic non-variable-length-string arrays).
	* BASIC's run-time support module if .EXE not compiled stand-alone (BC /O)
	
	[High Memory]
	
	For more information on using overlays, see the section "Linking with
	Overlays" on Pages 612-614 in the "Microsoft BASIC 7.0: Programmer's
	Guide."
