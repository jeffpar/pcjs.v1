---
layout: page
title: "Q44564: Short Jump to 80 Bytes Forward Generated with C 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q44564/
---

	Article: Q44564
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 19-SEP-1989
	
	The C Version 5.10 compiler has been shown to produce code for a short
	jump 0x80 bytes forward. However, when this code is executed, it jumps 0x80
	bytes backward because the number is considered negative. Source code
	that exemplifies this problem is too large to post here, and the
	problem disappears with almost any change to the source code.
	
	Microsoft has confirmed this to be a problem with C Version 5.10. We
	are researching this problem and will post new information as it
	becomes available.
	
	The executable file symptoms can range from hanging to infinite
	looping.
	
	The following is an excerpt from a .COD file produced by the C 5.10
	compiler when compiled with /AL /Ox. The second assembly statement for
	Line 79 shows the incorrect jump (je $FB331) of 80 hex bytes.
	
	;|***         if(didid == -1)
	; Line 79
	  *** 00034f 83 be 52 fe ff  cmp WORD PTR [bp-430],-1 ;didid
	  *** 000354 74 80           je  $FB331
	;|***              break;
	; Line 80
	                    .
	                    .
	                    .
	
	  *** 0003d1 2a e4           sub ah,ah
	  *** 0003d3 e9 62 fe        jmp $L20017
	                   $FB331:
