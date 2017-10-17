---
layout: page
title: "Q63052: PWB 1.00 Extensions Only Return True Under DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q63052/
---

## Q63052: PWB 1.00 Extensions Only Return True Under DOS

	Article: Q63052
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00
	Last Modified: 15-AUG-1990
	
	Extensions written for use by the Programmer's WorkBench (PWB) version
	1.00 under the DOS operating system are recognized as returning true
	regardless of their actual return values.
	
	The use of return values as a way of providing conditional jumps
	inside PWB macros is a common practice that is affected by the above
	limitation for PWB extensions. The following sample extension and
	macro demonstrate the above problem. Once installed, both the foo()
	and foo2() functions will be seen as returning true to PWB.
	
	Sample Code
	-----------
	
	// foo.c
	
	#include <string.h>
	#include <stdlib.h>
	#include <ext.h>
	
	PWBFUNC foo( unsigned argData, ARG far *pArg, flagType fMeta );
	PWBFUNC foo2( unsigned argData, ARG far *pArg, flagType fMeta);
	
	// Switches.
	struct swiDesc swiTable[] =
	{
	   { NULL, NULL, 0 }
	};
	
	// Commands.
	struct cmdDesc cmdTable[] =
	{
	   { "foo", foo, 0, NOARG },
	   { "foo2",foo2,0, NOARG },
	   { NULL, NULL, 0, 0 }
	};
	
	void EXTERNAL WhenLoaded()
	{
	    SetKey( "foo",         "alt+f" );
	    SetKey( "foo2",       "ctrl+f" );
	    return;
	}
	
	PWBFUNC foo( unsigned argData, ARG far *pArg, flagType fMeta )
	{
	 return(FALSE);  /* FALSE is defined as 0 in ext.h */
	}
	
	PWBFUNC foo2( unsigned argData, ARG far *pArg, flagType fMeta)
	{
	 return(TRUE);   /* TRUE is defined as 1 in ext.h  */
	}
	
	// End of foo.c
	
	; macros in tools.ini to test foo and foo2
	
	load foo
	
	test:=foo ->loc1 arg "true" message => :>loc1 arg "false" message
	test2:=foo2 ->loc2 arg "true" message => :>loc2 arg "false" message
	
	test:alt+t
	test2:ctrl+2
	
	Microsoft has confirmed this to be a problem with PWB version 1.00. We
	are researching this problem and will post new information here as it
	becomes available.
