---
layout: page
title: "Q44300: Internal Compiler Error: omf.c:1.70 Line 146"
permalink: /pubs/pc/reference/microsoft/kb/Q44300/
---

## Q44300: Internal Compiler Error: omf.c:1.70 Line 146

	Article: Q44300
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 30-MAY-1989
	
	The following error message is produced when the example below is
	compiled with the Microsoft C Optimizing Compiler Version 5.10:
	
	   fatal error C1001: Internal Compiler Error
	                   (compiler file '@(#)omf.c:1.70', line 146)
	                   Contact Microsoft Technical Support
	
	To prevent the error message, reverse the order of the #pragma and
	#include directives.
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching the problem and will post new information as it becomes
	available.
	
	Support for the data_seg pragma may be eliminated from future releases
	of the C Optimizing Compiler. We recommend that you use the /ND
	compiler option which provides equivalent functionality.
	
	The following example demonstrates the problem:
	
	#include "os2def.h"            /* os2def.h from IBM's toolkit v1.1 */
	#pragma data_seg( global )
	
	char *errors[] = {
	   "no error",
	   "unknown error"
	  };
	
	To prevent the problem, reverse the order of the #pragma and #include
	directives, as follows:
	
	#pragma data_seg( global )
	#include "os2def.h"
