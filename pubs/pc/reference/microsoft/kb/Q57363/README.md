---
layout: page
title: "Q57363: How to Pass a Variable Length String from BASIC to MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q57363/
---

## Q57363: How to Pass a Variable Length String from BASIC to MASM

	Article: Q57363
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S891017-100
	Last Modified: 17-JAN-1990
	
	The example below demonstrates how to pass a variable-length string
	from a compiled BASIC program to a MASM procedure. This information
	applies to Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and MS OS/2.
	
	BASIC to MASM Example
	---------------------
	
	Compile and link as follows:
	
	Compile: BC /Fs/d basmasm.bas;
	         MASM masmtest;
	Link:    LINK basmasm+masmtest,,,BRT70EFR;
	
	REM ==BASIC to MASM code===
	DEFINT A-Z
	DECLARE SUB printmessage (BYVAL segm, BYVAL offs)
	CLS
	a$ = "Assembly test successful" + "$"
	CALL printmessage(SSEG(a$), SADD(a$))
	LOCATE 10, 10
	PRINT "Back from assembly"
	END
	
	;MASM code here
	                    .Model    Medium,basic
	                    .stack
	                    .code
	                    public    printmessage
	printmessage        proc      uses ds,segm,offs
	                    mov       ax,segm
	                    mov       ds,ax
	                    mov       dx,offs
	                    mov       ah,9
	                    int       21h
	                    ret
	printmessage        endp
	                    end
