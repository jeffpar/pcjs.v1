---
layout: page
title: "Q12243: No Error Listing File in QB 2.00; Error-Only File in 2.01/3.00"
permalink: /pubs/pc/reference/microsoft/kb/Q12243/
---

## Q12243: No Error Listing File in QB 2.00; Error-Only File in 2.01/3.00

	Article: Q12243
	Version(s): 2.00 2.01 3.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 19-OCT-1989
	
	QuickBASIC Version 2.00 cannot list compiler errors to a file when
	compiling from the DOS command line (outside the QB.EXE editor) (see
	"Separate Compilation Method" in Appendix D of the "Microsoft
	QuickBASIC Compiler" Version 2.0 and 3.0 manual). This means that all
	debugging must be done in the QB.EXE Version 2.00 editor.
	
	In contrast, earlier versions of QuickBASIC (1.00, 1.01, and 1.02)
	give a listing (.LST) file that includes all source lines and flags
	those lines that have errors.
	
	Versions 2.01 and 3.00 have enhanced the Separate Compilation Method
	so that you can redirect compiler error messages to a file or device.
	If you compile from a DOS batch (.BAT) file, this feature allows you
	to automatically report the errors to an output file. For example:
	
	   Command Line               Action
	   ------------               ------
	
	   QB TEST.BAS;               Compile TEST.BAS and display any errors
	                              encountered on the screen.
	
	   QB TEST.BAS; > TEST.LST    Compile TEST.BAS and redirect any error
	                              messages generated to the file TEST.LST.
	
	   QB TEST.BAS; > PRN         Redirects output to the DOS printer device.
	
	Only the lines in error and their associated error messages are sent
	to the screen or output file in 2.01 and 3.00. Source lines that don't
	have errors aren't listed.
	
	As there is no full-source-listing (.LST) output feature in QuickBASIC
	Versions 2.00, 2.01, and 3.00, there is also no compiler /A option to
	output the assembler translation of the BASIC code. The compiler /A
	option is supported only in QuickBASIC Versions 1.00, 1.02, 1.02,
	4.00, 4.00b, and 4.50.
