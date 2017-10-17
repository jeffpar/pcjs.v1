---
layout: page
title: "Q32841: How Bitfields Are Stored in Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q32841/
---

## Q32841: How Bitfields Are Stored in Memory

	Article: Q32841
	Version(s): 1.04 2.03 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS                        | OS/2
	Flags: ENDUSER |
	Last Modified: 19-JUL-1988
	
	The Microsoft C compiler stores bitfields from low memory to high
	memory. For example, if you have the following declaration:
	
	           struct   {
	                   unsigned field_one:3;
	                   unsigned field_two:9;
	                   unsigned field_three:5;
	           };
	
	then "field_one" will be stored in bits 0-2 in the first word,
	"field_two" will be stored in bits 3-11 in the same word, and
	"field_three" will be stored in bits 0-4 of the second word (because
	it cannot fit in the 4 bits remaining in the current word).
