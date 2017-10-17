---
layout: page
title: "Q44309: DATA Column in BC /A Assembly .LST Listing Is DGROUP Data"
permalink: /pubs/pc/reference/microsoft/kb/Q44309/
---

## Q44309: DATA Column in BC /A Assembly .LST Listing Is DGROUP Data

	Article: Q44309
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 20-DEC-1989
	
	The BC.EXE compiler supports the /A option, which outputs a listing
	(.LST) that shows the assembly-language code that the compiler
	generates for each line of the source file.
	
	The "Data" column in this assembly-language code listing is a
	hexadecimal value showing how many bytes have been statically
	allocated in the default data segment (DGROUP).
	
	This information applies to Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2.
	
	As a demonstration, compile the following program using the BC /A
	option:
	
	   x% = 5              'Allocates 2 bytes
	   y! = 100            'Allocates 4 bytes
	   z# = 200            'Allocates 8 bytes
	
	The following listing (.LST) file is generated:
	
	Offset  Data    Source Line
	
	 0030   0006    x% = 5              'Allocates 2 bytes
	 0030   0006
	 0030   0006    y! = 100            'Allocates 4 bytes
	 0030   0006
	 0030   0006    z# = 200            'Allocates 8 bytes
	 0030   0006
	 0030   0006
	 0030    **            I00002: mov   X%,0005h
	 0036    **                    int   35h
	 0038    **                    db    06h
	 0039    **                    dw    <0000C842>
	 003B    **                    int   35h
	 003D    **                    db    1Eh
	 003E    **                    dw    Y!
	 0040    **                    int   3Dh
	 0042    **                    int   39h
	 0044    **                    db    06h
	 0045    **                    dw    <0000000000006940>
	 0047    **                    int   39h
	 0049    **                    db    1Eh
	 004A    **                    dw    Z#
	 004C    **                    int   3Dh
	 004E    **                    call  B$CENP
	 0053   0014
	
	The last entry in the "Data" column shows that a total of 20 bytes (6
	+ 2 + 4 + 8 = 20) have been allocated in near data. Note the value is
	shown as a hexadecimal number (0014 hex = 20 decimal).
