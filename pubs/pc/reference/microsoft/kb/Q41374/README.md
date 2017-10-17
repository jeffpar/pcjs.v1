---
layout: page
title: "Q41374: Assignment of Void Pointer Does Not Give Warning Message"
permalink: /pubs/pc/reference/microsoft/kb/Q41374/
---

## Q41374: Assignment of Void Pointer Does Not Give Warning Message

	Article: Q41374
	Version(s): 5.10 | 5.00 5.10
	Operating System: OS/2 | MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 16-MAY-1989
	
	The code below shows an inconsistency with the way that the Microsoft
	C and QuickC compilers deal with pointer checking. The ANSI Standard
	is unclear as to whether an assignment to a void pointer should be
	checked to see if it is being assigned a nonpointer variable. The code
	below shows that character pointers are checked while void pointers
	are not; the code will generate a warning message at the default
	warning level:
	
	Warning C4017 : '=' different levels of indirection
	
	int i;         /* includes float,double,char,long,unsigned */
	char * p;
	void * v;
	
	main() {
	    p = i;    /* this will give a warning message */
	    v = i;    /* this will not give a warning message */
	    }
