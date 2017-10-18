---
layout: page
title: "Q32773: LOCAL Directive Incorrect for Large Types"
permalink: /pubs/pc/reference/microsoft/kb/Q32773/
---

## Q32773: LOCAL Directive Incorrect for Large Types

	Article: Q32773
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10 | fixlist5.10A
	Last Modified: 10-JUL-1990
	
	The LOCAL directive allocates two bytes too few when applied to
	data items with type larger than word.
	   Microsoft has confirmed this to be a problem in Version 5.10.
	The 5.10A MASM update is available as an applications note, from
	Microsoft Product Support Services.
	
	   The following source example demonstrates the problem:
	
	.model large
	.code
	foo    proc
	       local l1:byte
	       local l2:word
	       local l4:dword
	       local l6:fword
	       local l8:qword
	       local l10:tword
	       ret
	foo    endp
	end
	
	   The listing file below illustrates the incorrect offsets generated:
	
	L1 ........................ TEXT    BYTE PTR [BP]-2
	L10........................ TEXT    TBYTE PTR [BP]-24
	L2......................... TEXT    WORD PTR [BP]-4
	L4......................... TEXT    DWORD PTR [BP]-6
	L6......................... TEXT    FWORD PTR [BP]-10
	L8......................... TEXT    QWORD PTR [BP]-16
