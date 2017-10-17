---
layout: page
title: "Q27142: ON X GOTO Line-List Allows Only &lt;= 59 Line Labels or Numbers"
permalink: /pubs/pc/reference/microsoft/kb/Q27142/
---

## Q27142: ON X GOTO Line-List Allows Only &lt;= 59 Line Labels or Numbers

	Article: Q27142
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 12-DEC-1989
	
	An ON <expression> GOTO <line-list> statement allows only 59
	line-numbers or line-labels in the line-list.
	
	Using more than 59 labels gives you the error message "Too Many
	Labels" when run from a QuickBASIC Version 4.00, 4.00b, or 4.50
	executable .EXE file. The limitation does not occur when run in the
	QB.EXE Version 4.00, 4.00b, or 4.50 editor.
	
	The following manuals incorrectly imply that you can have up to 255
	line-numbers/line-labels in the ON <expression> GOTO statement: "Too
	Many Labels" error on Page 502 in "Microsoft QuickBASIC 4.0: BASIC
	Language Reference" for Versions 4.00 and 4.00b for MS-DOS, and Page
	502 of "Microsoft BASIC Compiler 6.0: BASIC Language Reference" for
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2.
	
	The program below works without errors in Microsoft GW-BASIC Version
	3.22.
	
	The program below gives the error "Too Many Statement Numbers" in the
	QuickBASIC Version 3.00 editor. In QuickBASIC Version 3.00, the
	limitation occurs both in the editor and from an .EXE file.
	
	The following code demonstrates the 59-label limitation:
	
	t% = 62
	ON t% GOTO 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
	 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,_
	 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,_
	 58, 59, 60, 61, 62, 63
	END
	1  '
	2  '
	3  '
	4  '
	5  '
	6  '
	7  '
	8  '
	9  '
	10 '
	11 '
	12 PRINT "here we are"
	13 '
	14 '
	15 '
	16 '
	17 '
	18 '
	19 '
	20 '
	21 '
	22 '
	23 '
	24 '
	25 '
	26 '
	27 '
	28 '
	29 '
	30 '
	31 '
	32 '
	33 '
	34 '
	35 '
	36 '
	37 '
	38 '
	39 '
	40 '
	41 '
	42 '
	43 '
	44 '
	45 '
	46 '
	47 '
	48 '
	49 '
	50 '
	51 '
	52 '
	53 '
	54 '
	55 '
	56 '
	57 '
	58 '
	59 '
	60 '
	61 '
	62 PRINT "line 62"
	63 '
