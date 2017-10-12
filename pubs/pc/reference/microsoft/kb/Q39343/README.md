---
layout: page
title: "Q39343: Sizeof an Undeclared Struct Causes Violation in OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q39343/
---

	Article: Q39343
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 29-DEC-1988
	
	The code below causes a General Protection Violation under OS/2 when
	compiled with Version 5.10 of the C compiler. The code contains an
	error; it attempts to determine the size of an undeclared structure
	"q_block" using the sizeof() function.
	
	This problem does not exist if the code error is corrected or if the
	include file (OS2.H) is left out.
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
	
	The following code demonstrates the problem:
	
	#define   INCL_BASE
	#include  <os2.h>
	
	struct  q_blok  {
	    char          data[80];
	    };
	
	int   add_to_queue( int num, char *pd )
	{
	  size = sizeof (struct q_block) ;   /* error: should read 'q_blok' */
	
	  /* size = sizeof (struct q_blok) ;    Corrected code.             */
	}
