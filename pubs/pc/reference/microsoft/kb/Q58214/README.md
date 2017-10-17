---
layout: page
title: "Q58214: Error 53 (&quot;File Not Found&quot;) Using FILES &quot;filespec&quot; Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q58214/
---

## Q58214: Error 53 (&quot;File Not Found&quot;) Using FILES &quot;filespec&quot; Statement

	Article: Q58214
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900126-95 B_BasicCom B_GWBasicI docerr
	Last Modified: 31-JAN-1990
	
	The FILES "filespec" statement prints the names of the files residing
	on the specified disk. However, the manual doesn't mention that if the
	"filespec" parameter does not describe any current filenames, an error
	53 ("File Not Found") is returned. Unless this error is trapped,
	program execution is halted.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS; to Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2; to
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2; and to Microsoft GW-BASIC Interpreter Versions
	3.20, 3.22, and 3.23 for MS-DOS.
	
	When a FILES statement is used to list the files in a specific
	directory and the pattern that FILES is searching for does not exist,
	an error 53 ("File Not Found") is returned.
	
	If the error is not trapped by the program, the error message "File
	Not Found" is displayed in the interpreter environment. In executable
	programs, the message displayed is "File Not Found In Module
	[Filename] at SEG:OFF," where SEG:OFF represents the segment and the
	offset from that segment of code where the error happened.
	
	To avoid halting the program, the program needs only to trap the error
	53 that is returned to the program. The program examples below
	demonstrate this, assuming that a file named ABC.XYZ does not exist on
	the root directory of drive C.
	
	Example for Compiled BASICs -- BASPROG.BAS
	------------------------------------------
	
	   ON ERROR GOTO ErrorHandle
	   FILES "c:\abc.xyz"
	   END
	   ErrorHandle:
	      IF ERR = 53 THEN PRINT "Error 53 was trapped. File not found."
	   RESUME NEXT
	
	You can compile and link BASPROG.BAS as follows in QuickBASIC 4.00,
	4.00b, or 4.50, BASIC compiler 6.00 or 6.00b, or BASIC PDS 7.00:
	
	   BC /x Basprog;
	   LINK Basprog;
	
	Use QB /x Basprog in QuickBASIC Versions 2.00, 2.01, 3.00.
	
	Use BASCOM /x Basprog in QuickBASIC Versions 1.00, 1.01, 1.02.
	
	Example for GW-BASIC Interpreter
	--------------------------------
	
	   10 ON ERROR GOTO 999
	   20 FILES "c:\abc.xyz"
	   30 END
	   999  IF ERR = 53 THEN PRINT "Error 53 was trapped. File not found."
	   1000 RESUME NEXT
