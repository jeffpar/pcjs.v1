---
layout: page
title: "Q60147: CHAINing with Additional Variables in COMMON Causes Hang"
permalink: /pubs/pc/reference/microsoft/kb/Q60147/
---

## Q60147: CHAINing with Additional Variables in COMMON Causes Hang

	Article: Q60147
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 buglist7.10
	Last Modified: 20-SEP-1990
	
	In a compiled BASIC program, CHAINing from a program that has a
	DYNAMIC variable-length string array in COMMON to a program that has
	an additional variable in COMMON whose length is greater than 530
	bytes will cause the program to either terminate and display an
	"Unprintable Error" message or hang, depending on the version of BASIC
	compiler being used.
	
	This problem does not occur in the QB.EXE or QBX.EXE editors or when
	the /Fs compiler option is used with Microsoft BASIC Professional
	Development System (PDS) versions 7.00 or 7.10.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	versions 4.00, 4.00b and 4.50; in Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS and OS/2; and in Microsoft BASIC PDS
	versions 7.00 and 7.10 for MS-DOS and OS/2. We are researching this
	problem and will post new information here as it becomes available.
	
	With BASIC PDS 7.00 or 7.10, the "Unprintable Error" message displays.
	In the other BASICs listed above, the program hangs.
	
	To duplicate the problem, the following conditions must be met:
	
	1. The first program must have a dynamic variable-length string array
	   in COMMON.
	
	2. The first program must assign a value to an element of the array.
	
	3. The second program must have an additional COMMON variable (not in
	   the first program's COMMON) with a length greater than 530 bytes.
	   This can be either a fixed-length string or a user-defined TYPE.
	
	4. The second program must assign a value to the additional variable.
	
	5. Both programs must be compiled with near strings (no /Fs).
	
	Similarly, to work around the problem, any of the following methods
	can be used:
	
	1. Make the array $STATIC (DIM before COMMON in both programs).
	
	2. Put the additional COMMON variable in the COMMON block for the
	   first program as well.
	
	3. Compile both programs with the Far Strings (/Fs) option in BASIC
	   PDS 7.00 or 7.10.
	
	When the programs below are compiled for OS/2 protected mode, the
	problem is almost identical. The only difference in protected mode is
	the size of the additional variable in the COMMON block. The process
	will hang whenever the additional COMMON variable is greater than 20
	bytes (instead of 530 as in DOS). Besides the length of the COMMON
	variable, the conditions and the workarounds (listed above) apply to
	both OS/2 protected mode and DOS (and OS/2 real mode).
	
	Code Example #1
	---------------
	
	The following program CHAINs to Code Example #2, which produces the
	"Unprintable Error" in BASIC PDS 7.00 or 7.10 and hangs in the other
	BASIC versions listed above when compiled as shown:
	
	'FIRST.BAS compile and LINK lines:
	'    BC FIRST;
	'    LINK FIRST;
	'NOTE: Compiling with the Far Strings option (/FS) corrects problem.
	
	'DIM VarStrArray(0) AS STRING      'Static array works correctly.
	COMMON VarStrArray() AS STRING
	'More COMMON variables can be added to both without changing
	' problem.
	COMMON FixStr AS STRING * 531      'Full COMMON in both files works.
	DIM VarStrArray(0) AS STRING       'Dynamic array (any size) fails.
	VarStrArray(0) = "Test"            'Must assign a value to array.
	PRINT "Chaining FIRST->SECOND"
	CHAIN "SECOND"
	END
	
	Code Example #2
	---------------
	
	The following is the CHAINed program, which will terminate and produce
	the "Unprintable Error" or hang (depending on the version of BASIC
	being used) when compiled as shown:
	
	'SECOND.BAS compile and LINK lines:
	'    BC SECOND;
	'    LINK SECOND;
	'NOTE: Compiling with the Far Strings option (/FS) corrects problem.
	
	'DIM VarStrArray(0) AS STRING  'Static array works correctly.
	COMMON VarStrArray() AS STRING 'Must be Dynamic string array.
	'More COMMON variables can be added to both without changing problem.
	COMMON FixStr AS STRING * 531  'Must be fixed STRING with LEN > 530
	
	PRINT "In SECOND"
	FixStr = "Test"                'Assignment to new COMMON var required.
	END
