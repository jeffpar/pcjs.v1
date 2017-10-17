---
layout: page
title: "Q47122: Example of Passing a Variable-Length String to Assembly"
permalink: /pubs/pc/reference/microsoft/kb/Q47122/
---

## Q47122: Example of Passing a Variable-Length String to Assembly

	Article: Q47122
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 5-SEP-1990
	
	The program shown below demonstrates how to pass a variable-length
	string by far reference to an assembly language routine.
	
	This information applies to QuickBASIC versions 4.00, 4.00b, and 4.50,
	to Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS
	OS/2, and to near variable-length strings in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	The following program is PSTRING.BAS, which passes a string to an
	assembly language routine using the VARSEG and SADD functions. SADD
	gives the actual address of the string, whereas VARPTR gives the
	address of the string descriptor.
	
	This example cannot be used in BASIC PDS 7.00 or 7.10 with far strings
	(BC /Fs) or with QBX.EXE (which always uses far strings). For more
	information about far strings, see Chapter 13 of "Microsoft BASIC 7.0:
	Programmer's Guide" for versions 7.00 and 7.10.
	
	DECLARE SUB PSTRING(BYVAL STRSEG AS INTEGER, BYVAL STROFF AS INTEGER)
	A$ = "Hello World"
	PRINT "Before call: ";
	PRINT A$
	CALL PSTRING(VARSEG(A$), SADD(A$))
	PRINT "After call : ";
	PRINT A$
	
	The following separately compiled routine is PSTR.ASM:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.CODE
	
	pstring     PROC sseg:WORD, soff:WORD
	            push bx                  ; save bx register, dx, and es
	            push dx
	            push es
	
	            mov ax, sseg             ; get segment of string
	            mov es, ax               ; put into segment register
	            mov bx, soff
	                                     ; 65 is ASCII value for letter 'A'.
	            mov BYTE PTR es:[bx], 65 ; Move the 'A' to the first character
	                                     ;  in the string.
	            pop es
	            pop dx
	            pop bx                   ; restore (pop) es, dx, and bx
	            ret
	pstring     ENDP
	            end
	
	Compile and link the program as follows:
	
	   BC PSTRING;
	   MASM PSTR;
	
	   LINK PSTRING PSTR;
	
	When run, PSTRING should print the following:
	
	   Before call: Hello World
	   After call : Aello World
