---
layout: page
title: "Q42830: Exception #13 at xxxx:xxxx Error Code 0 Caused by QEMM"
permalink: /pubs/pc/reference/microsoft/kb/Q42830/
---

	Article: Q42830
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC H_MASM B_QUICKBAS B_BASCOM
	Last Modified: 25-JUL-1990
	
	A call to Quarterdeck Office Systems has confirmed that their
	Quarterdeck Expanded Memory Manager (QEMM) driver is responsible for
	the following error message reported by several customers:
	
	    Exception #13 at xxxx:xxxx
	    Error code 0
	    Terminate, Reboot or Continue?
	
	This message indicates that an error was detected by the Quarterdeck
	memory manager. This error is essentially the same as a general
	protection fault in OS/2 and typically indicates that a stray pointer
	is involved.
	
	The error may occur either while the program is executing or after
	execution has ended and the program is returning to DOS. A technician
	at Quarterdeck stated that they generally use CodeView to track down
	such errors, and that while the address printed in the error
	diagnostic does not necessarily indicate the precise location of the
	error, it does indicate the location at which the error was first
	detected.
