---
layout: page
title: "Q33046: QB.EXE Editor Deletes File if Saved with Insufficient Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q33046/
---

## Q33046: QB.EXE Editor Deletes File if Saved with Insufficient Memory

	Article: Q33046
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 11-DEC-1989
	
	If you attempt to save the current file in the QuickBASIC editor and
	there is no memory available, the file will be deleted.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and the version of QuickBASIC provided with the BASIC
	compiler Versions 6.00 and 6.00b (buglist6.00, buglist6.00b) for
	MS-DOS and MS OS/2. This problem was corrected in QuickBASIC Version
	4.50 and QBX.EXE of the Microsoft BASIC Compiler Version 7.00
	(fixlist7.00).
	
	The following steps duplicate the problem:
	
	1. Enter QuickBASIC.
	
	2. Enter the following program:
	
	      x=setmem(0)
	      y=setmem(-x)
	
	3. Save the file.
	
	4. Run the program.
	
	5. Try to modify the program; you will receive an out of memory error.
	
	6. Try to save the file; you will receive an out of data space error.
	
	7. Leave QuickBASIC.
	
	8. The file will no longer be present; however, it usually can be
	   "unerased" with Norton's Utilities.
