---
layout: page
title: "Q47167: Cannot Access LINK.EXE: Retry Does Not Retry Another Floppy"
permalink: /pubs/pc/reference/microsoft/kb/Q47167/
---

	Article: Q47167
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickAsm ILINK buglist2.00 buglist2.01
	Last Modified: 26-JAN-1990
	
	Problem:
	
	When I am compiling and linking from floppy drives, there are times
	when QuickC does not find the linker (LINK or ILINK). When this
	happens, I get an error with the option to RETRY. If I then switch
	floppies, placing the proper version of the linker in the drive, the
	error does not go away.
	
	Response:
	
	Microsoft has confirmed this to be a problem with QuickC Version 2.00
	and with QuickAssembler Version 2.01. We are researching this problem
	and will post new information as it becomes available.
	
	There are two ways, however, that you can work around this
	problem. Your first option is to wait until the error appears, choose
	CANCEL, insert the proper floppy disk, and then choose BUILD PROGRAM
	from the MAKE menu. Because the .OBJ file is up-to-date, QuickC will
	not try to recompile, but will go directly to the link stage. With the
	new disk in the drive, QuickC will find the linker without a problem.
	
	To avoid the error completely, compile and link in two stages. This
	means selecting the MAKE menu and then the COMPILE FILE option. After
	the file compiles without errors, place the linker floppy disk in the
	proper drive. Next, choose the BUILD PROGRAM option from the MAKE
	menu. This is similar to the above procedure but will not generate
	the error message because the linker is not searched for until the
	BUILD PROGRAM option is selected.
