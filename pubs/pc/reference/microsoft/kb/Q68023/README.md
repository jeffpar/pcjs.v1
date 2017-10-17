---
layout: page
title: "Q68023: BC &quot;Internal Error&quot; with Array of TYPE Using Array of STRING&#42;1"
permalink: /pubs/pc/reference/microsoft/kb/Q68023/
---

## Q68023: BC &quot;Internal Error&quot; with Array of TYPE Using Array of STRING&#42;1

	Article: Q68023
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S901222-1 buglist7.00 buglist7.10
	Last Modified: 9-JAN-1991
	
	The following code example demonstrates a problem using an array of
	user-defined TYPE variables that contain an array of fixed-length
	strings of length one. The BC.EXE compiler incorrectly gives the
	message "BC : Internal Error near XXXX" when compiling this example.
	The QBX.EXE environment compiles the same example without error.
	
	This problem applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2. We are
	researching this problem and will post new information here as it
	becomes available.
	
	Code Sample
	-----------
	
	'$DYNAMIC
	TYPE rectype
	  a(10) AS STRING * 1
	END TYPE
	DIM b(10) AS rectype
	byte% = 0
	10 b(1).a(byte%) = "a"
	
	Save the file as TEST.BAS and then attempt to compile with BC.EXE
	using the following command line:
	
	   BC TEST;
	
	The compiler will issue the "Internal Error" message.
	
	The error occurs only if ALL the following conditions are met:
	
	1. The array b() is dynamic.
	
	2. The second array element in line 10 is referenced with a
	   variable.
	
	3. The fixed-length string in the TYPE is of length one (STRING * 1).
	
	4. The program is compiled without run-time error checking (without
	   the BC /D option).
	
	To work around this problem, just counteract any one of the above
	conditions, using one of the following four suggested workarounds:
	
	1. Make the array b() static. For example, if you add the '$STATIC
	   metacommand before the DIM as follows, the program will compile
	   correctly:
	
	      '$STATIC
	      DIM b(10) AS rectype
	      '$DYNAMIC
	
	2. Reference the second element in line 10 with a constant instead of
	   a variable.
	
	3. Use STRING * 2 or a longer length.
	
	4. Compile with the BC /D option.
