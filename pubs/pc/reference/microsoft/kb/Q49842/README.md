---
layout: page
title: "Q49842: Installing In-Line 80 x 87 Assembly Instructions"
permalink: /pubs/pc/reference/microsoft/kb/Q49842/
---

	Article: Q49842
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr appnote
	Last Modified: 16-JAN-1990
	
	The assembler code on Page 168 of the "Microsoft C Optimizing Compiler
	User's Guide," Version 5.10, is incorrect. When assembled and linked
	with your C application, this code will cause divide by zero and
	overflows to be masked.
	
	This behavior occurs because the code on Page 168 is incomplete. The
	correct code is listed below. Case is important, so assemble with the
	-Mx switch. You should also link with the /NOE switch. This code is
	provided to produce in-line 8087 instructions on FORTRAN Versions 4.x
	and C Versions 5.x.
	
	This application note is also available from Microsoft Product Support
	Services by calling (206) 454-2030.
	
	;************************************************************************
	;rmfixups.asm -
	;
	;   Copyright (c) 1988-1988, Microsoft Corporation.  All Rights Reserved.
	;
	;Purpose:
	;  Link with rmfixups.obj in order to prevent floating point instructions
	;  from being fixed up.
	;  The case of these names is important so assemble with the -Mx switch.
	;
	;*************************************************************************
	
	public  FIWRQQ,FIERQQ,FIDRQQ,FISRQQ,FJSRQQ,FIARQQ,FJARQQ,FICRQQ,FJCRQQ
	
	FIDRQQ  EQU     0
	FIERQQ  EQU     0
	FIWRQQ  EQU     0
	FIARQQ  EQU     0
	FJARQQ  EQU     0
	FISRQQ  EQU     0
	FJSRQQ  EQU     0
	FICRQQ  EQU     0
	FJCRQQ  EQU     0
	
	extrn   __fpmath:far
	extrn   __fptaskdata:far
	extrn   __fpsignal:far
	
	CDATA   segment word common 'DATA'
	        dw      0
	        dd      __fpmath
	        dd      __fptaskdata
	        dd      __fpsignal
	CDATA   ends
	
	end
