---
layout: page
title: "Q41151: Function KEY Strings Retained After CHAIN in QuickBASIC 4.x"
permalink: /pubs/pc/reference/microsoft/kb/Q41151/
---

## Q41151: Function KEY Strings Retained After CHAIN in QuickBASIC 4.x

	Article: Q41151
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890120-97
	Last Modified: 14-DEC-1989
	
	If you define strings to be returned by function keys F1 through F10
	(using KEY n,"<string>"), and then CHAIN to another program, these
	function key strings are retained unless the programs are compiled as
	stand alone. This behavior applies to Microsoft QuickBASIC Versions
	4.00, 4.00b, and 4.50, Microsoft BASIC Compiler Versions 6.00 and
	6.00b, and Microsoft BASIC PDS Version 7.00.
	
	In QuickBASIC Versions 3.00 and earlier, the function key strings are
	not retained after CHAINing.
	
	When CHAINing between programs, unnamed COMMON blocks and open files
	are preserved from the CHAINing program to the CHAINed-to program only
	if the programs are compiled without the /O (stand-alone EXE) option.
	
	If the two programs below are compiled with QuickBASIC Version 3.00
	using no options, the KEY list is destroyed after the CHAIN. However,
	if the same programs are compiled using no /O option under a later
	version of QuickBASIC or Microsoft BASIC Compiler Version 6.00 or
	6.00b, or BASIC PDS 7.00, the KEY list is retained in the second
	program.
	
	The following is a code example:
	
	'** KEY1.BAS
	FOR t=1 TO 10
	  KEY t,"*****"
	NEXT t
	KEY LIST
	INPUT "Press any function key F1 - F10 and hit RETURN",X$
	CHAIN "key2"
	
	'** KEY2.BAS
	CLEAR
	KEY LIST
	INPUT "Press any function key F1 - F10 and hit RETURN",X$
	PRINT "End of programs."
	END
