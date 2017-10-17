---
layout: page
title: "Q36808: Line Number 65,529 Is the Maximum Supported by QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q36808/
---

## Q36808: Line Number 65,529 Is the Maximum Supported by QuickBASIC

	Article: Q36808
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 3-MAY-1989
	
	The maximum allowed line number is 65,529; therefore, line numbers
	above 65,529 should not be used. Descriptive line labels can be used
	as a substitute.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, and to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2.
	
	If a block IF THEN ENDIF statement begins on a line with a line number
	greater than 65,539, BC.EXE will produce a "Must be first statement on
	the line" error message. The program will run properly inside the
	environment. Also, BC.EXE will NOT produce the error if the source
	file is saved as text rather than in Fast Load format.
	
	The sample program below will work properly inside the editing
	environment. However, if the program is saved using the Fast Load
	format and compiled using BC.EXE, the error message "Must be first
	statement on line" is produced on line 79,000. Also, the END IF
	statement will generate a "END IF without block IF" error message.
	
	If the file is saved in text format, BC.EXE compiles the program
	correctly. Also, if the line number is changed to a number less than
	65,540, the program will compile, regardless of the save format.
	
	The following is a code example:
	
	GOSUB 79000
	END
	79000  IF x < 0 THEN   ' This line causes the error in BC.EXE
	        BEEP
	       END IF
	RETURN
