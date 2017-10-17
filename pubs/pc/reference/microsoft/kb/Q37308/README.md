---
layout: page
title: "Q37308: Graphics GET and PUT Require Integer or LONG Array; Example"
permalink: /pubs/pc/reference/microsoft/kb/Q37308/
---

## Q37308: Graphics GET and PUT Require Integer or LONG Array; Example

	Article: Q37308
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	Page 208 of the "Microsoft QuickBASIC 4.0: BASIC Language Reference"
	manual states the following:
	
	   Unless the array type is integer or long, the contents of an array
	   after a [graphics] GET appear meaningless when inspected directly.
	
	This statement also applies when saving the elements of the array to a
	file. Unless the array type is integer or long, the resulting picture,
	when read back from disk, will be distorted.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	The program below will display a picture, save it to disk, read it
	back from disk, and re-display the picture. If the "picture()" array
	is of integer type, the program will work as expected. If it is of
	single type, the resulting picture will be distorted.
	
	The following is a code example:
	
	CONST picSize = 16383
	DIM picture(picSize) AS SINGLE   ' Change to INTEGER
	
	SCREEN 3  ' SCREEN 3 is for Hercules. Use SCREEN 2 for CGA card.
	FOR x = 1 TO 150 STEP 2.5          ' Draw a simple picture
	  LINE (x + 300, x)-(300 - x, 300 - x), 7, B
	NEXT
	
	GET (30, 0)-(450, 300), picture
	
	OPEN "temp.pic" FOR OUTPUT AS #1   ' Save the picture
	FOR i = 0 TO picSize
	  PRINT #1, picture(i)
	NEXT i
	CLOSE #1
	
	OPEN "temp.pic" FOR INPUT AS #1    ' Load the picture back
	FOR i = 0 TO picSize
	  INPUT #1, picture(i)
	NEXT i
	
	CLS
	PUT (5, 5), picture                ' Display the picture
