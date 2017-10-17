---
layout: page
title: "Q37426: Sample Program That Makes OS/2 Function Call DosMove"
permalink: /pubs/pc/reference/microsoft/kb/Q37426/
---

## Q37426: Sample Program That Makes OS/2 Function Call DosMove

	Article: Q37426
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 function
	DosMove. This program can be compiled in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS OS/2 and Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS OS/2.
	
	The sample program is as follows:
	
	' This definition is from the include file BSEDOSFL.BI
	DECLARE FUNCTION DosMove%(_
	                 BYVAL P1S AS INTEGER,_
	                 BYVAL P1O AS INTEGER,_
	                 BYVAL P2S AS INTEGER,_
	                 BYVAL P2O AS INTEGER,_
	                 BYVAL P3 AS LONG)
	
	DIM reserved AS LONG
	
	INPUT "Enter the ORIGINAL filename : ";f1$
	INPUT "Enter the NEW filename : ";f2$
	
	f1$=f1$+chr$(0)
	f2$=f2$+chr$(0)
	
	x=DosMove%(varseg(f1$),sadd(f1$),varseg(f2$),sadd(f2$),reserved)
	
	IF (x) THEN
	  Print "An error occurred.  The number is : ";x
	ELSE
	  Print UCASE$(f1$)" ===> " UCASE$(f2$)
	END IF
	END
