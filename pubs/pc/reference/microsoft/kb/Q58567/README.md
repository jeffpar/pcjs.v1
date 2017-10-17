---
layout: page
title: "Q58567: Any EGA/VGA Video RAM Above 256K Not Usable in Compiled BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q58567/
---

## Q58567: Any EGA/VGA Video RAM Above 256K Not Usable in Compiled BASIC

	Article: Q58567
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900201-17 B_BasicCom
	Last Modified: 13-FEB-1990
	
	Any RAM above 256K on an EGA or VGA video card cannot be used to store
	screen pages during the execution of a compiled BASIC program.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS, and to Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS.
	
	These compilers are compatible with video cards that conform to the
	IBM standard. Accessing video RAM above 256K is not part of this
	standard.
	
	For example, when reading the documentation on the SCREEN statement in
	either the manuals or online Help included with the above products, it
	may appear that more than 2 pages of screen memory are available to a
	512K VGA card operating in screen mode 9. Footnote 2 on the bottom of
	Page 314 of the "Microsoft BASIC 7.0: Language Reference" manual
	states the following:
	
	   Pages = Screen memory divided by page size. Eight page maximum,
	           one page minimum.
	
	The page size of screen 9 for VGA is 128K. Applying the above formula,
	we get the following:
	
	   Pages = 512K / 128K = 4 pages
	
	However, 4 pages is incorrect because all the memory above 256K on
	the VGA card is not usable. Therefore, the maximum number of pages is
	as follows:
	
	   Pages = 256K / 128K = 2 pages
