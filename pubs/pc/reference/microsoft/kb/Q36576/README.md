---
layout: page
title: "Q36576: CTRL+Z Embedded in Source Truncates BC.EXE Compilation"
permalink: /pubs/pc/reference/microsoft/kb/Q36576/
---

## Q36576: CTRL+Z Embedded in Source Truncates BC.EXE Compilation

	Article: Q36576
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 20-JUL-1990
	
	The QB.EXE versions 4.00, 4.00b, and 4.50 editors allow you to embed
	control characters into a source file by pressing CTRL+P followed by
	CTRL+<desired key>. This is mentioned in a table on Page 135 of the
	"Microsoft QuickBASIC 4.0: Learning and Using" manual for versions
	4.00 and 4.00b, and on Page 204 of the "Microsoft QuickBASIC 4.5:
	Learning to Use" manual for version 4.50.
	
	When using this technique, do not type CTRL+Z into the source file if
	the file is saved as text. For a file saved as text, CTRL+Z marks the
	end of the file (EOF) for BC.EXE and other Microsoft compilers. (This
	feature is a carryover from the end-of-file standard required for text
	files in MS-DOS versions 1.x.) You must save in fast load format for
	BC.EXE to accept embedded CTRL+Z characters.
	
	A CTRL+Z byte appears on the screen as a right-arrow symbol. To print
	a right-arrow symbol on the screen, use the statement PRINT CHR$(26)
	instead of embedding a CTRL+Z in a string constant.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC Professional
	Development System (PDS) version 7.00 for MS-DOS and MS OS/2.
	
	BC.EXE stops compiling text source files when it reaches a CTRL+Z
	(ASCII value 26) byte. The program below demonstrates this behavior
	and terminates BC.EXE with a "Label Not Defined" error message.
	
	GOSUB lab
	PRINT "Here is a right-arrow character:"
	PRINT "[Press CTRL+P followed by CTRL+Z here in the QB.EXE 4.00 editor.]"
	END
	lab: PRINT "Test"
	RETURN
	
	The following equivalent program compiles successfully in BC.EXE:
	
	GOSUB lab
	PRINT "Here is a right-arrow character:"
	PRINT CHR$(26)
	END
	lab: PRINT "Test"
	RETURN
