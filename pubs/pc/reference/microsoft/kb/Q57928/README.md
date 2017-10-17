---
layout: page
title: "Q57928: Named COMMON SHARED /block/ Can Be Continued onto Next Line"
permalink: /pubs/pc/reference/microsoft/kb/Q57928/
---

## Q57928: Named COMMON SHARED /block/ Can Be Continued onto Next Line

	Article: Q57928
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891025-45 B_BasicCom
	Last Modified: 31-JAN-1990
	
	Programmers may have long lists of variables that they would like to
	include in a named COMMON [SHARED] block; however, their variable
	lists are often too long to be seen on the screen all at once.
	Variables in a named COMMON [SHARED] block can be continued on the
	next line so that they can be seen without having to scroll the
	screen.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 .
	
	Named COMMON (SHARED) blocks can be continued on several lines by
	giving variables on succeeding lines the same block name specified on
	the first. Block names must be specified between forward slashes (//).
	The following is an example:
	
	   COMMON SHARED /bob/ var1, var2, var3, var4, var5, var6
	   COMMON SHARED /bob/ var7, var8, var9, var10, var11, var12
	   COMMON SHARED /bob/ var13, var14, var15, var16, var17, var18
	
	Here is an example of continuing an unnamed (blank) COMMON block,
	which is distinct in memory from any named COMMON block:
	
	   COMMON SHARED uvar1, uvar2, uvar3, uvar4, uvar5, uvar6
	   COMMON SHARED uvar7, uvar8, uvar9, uvar10, uvar11, uvar12
	   COMMON SHARED uvar13, uvar14, uvar15, uvar16, uvar17, uvar18
