---
layout: page
title: "Q67886: VAL() Fails When BASIC 7.10 NOFLTIN.OBJ Stub File Is Linked"
permalink: /pubs/pc/reference/microsoft/kb/Q67886/
---

## Q67886: VAL() Fails When BASIC 7.10 NOFLTIN.OBJ Stub File Is Linked

	Article: Q67886
	Version(s): 7.10   | 7.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist7.10
	Last Modified: 2-JAN-1991
	
	Any argument passed to the VAL() function makes VAL() return zero or
	incorrect results in a program linked with the NOFLTIN.OBJ file from
	BASIC PDS version 7.10.
	
	Microsoft has confirmed this to be a problem with Microsoft BASIC
	Professional System (PDS) version 7.10 for MS-DOS and MS OS/2. We are
	researching this problem and will post new information here as it
	becomes available. (This problem does not occur in BASIC PDS 7.00.)
	
	The code example below prints an incorrect result for VAL() at run
	time when linked with the BASIC 7.10 stub file NOFLTIN.OBJ.
	
	' File name: STUB.BAS
	d$ = "5"
	PRINT VAL(D$)   ' Is supposed to print "5".
	
	Compile and link with the following command lines:
	
	   BC STUB.BAS /O;
	   LINK /NOE STUB.OBJ+NOFLTIN.OBJ;
