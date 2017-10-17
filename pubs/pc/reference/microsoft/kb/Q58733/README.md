---
layout: page
title: "Q58733: BASIC 7.00 Can Assign an Array to an Array If in a TYPE"
permalink: /pubs/pc/reference/microsoft/kb/Q58733/
---

## Q58733: BASIC 7.00 Can Assign an Array to an Array If in a TYPE

	Article: Q58733
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900131-59 B_QuickBas
	Last Modified: 12-NOV-1990
	
	Some languages, such as Pascal, allow you to assign one array directly
	to another, which copies all the elements from one array to another.
	Microsoft BASIC cannot do this, except in Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 where you can now
	directly assign one static array to another by defining the array in a
	user-defined-TYPE variable and then assigning one variable of this
	TYPE to another.
	
	Using a variable of a TYPE that contains an array, you can also write
	an entire array to a file using a single PUT# statement.
	
	Note that in Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50 for
	MS-DOS, in Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS
	and MS OS/2, and in Microsoft BASIC PDS versions 7.00 and 7.10 for
	MS-DOS and MS OS/2, you can directly assign variables of a
	user-defined TYPE directly to one another if they are of the same
	TYPE. (LSET can be used for assignment if the record variables differ
	in TYPE.) The TYPEd variables are assigned in one simple statement,
	and each and every element of the user-defined TYPE is automatically
	copied.
	
	Microsoft BASIC PDS version 7.00 for MS-DOS and MS OS/2 introduces
	support for static arrays in user-defined TYPEs. In BASIC PDS 7.00 and
	7.10, you can directly assign one static array to another by defining
	the array in a user-defined-TYPE variable and then assigning one
	variable of this TYPE to another, as shown in Example 1.
	
	You can also write a whole array at once into a disk file, as shown in
	Example 2.
	
	Code Example 1
	--------------
	
	The following program can be used in BASIC PDS 7.00 and 7.10 to
	demonstrate the assignment of the contents of one static array to
	another. (Note that dynamic arrays cannot be placed in user-defined
	TYPEs.)
	
	   TYPE rec1
	     array1(20) AS INTEGER
	   END TYPE
	   DIM var1 AS rec1, var2 AS rec1
	   CLS
	   FOR i = 1 TO 20      ' Fill the array in var1:
	     var1.array1(i) = i
	   NEXT
	     var2 = var1          ' Make the assignment.
	   FOR i = 1 TO 20      ' Confirm that the array was copied to var2:
	     PRINT var2.array1(i)
	   NEXT
	   END
	
	Code Example 2
	--------------
	
	The following example, compiled in BASIC PDS 7.00 or 7.10, shows how
	to write a whole array to disk at once, using just one PUT# statement:
	
	   TYPE rec1
	     array1(20) AS INTEGER
	   END TYPE
	   DIM var1 AS rec1, var2 AS rec1
	   CLS
	   FOR i = 1 TO 20      ' Fill the array in var1:
	     var1.array1(i) = i
	   NEXT
	
	   OPEN "test.dat" FOR RANDOM AS #1
	   PUT #1, , var1         ' write whole array to disk all at once.
	   CLOSE
	
	   OPEN "test.dat" FOR RANDOM AS #1
	   GET #1, , var2      ' Reads array all at once into var2.
	   FOR i = 1 TO 20     ' Print the contents of array var2:
	     PRINT var2.array1(i);
	   NEXT
	   CLOSE
