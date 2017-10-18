---
layout: page
title: "Q68071: MASM Aligns on 4-Byte Boundary After Offset 8000h"
permalink: /pubs/pc/reference/microsoft/kb/Q68071/
---

## Q68071: MASM Aligns on 4-Byte Boundary After Offset 8000h

	Article: Q68071
	Version(s): 5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist5.10 buglist5.10a
	Last Modified: 6-FEB-1991
	
	The module below demonstrates a problem with the Macro-Assembler. If
	an EVEN directive is used after an offset of 8000h within a segment,
	the assembler will try to align the next instruction or data element
	on a 4-byte boundary. In other words, more bytes for padding will be
	added than are necessary to achieve even alignment.
	
	Microsoft has confirmed this to be a problem in MASM versions 5.10 and
	5.10a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	 _TEXT SEGMENT
	   ASSUME CS:_TEXT
	   clc
	   even
	   clc
	   org 8000h
	   clc
	   even
	   clc
	
	 _TEXT ENDS
	 ENDS
	
	ASSEMBLY LISTING
	----------------
	
	Code Generated   Source
	--------------   ------
	
	F8               clc
	90               even
	F8               clc
	                 org 8000h
	F8               clc
	87 DB 90         even
	F8               clc
