---
layout: page
title: "Q26778: _amblksiz Not Declared"
permalink: /pubs/pc/reference/microsoft/kb/Q26778/
---

	Article: Q26778
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 26-SEP-1988
	
	Page 33 of the "Microsoft C Compiler Run-Time Library Reference
	Manual" (Page 31 for Version 4.00) incorrectly states that _amblksiz
	"is declared in the include file malloc.h". It is not there.
	
	You can use the variable in your program by declaring the variable as
	follows:
	
	extern unsigned int _amblksiz;
