---
layout: page
title: "Q43691: ENVIRON Sets Environment Variables Used by SHELL in QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q43691/
---

## Q43691: ENVIRON Sets Environment Variables Used by SHELL in QuickBASIC

	Article: Q43691
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890421-61 B_BasicCom
	Last Modified: 14-DEC-1989
	
	The ENVIRON statement in BASIC can change the MS-DOS environment
	variables to different values to be used by that program or a child
	process invoked with the SHELL statement.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and MS OS/2, and Microsoft BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2.
	
	The ENVIRON statement allows you to alter the environment variables
	for use by child processes started through BASIC. Once set, these
	variables will remain set to the new values as long as you are in your
	BASIC program or SHELL out to a child process.
	
	BASIC makes a copy of the original DOS environment variables, and the
	local copy can be changed with the ENVIRON statement. These changes to
	the temporary copy of the DOS environment variables remain in effect
	when BASIC SHELLs to another process.
	
	When altering the environment table through BASIC, it is common for an
	"OUT OF MEMORY" error message to be displayed. For more information on
	the workaround for this error, query on the following keywords:
	
	   ENVIRON$ Memory QuickBASIC
	
	The following code example will print out the current copy of the
	environment table, alter the PATH and PROMPT environment variables,
	print out the environment table again, then SHELL and perform the DOS
	SET command:
	
	Code Example
	------------
	
	CLS
	i = 1
	
	DO WHILE ENVIRON$(i) <> ""   ' prints BASIC's environment table
	    PRINT ENVIRON$(i)
	    i = i + 1
	LOOP
	
	ENVIRON "PATH=;"              ' clear the PATH environment variable
	ENVIRON "PATH=C:\DOS"         ' set the PATH environment variable
	ENVIRON "PROMPT=;"            ' clear the PROMPT environment variable
	ENVIRON "PROMPT=$P$G"         ' set the PROMPT environment variable
	
	PRINT : PRINT
	
	i = 1
	DO WHILE ENVIRON$(i) <> ""    ' prints BASIC's environment table
	    PRINT ENVIRON$(i)
	    i + i + 1
	LOOP
	
	PRINT : PRINT
	SHELL "set"   ' prints the environment table in BASIC's child process
	END
