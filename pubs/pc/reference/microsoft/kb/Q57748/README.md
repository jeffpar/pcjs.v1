---
layout: page
title: "Q57748: Converting PL/M-386 Code to MSC"
permalink: /pubs/pc/reference/microsoft/kb/Q57748/
---

## Q57748: Converting PL/M-386 Code to MSC

	Article: Q57748
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-FEB-1990
	
	Microsoft does not make any PL/M conversion programs or utilities, nor
	do we know of any products for converting PL/M to C or MASM code that
	are explicitly compatible with Windows development. There are,
	however, several third-party vendor products (seen on a December 1988
	bulletin board).
	
	Microsoft has not tested these products, and therefore, we make no
	guarantees about them. You may want to contact the respective vendors
	for more information.
	
	   Product: PL/M to C
	   Korzeniewski: Frank Korzeniewski Consulting
	   1564-A Fitzgeral Dr. #137
	   Pinole, CA  94564
	   (415) 799-1819
	
	   Product: name not listed
	   Lexeme Co.
	   Richard Cox
	   4 Station Square #250
	   Commerce Court
	   Pittsburg, PA  15219-1119
	   (412) 281-5454
	
	Another less convenient possibility is to use CodeView (CV) to view
	the assembly code from the PL/M .EXE files. CV may be able to detect
	PUBLIC symbols, such as _main in Microsoft C or Pascal, which would
	allow you to skip start-up code and perhaps to keep track of where you
	are in your code. This will not result in complete or correct
	assembler, but it may ease the conversion process.
	
	You can use PRINT SCREEN to print the assembly code in 17 line blocks.
	Or you can invoke CodeView in sequential mode (/t), redirect to a
	file, and unassemble (U). For details, query on the following words:
	
	   disassemble and codeview and listing
