---
layout: page
title: "Q30379: Structure References Using '.' Cause Confusion"
permalink: /pubs/pc/reference/microsoft/kb/Q30379/
---

## Q30379: Structure References Using '.' Cause Confusion

	Article: Q30379
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	Variable names in the assembler can begin with following the
	character:
	
	   '.'
	
	   Structure references use the character '.' as an add operator. This
	means the label '.cat' is different than the element 'cat' in a
	structure.
	   The assembler can become confused using distinguishing the two
	uses in a program, and can generate the following error message:
	
	   Error A2028: Operator expected' occurs on 'mov ax,duck.cat'
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
	
	   The following is an example program:
	
	       .MODEL SMALL
	   mouse  struc
	   cat     dw   1
	   dog     dw   2
	   mouse  ends
	       .DATA
	   duck    mouse  <>
	       .CODE
	   start:  mov  ax,@data
	           mov  ds,ax
	   .cat    dw   4
	           mov  ax,duck.cat
	    END start
