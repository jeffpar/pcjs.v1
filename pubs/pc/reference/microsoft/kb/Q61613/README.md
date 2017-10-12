---
layout: page
title: "Q61613: /Lp, /Lr, and /Lc Functions Are Documented Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q61613/
---

	Article: Q61613
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 29-MAY-1990
	
	In Section 14.2.1, "The Link Mode Options /Lp, /Lr, and /Lc," on Page
	353 of the "Microsoft C Advanced Programming Techniques" manual, it
	incorrectly states the following:
	
	   When you use the /Lx options, you instruct the compiler to override
	   the default library name in the object module's library search
	   record and to substitute the mode-specific combined library name.
	
	The correct function of the /Lx options is to simply change the
	library options that CL sends to the linker.
	
	For instance, if you call CL.EXE with /Lr, the following link options
	will be passed to the linker:
	
	   /NOD:xLIBCE.LIB xLIBCER.LIB
	
	Note that "x" is a letter indicating the memory model. The /Lx options
	have no effect on the compiler portion of the CL program.
