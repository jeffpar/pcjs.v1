---
layout: page
title: "Q62771: Record Number for PUT/GET Statement Can Be a Long Integer"
permalink: /pubs/pc/reference/microsoft/kb/Q62771/
---

## Q62771: Record Number for PUT/GET Statement Can Be a Long Integer

	Article: Q62771
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900319-92 docerr
	Last Modified: 8-JAN-1991
	
	Pages 147 and 280 in the "Microsoft BASIC 7.0: Language Reference"
	and Page 110 in the "Microsoft BASIC 7.0: Programmer's Guide"
	incorrectly state that when specifying the record number in a GET/PUT
	statement for a random file or the position number for a binary file,
	the record or position number should be an integer.
	
	The explanation for the GET/PUT statement should describe the record
	or position number as being either an integer or a long integer.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The correct syntax for the GET/PUT statement is as follows:
	
	  {GET|PUT} [#]filenumber% [, [recordnumber&] ] [, [variable] ]
	
	When accessing a random file, "recordnumber&" represents the number of
	the record to be read or written. When accessing a binary file,
	"recordnumber&" represents the byte position of where the reading or
	writing starts.
	
	The online Help for BASIC PDS 7.00 and 7.10 correctly describes the
	record number as "recordnumber&". The following documentation,
	however, incorrectly describes the record number as "recordnumber%":
	
	1. Page 110 of the "Microsoft BASIC 7.0: Programmer's Guide" for
	   7.00 and 7.10
	
	2. Pages 147 and 280 of the "Microsoft BASIC 7.O: Language Reference"
	   manual for 7.00 and 7.10
	
	By specifying the recordnumber variable as "recordnumber&" instead of
	"recordnumber%", it is inferred that the record number variable may
	either be of type INTEGER or LONG INTEGER.
	
	Using recordnumber% would suggest that the largest possible record
	number to be 32,767. Since the largest possible record number is
	2,147,483,647, the record number should be described as recordnumber&.
