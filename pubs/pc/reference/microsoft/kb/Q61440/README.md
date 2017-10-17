---
layout: page
title: "Q61440: DIMension in a FOR-NEXT Loop Is Possible"
permalink: /pubs/pc/reference/microsoft/kb/Q61440/
---

## Q61440: DIMension in a FOR-NEXT Loop Is Possible

	Article: Q61440
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900412-54 B_BasicCom
	Last Modified: 10-MAY-1990
	
	Microsoft QuickBASIC allows you to correctly DIMension a static array
	within a loop (FOR, WHILE, or DO). This is possible because a DIM of a
	static array happens as the program is being compiled (or during the
	binding phase in the interpreter). DIM on a static array is not an
	executable statement. Even though the DIM appears in a loop, it is not
	being executed over and over as the loop iterates. Each time the loop
	executes, the array is not being redimensioned. Therefore, any values
	inserted into the array are not lost.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b, and to
	Microsoft BASIC Professional Development System (PDS) version 7.00.
	
	The situation is different for dynamic arrays. QuickBASIC will give
	you an error on a DIMension of a dynamic array in a loop. If an array
	needs to be redimensioned as a loop executes, the program should REDIM
	the array in the loop. REDIM is an executable statement, and
	therefore, will be executed over and over as the loop repeats. As the
	loop executes, REDIM will reallocate the memory for that array and
	erase its previous contents.
	
	The following code example demonstrates this feature of BASIC:
	
	c% = 100
	FOR i% = 1 TO 20
	'  DIM a%(c%)   ' will generate an error.
	'  REDIM a%(c%) ' will redim the array and erase its contents.
	   DIM a%(20)
	   a%(i%)=i%
	   PRINT a%(i%)
	NEXT i%
	
	FOR j% = 1 TO 20
	   PRINT a%(j%)
	NEXT j%
