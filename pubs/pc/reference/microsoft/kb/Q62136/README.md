---
layout: page
title: "Q62136: EXE2BIN.EXE File Does Not Come with PC-DOS 3.30, 4.00 and 4.01"
permalink: /pubs/pc/reference/microsoft/kb/Q62136/
---

## Q62136: EXE2BIN.EXE File Does Not Come with PC-DOS 3.30, 4.00 and 4.01

	Article: Q62136
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 29-MAY-1990
	
	Page 19 of the "Microsoft Macro Assembler 5.1 Programmer's Guide"
	incorrectly states that "(EXE2BIN.EXE file) is not included in the
	Macro Assembler package, but it does come with the MS-DOS and PC-DOS
	operating systems." The Macro Assembler package comes with MS-DOS,
	but does not come with PC-DOS versions 3.30, 4.00, and 4.01.
	
	The following is an example:
	
	   EXE2BIN comes with:    Works with:         Does not work with:
	   -------------------    ----------          -------------------
	
	   1. MS-DOS 3.30         MS-DOS 3.30         MS-DOS 4.00 & 4.01
	                          PC-DOS 3.30         PC-DOS 4.00 & 4.01
	
	   2. MS-DOS 4.40 & 4.41  MS-DOS 4.00 & 4.01  MS-DOS 3.30
	                          PC-DOS 4.00 & 4.01  PC-DOS 3.30
	
	      Note: You will get the message "Incorrect DOS version."
	
	The EXE2BIN.EXE files that come with MS-DOS versions 4.00 and 4.01 are
	identical. They have been tested by using the COMP command.
