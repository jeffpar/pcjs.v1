---
layout: page
title: "Q69160: &quot;Subscript Out of Range,&quot; Graphics GET with LONG Integer"
permalink: /pubs/pc/reference/microsoft/kb/Q69160/
---

## Q69160: &quot;Subscript Out of Range,&quot; Graphics GET with LONG Integer

	Article: Q69160
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | b_quickbas buglist6.00 buglist6.00b buglist7.00 buglist7.10
	Last Modified: 14-FEB-1991
	
	If the graphics GET statement is used in a subprogram with a LONG
	integer array and if the starting index of the array is not the first
	element, a "Subscript out of Range" error will be generated if the
	program is compiled with BC /D. If the program is compiled without the
	/D option, BC.EXE will give an "Illegal function call" error.
	
	This problem does not occur in the QBX.EXE or QB.EXE environment.
	
	Microsoft has confirmed this to be a problem with Microsoft QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS; Microsoft BASIC compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2; and Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2. We are researching this problem and will post new
	information here as it becomes available.
	
	The program below demonstrates the problem. Compile and link as
	follows:
	
	   BC /D SAMPLE;
	   LINK SAMPLE;
	
	When the program is run, it will draw a circle and then print
	"Subscript out of Range in line 7 of module SAMPLE."
	
	To work around this problem, either place the array in COMMON SHARED
	or use a local array instead of one that is passed as a parameter. It
	is also possible to uses SINGLE precision numbers instead of LONG
	integers.
	
	Code Sample: SAMPLE.BAS
	-----------------------
	
	DECLARE SUB test (array() AS LONG)
	1 DIM array(1000) AS LONG
	2 SCREEN 1
	3 CIRCLE (50, 50), 50
	4 CALL test(array())
	5 CLS
	6 PUT (100, 100), array(4)
	
	SUB test (array() AS LONG)
	7  GET (50, 50)-(100, 100), array(4)
	END SUB
