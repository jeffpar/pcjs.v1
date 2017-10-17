---
layout: page
title: "Q67314: BC.EXE &quot;Out of Memory&quot; with Numeric Array Elements and SWAP"
permalink: /pubs/pc/reference/microsoft/kb/Q67314/
---

## Q67314: BC.EXE &quot;Out of Memory&quot; with Numeric Array Elements and SWAP

	Article: Q67314
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist7.00 buglist7.10
	Last Modified: 5-DEC-1990
	
	Compiling the following code segment with the BC.EXE compiler gives a
	"BC : Out of memory" error. The problem will occur for any simple
	mathematical operation (addition, subtraction, multiplication, or
	division) performed on the two static-array elements appearing in the
	assignment statement below. The problem does not occur in the QBX.EXE
	environment.
	
	   DIM d#(1), e#(1), b!(1), c&(1)
	   n = 1
	   a% = b!(n) + c&(n)
	   SWAP d#(n), e#(n)
	
	Microsoft has confirmed this to be a problem in BC.EXE in Microsoft
	BASIC Profession Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2. We are researching this problem and will post new
	information here as it becomes available.
	
	You can work around the problem in any one of the following ways:
	
	1. Compile the program with the BC /D option to produce debug code.
	
	2. Use the CINT or CLNG function to convert the first array element in
	   the mathematical expression to an integer type. The example above
	   will compile without error if the assignment statement is changed
	   as follows:
	
	      a%= CINT(b!(n)) + c&(n)
	
	3. Save one of the variables being swapped to a temporary variable and
	   use the temporary variable as an argument to the SWAP statement.
	   The example above will compile without error if the SWAP statement
	   is changed as follows:
	
	      f# = d#(n)
	      SWAP f#,e#(n)
	
	4. Use dynamic arrays (instead of static arrays) by adding
	   REM $DYNAMIC to the top of the program.
	
	The problem occurs when all of the following conditions occur
	simultaneously (as shown in the first code example):
	
	1. An integer variable (INTEGER or LONG type) is assigned to the
	   addition, multiplication, division, or subtraction of two numeric
	   static-array elements.
	
	2. The first array element in the mathematical expression is of type
	   SINGLE.
	
	3. The second array element in the mathematical expression is of type
	   LONG.
	
	4. A SWAP of two array elements of any numeric type occurs after the
	   assignment statement.
	
	5. The code is compiled using BC.EXE
