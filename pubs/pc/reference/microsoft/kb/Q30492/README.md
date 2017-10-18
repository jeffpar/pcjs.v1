---
layout: page
title: "Q30492: LOCAL Directive with Structure Type"
permalink: /pubs/pc/reference/microsoft/kb/Q30492/
---

## Q30492: LOCAL Directive with Structure Type

	Article: Q30492
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 10-JUL-1990
	
	Page 42 of the MASM 5.10 update states that the LOCAL directive
	accepts a name of a structure defined by a STRUC structure declaration
	such as the one below:
	
	xy   STRUC
	        x     DW   ?
	        y     DW   ?
	xy   ENDS
	
	foo  PROC               ;Assembler responds with
	     LOCAL   abc : xy   ;error A2003: Unknown type specifier
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
	/*MSINTERNAL
	/*CONFIRMED BY: ROLANDS
	/*BUGLIST INFO:
	/*RAID DATABASE: M600
	/*BUG NUMBER: 788
	/*
