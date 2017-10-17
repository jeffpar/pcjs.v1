---
layout: page
title: "Q35261: Macro to Print Part or All of a File from within M"
permalink: /pubs/pc/reference/microsoft/kb/Q35261/
---

## Q35261: Macro to Print Part or All of a File from within M

	Article: Q35261
	Version(s): 1.00  1.02 | 1.00 1.02
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER |
	Last Modified: 21-AUG-1989
	
	Microsoft Editor Version 1.00 contains no built-in primitives for
	printing; there is no actual "print" command. However, a set of steps
	can be performed involving the shell function, and a macro can be
	written to execute the steps conveniently. The 1.02 version of the
	Microsoft Editor does contain a print function. For more information
	on Version 1.02's print function, please see Section 4.9, "Printing a
	File," in the "Microsoft Editor User's Guide for MS OS/2 and MS-DOS
	Operating Systems."
	
	The following is a sample macro for the 1.00 Editor:
	
	   print1:=copy arg "<clipboard>" setfile
	   print2:=arg arg "PRINT.TMP" setfile
	   print3:=arg "print PRINT.TMP" shell
	   print4:=arg "del PRINT.TMP" shell setfile
	   print:=print1 print2 print3 print4
	
	Note: The DOS PRINT command is a resident program. If you shell out of
	M and invoke the PRINT command for the first time, PRINT will be
	loaded above M and you will fragment memory. To prevent this, invoke
	the PRINT command before entering M, so that it will be loaded into
	low memory.
	
	The following explains the above example:
	
	1. copy: This copies the currently selected region into the
	   clipboard. This way, you can select a region, using a boxarg or
	   linearg, and then execute this macro to print it. Because the
	   selected region defines what is to be printed, it can be modified
	   to suit your needs.
	
	2. arg "<clipboard>" setfile: This loads the <clipboard> pseudo file
	   as the current file.
	
	3. arg arg "PRINT.TMP" setfile: This saves the contents of the current
	   file (which is now <clipboard>) to the file PRINT.TMP.
	
	4. arg "print PRINT.TMP" shell: This executes a DOS shell that prints
	   PRINT.TMP.
	
	5. arg "del PRINT.TMP" shell setfile: This executes a DOS shell that
	   deletes PRINT.TMP, then uses Setfile to return to the original file.
