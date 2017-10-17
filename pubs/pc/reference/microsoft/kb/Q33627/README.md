---
layout: page
title: "Q33627: SHELL in QuickBASIC Version 3.00 May Overwrite String Space"
permalink: /pubs/pc/reference/microsoft/kb/Q33627/
---

## Q33627: SHELL in QuickBASIC Version 3.00 May Overwrite String Space

	Article: Q33627
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 fixlist4.00 fixlist4.00b fixlist4.50
	Last Modified: 16-DEC-1989
	
	The following program incorrectly prints x$(0) as "WExxxxx" instead of
	"xxxxxxx" after the SHELL in QuickBASIC Version 3.00. If you do a
	FRE("") before the SHELL statement, the problem goes away. The program
	runs correctly in QuickBASIC Version 4.00.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	3.00 in the editor or when compiled. This problem does not occur in
	Microsoft QuickBASIC Versions 4.00, 4.00b, or 4.50 for MS-DOS or in
	QBX.EXE which comes with Microsoft BASIC PDS Version 7.00
	(fixlist7.00) for MS-DOS and MS OS/2.
	
	The following is a code example:
	
	   DECLARE SUB test (y$())
	   OPEN "temp" FOR RANDOM AS #1 LEN = 10
	   CLOSE #1
	   OPEN "temp" FOR RANDOM AS #2 LEN = 1
	   CLOSE
	   a$ = CHR$(0) + CHR$(0)
	   DIM x$(dumb)
	   x$(0) = "xxxxxxx"
	   CALL test(x$())
	
	   SUB test (y$()) STATIC
	   PRINT y$(0)               'prints "xxxxxxx".
	   'p = fre(""): p=fre(-1)
	   SHELL
	   PRINT y$(0)               'prints "WExxxxx".
	   END SUB
