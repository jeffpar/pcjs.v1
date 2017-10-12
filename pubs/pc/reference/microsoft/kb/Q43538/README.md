---
layout: page
title: "Q43538: NMAKE Example Incorrect in QuickC Manual; Should Be Lowercase"
permalink: /pubs/pc/reference/microsoft/kb/Q43538/
---

	Article: Q43538
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 2-MAY-1989
	
	The example given on Page 169 of the "Microsoft QuickC Tool Kit
	Version  2.0" is
	incorrect: the inference rule is ignored because its dependent (.OBJ)
	is not in the .SUFFIXES list. (NMAKE is case sensitive and will not
	match ".OBJ" to ".obj".)
	
	To correct this example, put the entire example in lowercase letters.
	
	Please note that the inference rule given on Page 168 of the same
	manual makes the same mistake. This example should also be in all
	lowercase letters.
	
	If NMAKE is invoked on this example with no switches, no diagnostics
	are given; however, the command is not performed. To reveal the
	problem, invoke NMAKE with the /p switch, which will yield the
	following message:
	
	   NMAKE : warning U4017: Ignoring rule .OBJ.EXE
	                          (extension not in .SUFFIXES)
	
	Another workaround is to append .OBJ to the suffixes list by placing
	the following pseudotarget at the top of the NMAKE description file:
	
	   .SUFFIXES: .OBJ
