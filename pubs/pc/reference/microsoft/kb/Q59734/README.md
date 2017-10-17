---
layout: page
title: "Q59734: BASIC 7.00 Can Write Whole Array (in TYPE) to Disk at Once"
permalink: /pubs/pc/reference/microsoft/kb/Q59734/
---

## Q59734: BASIC 7.00 Can Write Whole Array (in TYPE) to Disk at Once

	Article: Q59734
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 3-AUG-1990
	
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 introduce support for static arrays in user-defined TYPE
	definitions. This means that you can write an entire array (in a user
	TYPE record) to a disk file at once. The code example below writes an
	entire array to a RANDOM or BINARY file using a single PUT# statement.
	
	Note that you cannot output arrays all at once (in one PRINT# or
	WRITE# statement) to files opened with sequential access (OPEN FOR
	OUTPUT). With sequential access (OPEN FOR OUTPUT or INPUT), you must
	output or input just one array element at a time.
	
	You must use RANDOM or BINARY access to write a static
	nonvariable-length string array to a file all at once (as shown in the
	examples below).
	
	Note that in Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50 for
	MS-DOS, in Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS
	and MS OS/2, and in Microsoft BASIC PDS versions 7.00 and 7.10 for
	MS-DOS and MS OS/2, you can directly write whole records (variables)
	of a given user-defined TYPE to disk as the third argument of the PUT#
	statement. Each and every element of the user-defined TYPE record is
	automatically copied to the file. If the data is numeric and you
	output to a file OPENed with RANDOM or BINARY access, the data is
	automatically stored in numeric format (without requiring a lengthy
	FIELD statement or numeric-to-string conversion functions such as
	MKS$, MKD$, MKI$, or MKL$).
	
	Since an array can be an element of a record of user-defined TYPE in
	BASIC 7.00 and 7.10 (but not in earlier versions), you can write a
	whole array at once into a disk file, as shown below.
	
	Code Example
	------------
	
	The following example, compiled in BASIC PDS 7.00 or 7.10, shows how
	to write a whole array to disk at once, using just one PUT# statement:
	
	TYPE rec1
	  array1(20) AS INTEGER
	END TYPE
	DIM var1 AS rec1, var2 AS rec1  'DIMension var1 & var2 with TYPE rec1
	FOR i = 1 TO 20      ' Fill each element of the array:
	  var1.array1(i) = i
	NEXT
	
	' The following OPEN statements may OPEN FOR either RANDOM or BINARY:
	OPEN "test.dat" FOR RANDOM AS #1
	PUT #1, , var1       ' Write whole array to disk all at once.
	CLOSE
	
	OPEN "test.dat" FOR RANDOM AS #1
	GET #1, , var2      ' Reads array all at once into var2.
	FOR i = 1 TO 20     ' Print the contents of the array var2.array1:
	  PRINT var2.array1(i);
	NEXT
	CLOSE
