---
layout: page
title: "Q59585: LOCAL Directive with a Structure"
permalink: /pubs/pc/reference/microsoft/kb/Q59585/
---

## Q59585: LOCAL Directive with a Structure

	Article: Q59585
	Version(s): 5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist5.10 fixlist5.10a
	Last Modified: 10-JUL-1990
	
	Problem:
	
	On Page Update-42 of the "Microsoft Macro Assembler for MS OS/2 and
	MS-DOS Operating Systems Version 5.1 Update" manual, it states that
	you can use the LOCAL directive with a structure. When this is done,
	you may receive the following errors:
	
	   A2003 Unknown Type Specifier
	   A2010 Syntax Error
	
	The following code demonstrates this problem:
	
	        .model small,c
	        .stack 100h
	
	        parms struc
	                p1 dw ?
	                p2 dw ?
	        parms ends
	
	        .code
	
	        call test_func
	
	        test_func proc
	             LOCAL stuff:parms ;A2003 Unknown type specifier
	             mov ax,0ffffh
	             mov stuff.p1,ax   ;A2010 Syntax error
	             mov stuff.p2,ax   ;A2010 Syntax error
	             ret
	        test_func endp
	
	        end
	
	Response:
	
	Microsoft has confirmed this to be a problem and will post additional
	information as it becomes available.
	
	To avoid the A2003 Unknown type specifier error, include the PTR
	keyword in the LOCAL directive. For example:
	
	        LOCAL stuff:ptr parms
	
	To avoid the A2010 Syntax error, use the MASM 5.10a update assembler.
	To obtain MASM5.10A, contact Microsoft Product Support at
	(206) 454-2030.
	/*MSINTERNAL
	/*CONFIRMED BY: ROLANDS
	/*BUGLIST INFO
	/*RAID DATABASE: MASM600
	/*BUG NUMBER: 788
	/*
