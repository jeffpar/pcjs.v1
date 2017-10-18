---
layout: page
title: "Q51751: Generating .COM Files with QuickAssembler Can Cause Link Error"
permalink: /pubs/pc/reference/microsoft/kb/Q51751/
---

## Q51751: Generating .COM Files with QuickAssembler Can Cause Link Error

	Article: Q51751
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 17-JAN-1990
	
	The QuickC Version 2.01 compiler (i.e., QuickAssembler) can and will
	generate .COM files for assembly language programs. Current support
	for the TINY model (.COM files) is not extended to C programs. Thus,
	the program must be in assembly language source code, not in C source
	code.
	
	Both the assembler and linker in QuickC 2.01 support the TINY memory
	model. The C module does not support the TINY memory model.
	
	The information contained in the README.DOC, Part 5, Subsection 386,
	states the following:
	
	   "...the following command lines each produce a file with a .COM
	    extension:
	
	      QCL /AT sample.asm /link /TINY
	      QCL /Fesample.com sample.asm /link /TINY  ..."
	
	The second command successfully generates a .COM file, but the first
	command generates the following error message:
	
	   LINK: fatal error L1093: CRTCOM.OBJ: object not found
	
	Typing the following also generates the same error message:
	
	   qcl /AT sample.asm
	
	The following are four ways to correctly generate a .COM file:
	
	1. Type the following as listed in the README.DOC.:
	
	      QCL /Fesample.com sample.asm /link /TINY
	
	2. Type the following:
	
	      qcl /AT /c sample.asm
	
	   Then, type the following:
	
	      link /TINY sample.obj
	
	3. Through the menu options in the environment, make the following
	   selections:
	
	      Options.Make.Linker_Flags.Global_Flags.Generate .COM file
	
	   Note: Full menus must be activated and then Options.Make.
	   Linker_Flags.Debug_Flags.Incremental_Link must be disabled.
	
	4. Type the following:
	
	      QCL sample.asm /link /TINY
	
	   This creates a sample.EXE file that is actually in the .COM format.
	   It should be renamed immediately to SAMPLE.COM. This method is also
	   correctly listed in the README.DOC.
	
	Note: The source code must also contain the ".MODEL tiny" directive
	for all of the above methods.
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
