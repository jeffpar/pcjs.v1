---
layout: page
title: "Q60852: Passing Far Strings to C Using StringAddress and StringLength"
permalink: /pubs/pc/reference/microsoft/kb/Q60852/
---

## Q60852: Passing Far Strings to C Using StringAddress and StringLength

	Article: Q60852
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900328-95
	Last Modified: 19-APR-1990
	
	Programs compiled with the /Fs option, functions and procedures
	(compiled with /Fs) in a Quick library, and programs designed to run
	under the QuickBASIC Extended (QBX.EXE) environment now need to handle
	strings passed to non-BASIC routines differently.
	
	The following program demonstrates how to pass a variable-length far
	string to a Microsoft C function using the BASIC run-time routines
	StringAddress and StringLength. These routines are necessary to obtain
	the string's far address and length.
	
	Code Example
	------------
	
	'----------- Here is the file TESTB.BAS
	DECLARE SUB TestC CDECL (A$)
	A$ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + CHR$(0)
	                'Add Hex 0 at the end for the C printf function
	CLS : PRINT : PRINT
	PRINT "BASIC: "; A$
	PRINT "Len: "; LEN(A$)
	PRINT
	CALL TestC(A$)
	LOCATE CSRLIN + 3
	PRINT "Back in BASIC"
	SYSTEM
	
	/* ---------- Here is the file TESTC.C
	extern char far * pascal StringAddress(long near *);
	extern int pascal StringLength(long near *);
	
	void TestC (long near * Desc)
	{
	  int  len;
	  char far *segadd;
	
	  len = StringLength( Desc );
	  segadd = StringAddress( Desc );
	  printf("C: %s\n", segadd);
	  printf("Len: %i\n", len);
	}
	
	Compile and link options, as follows:
	
	   BC /o TESTB;
	   CL -c -AM TESTC.C
	   LINK /noe TESTB TESTC;
	
	The output should from this program should be as follows:
	
	   BASIC: ABCDEFGHIJKLMNOPQRSTUVWXYZ
	   Len: 27
	
	   C: ABCDEFGHIJKLMNOPQRSTUVWXYZ
	   Len: 27
	
	   Back in BASIC
