---
layout: page
title: "Q41533: BASIC 7.00 Can Return Exit Code (Error Level) to Batch File"
permalink: /pubs/pc/reference/microsoft/kb/Q41533/
---

## Q41533: BASIC 7.00 Can Return Exit Code (Error Level) to Batch File

	Article: Q41533
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI SR# S890216-141
	Last Modified: 4-SEP-1990
	
	MS-DOS batch processing (.BAT) files can use an "IF ERRORLEVEL n"
	statement to detect exit code levels returned by some programs.
	
	However, the only versions of Microsoft BASIC that allow a program to
	return an error level code to MS-DOS are Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10. The END n or STOP n
	statement returns error level n to the batch file that invoked the
	BASIC 7.00 or 7.10 .EXE program. The IF ERRORLEVEL n statement in the
	batch file can detect if the returned exit code is equal to or greater
	than n.
	
	In all other versions of Microsoft BASIC, the error level (exit) code
	returned by a BASIC program is controlled by the BASIC run-time
	module, not by your program. As an alternative, you can create a file
	in the BASIC program to serve as a flag when a certain condition
	occurs. The batch file that called your program can then check for the
	existence of the flag file in place of checking for an error level. In
	batch files, the "IF EXIST filename" command can be used.
	
	The following products do not allow your program to return an error
	level to MS-DOS batch files:
	
	1. QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00, 4.00,
	   4.00b, and 4.50 for MS-DOS
	
	2. Microsoft GW-BASIC versions 3.20, 3.22, and 3.23 for MS-DOS
	
	3. Microsoft BASIC Compiler versions 5.35 and 5.36 for MS-DOS and
	   versions 6.00 and 6.00b for MS-DOS and MS OS/2
	
	Your BASIC program must not attempt to invoke any MS-DOS interrupts
	(CALL INTERRUPT) to terminate the program with an error level;
	otherwise, strange results may occur and the machine may hang. BASIC
	must handle program termination by itself.
	
	BASIC 7.00 or 7.10 Can Return Exit Code (ERRORLEVEL) to Batch File
	------------------------------------------------------------------
	
	An .EXE program compiled in BASIC 7.00 or 7.10 can use the STOP n% or
	END n% statement to return an exit code (n%) to MS-DOS, as follows:
	
	   ' TEST.BAS
	   PRINT "This is a BASIC program that returns an exit code of 5."
	   n% = 5
	   END n%
	
	The exit code can be trapped in a MS-DOS batch file with the IF
	ERRORLEVEL n GOTO statement, as follows:
	
	   TEST
	   ECHO OFF
	   IF NOT ERRORLEVEL 1 GOTO DONE
	      ECHO  An error occurred with exit code 1 or higher.
	   :DONE
	   ECHO End of batch file.
	
	Using a File as a Flag for a Batch File
	---------------------------------------
	
	The following technique lets any BASIC version give a simple yes or no
	message to a batch file.
	
	The following batch file, ERRT.BAT, calls the BASIC program ERRTST,
	which drops back to the batch file. It then checks for the existence
	of the file ERRFIL (which is an arbitrary name) to see if an error
	occurred while running the BASIC program:
	
	   echo off
	   del errfil
	   errtst
	   if not exist errfil goto end
	   echo An error occurred during program running
	   :end
	   echo End of batch file
	
	The following file is ERRTST.BAS; it creates the error file if it
	cannot open the file GARBAGE.DAT:
	
	' set up to error out if "GARBAGE.DAT" does not exist
	ON ERROR GOTO errorlevel
	OPEN "garbage.dat" FOR INPUT AS #1
	CLOSE #1
	END
	errorlevel:
	   CLOSE #1
	   OPEN "errfil" FOR OUTPUT AS #1   'Create file that acts as a flag
	   CLOSE #1
	   SYSTEM   ' Returns to DOS.
	
	To demonstrate this procedure, compile and link ERRTST.BAS as follows:
	
	   BC ERRTST.BAS;
	   LINK ERRTST.OBJ;
	
	Now run the batch file ERRT.BAT. If the BASIC program cannot find
	GARBAGE.DAT, ERRT.BAT shows "An error occurred during program
	running."
