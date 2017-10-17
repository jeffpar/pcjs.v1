---
layout: page
title: "Q38027: Two's Complement"
permalink: /pubs/pc/reference/microsoft/kb/Q38027/
---

## Q38027: Two's Complement

	Article: Q38027
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 16-NOV-1988
	
	Question:
	
	What is two's complement?
	
	Response:
	
	In most of the C compilers, including Microsoft C Compiler, negative
	values are represented internally in two's complement format. Two's
	complement can be obtained by negating each bit of the value, then
	adding 1. Performing two's complement twice generates the original
	value.
	
	The following is an example:
	
	Original value           | Two's complement
	-------------------------|------------------------------
	(dec)   (hex)  (binary)  | (dec)   (hex)   (binary)
	127     0x7f   01111111  | -127    0x81    10000001
	111     0x6f   01101111  | -111    0x91    10010001
	-111    0x91   10010001  | 111     0x6f    01101111
