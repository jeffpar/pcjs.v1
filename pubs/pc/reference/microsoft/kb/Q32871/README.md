---
layout: page
title: "Q32871: Write Function Will Not Work Correctly with SS!=DS"
permalink: /pubs/pc/reference/microsoft/kb/Q32871/
---

	Article: Q32871
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 19-JUL-1988
	
	Problem:
	   I have a program that needs to be run in an SS!=DS environment and
	I am trying to use the write function; however, it does not seem to be
	working.
	
	Response:
	   The write function will not work correctly in SS!= DS in text
	mode. It should work properly in binary mode. In text mode, write()
	builds a buffer on the stack to do LF to CR/LF translation. It makes a
	call to stackavail() to make sure it does not overflow the stack; this
	call is what prevents it from working with SS!=DS.
	   This is program design for this product.
