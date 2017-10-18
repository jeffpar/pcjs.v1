---
layout: page
title: "Q40852: Using &quot;Low&quot; in Conjunction with the &quot;Offset&quot; Operator"
permalink: /pubs/pc/reference/microsoft/kb/Q40852/
---

## Q40852: Using &quot;Low&quot; in Conjunction with the &quot;Offset&quot; Operator

	Article: Q40852
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10 H_MASM 5.10
	Last Modified: 24-APR-1989
	
	Problem:
	
	When attempting to use the "low" in conjunction with the "offset"
	operator, I get the following error message:
	
	   error message A2042: Constant expected
	
	The following is a code example that generates the error message:
	
	 = 1234           data_equ equ     1234h        ;equate data
	 0000             cseg     segment para public
	                          assume  cs:cseg, ds:cseg  ss:stack
	
	 0000             testlow  proc    far
	
	 0000  E9 01FF R  start:   jmp     begin
	 0003  00         data_a   db      0
	
	 0004  11 03 R            db      11h, low offset data_a
	testlow.asm(29): error A2042: Constant expected
	
	Response:
	
	This problem has been confirmed with MASM Version 5.10. Microsoft is
	researching this problem and will post new information as it becomes
	available.
	
	Please note that the same function has been checked against MASM
	Versions 5.00 and 4.00, and assembled without error.
