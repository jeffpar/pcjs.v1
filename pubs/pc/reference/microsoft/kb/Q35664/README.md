---
layout: page
title: "Q35664: Create Your Own Non-ASCII Graphics Characters in CGA Graphics"
permalink: /pubs/pc/reference/microsoft/kb/Q35664/
---

## Q35664: Create Your Own Non-ASCII Graphics Characters in CGA Graphics

	Article: Q35664
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	The program below demonstrates how to create your own non-ASCII
	characters for use in CGA screens 1 and 2. This way you can make
	characters such as 1/3, or foreign letters and symbols not found in
	the ASCII or extended-ASCII character set.
	
	This information applies to Microsoft QuickBASIC Versions 4.00 4.00b
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	In graphics mode, the bit patterns for ASCII character codes 128
	through 255 are obtained from a table located in RAM. The address of
	this table is located in the Interrupt Vector Table at location
	0000:007C (the vector for interrupt 1F). This location can be modified
	to install modified character sets. Note, that on a standard IBM PC or
	compatible, ASCII characters 0 through 127 are contained in the ROM
	BIOS and cannot be replaced. (The IBM PCjr, which is not supported by
	QuickBASIC, handles these characters differently.)
	
	To create your own character set, you would create a table of
	characters and replace the current address in the Interrupt Vector
	Table with the address of your table. Keep in mind that the segment
	and offset are stored "backwards" in the table. The following example
	
	   F000: FF54
	
	would be stored as follows:
	
	   54 FF 00 F0
	
	The information stored in the table should be an 8 x 8 bitmap for each
	character desired. For example, the following character would be
	represented by the following eight decimal values:
	
	Character         Decimal Value
	---------         -------------
	
	11110000              240
	10010000              144
	10010000              144
	11111110              254
	10010010              146
	10010010              146
	10011110              158
	00000000                0
	
	The decimal value is the binary value for each line converted to
	decimal.
	
	Code Example:
	------------
	
	The three DATA statements hold the binary coding for the characters to
	be represented. They are a small triangle, a sigma, and a 1/3. In
	binary, the data looks like the following:
	
	Triangle          Sigma             1/3
	--------          -----             ---
	
	00000010        11111110          10000100
	00000110        00100000          10001000
	00001110        00010000          10011110
	00011110        00001000          10100010
	00111110        00010000          01000110
	01111110        00100000          10000010
	11111110        11111110          00001110
	00000000        00000000          00000000
	
	DATA 2,6,14,30,62,126,254,0
	DATA 254,64,32,16,32,64,254,0
	DATA 132,136,158,162,70,130,14,0
	
	DIM table(100)
	COMMON SHARED table()
	
	location = VARPTR(table(0))
	segment = VARSEG(table(0))
	
	DEF SEG = 0: SCREEN 1
	  A = PEEK(124)         'Save this information and restore it when done.
	  B = PEEK(125)
	  C = PEEK(126)
	  D = PEEK(127)
	  POKE 124, location MOD 256 'This is where the address of the graphics
	  POKE 125, location \ 256   'screen characters are stored. The program
	  POKE 126, segment MOD 256  'changes this so now it thinks the graphics
	  POKE 127, segment \ 256    'characters are stored in the table() array.
	DEF SEG
	
	FOR I = 1 TO 24
	   READ A%                   'Place the created characters into the new
	   POKE location + I, A%     'graphics table
	NEXT I
	
	FOR I = 128 TO 130           'Print the new characters out.
	   PRINT CHR$(I) + " ";
	NEXT
	
	DEF SEG = 0             'Restore to the original graphics character set.
	  POKE 124, A
	  POKE 125, B
	  POKE 126, C
	  POKE 127, D
	DEF SEG
