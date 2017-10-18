---
layout: page
title: "Q34503: Proc Directive Will Not Work with Structure Type"
permalink: /pubs/pc/reference/microsoft/kb/Q34503/
---

## Q34503: Proc Directive Will Not Work with Structure Type

	Article: Q34503
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-JAN-1989
	
	Page 38 of the "Microsoft Macro Assembler 5.10 Update" guide
	incorrectly states that "the type is the type of the argument and may
	be word, dword, fword, qword, tbyte or the name of a structure defined
	by a STRUC structure declaration."
	
	The support of the STRUC type has not been added to MASM Version 5.10.
	Microsoft will correct the documentation in the next release.
	
	The following program illustrates the use of the STRUC type
	that is not supported:
	
	.model small,c
	.data
	t1 STRUC
	  f1  dw 0
	t1 ENDS
	.code
	h1  PROC arg1:t1
	end
	
	To work around this problem, use the PTR type in the Proc argument.
	Instead of using
	
	h1 PROC arg1:t1
	
	the procedure should be declared as follows:
	
	h1 PROC arg1:PTR t1
	
	No syntax checking is done on t1.
