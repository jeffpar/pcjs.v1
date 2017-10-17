---
layout: page
title: "Q38024: A Case where BUFF"
permalink: /pubs/pc/reference/microsoft/kb/Q38024/
---

## Q38024: A Case where BUFF

	Article: Q38024
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-NOV-1988
	
	When the variable buff has been declared in an assembly-language
	program, such as the following
	
	        .data
	        public buff
	_buff   db 200 dup (0xab)
	        .data ends
	
	there is a difference between the two following C declarations:
	
	   extern unsigned char buff[];
	
	   extern unsigned *buff;
	
	The difference is that the first declaration says that there
	is a block of memory that is named buff; the second says
	that there is something called buff that is a pointer.
	
	This difference can be seen by referencing buff as follows:
	
	   buff[x]
	
	If buff is declared as an array, the referencing is correct.
	
	However, if buff is declared as a pointer, the referencing is
	incorrect. The data pointed to by buff (ab in this example) is
	translated into a memory address, then x bytes is added to it
	generating an incorrect reference.
