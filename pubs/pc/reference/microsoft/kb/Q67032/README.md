---
layout: page
title: "Q67032: C1001: exphelp.c, Line 370 and regMD.c, Line 725"
permalink: /pubs/pc/reference/microsoft/kb/Q67032/
---

## Q67032: C1001: exphelp.c, Line 370 and regMD.c, Line 725

	Article: Q67032
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 28-NOV-1990
	
	Compiling the sample code below with Microsoft C versions 6.00 and
	6.00a using any combination of optimizations that have /Oe included
	will result in the following internal compiler error:
	
	Internal Compiler Error in C 6.00
	---------------------------------
	
	   foo.c(17) : fatal error C1001: Internal Compiler Error
	           (compiler file '@(#)exphelp.c:1.115', line 370)
	           Contact Microsoft Product Support Services
	
	Internal Compiler Error in C 6.00a
	----------------------------------
	
	   foo.c(17) : fatal error C1001: Internal Compiler Error
	           (compiler file '@(#)regMD.c:1.110', line 725)
	           Contact Microsoft Product Support Services
	
	Disabling the /Oe optimization will correct this error.
	
	Sample Code
	-----------
	
	void foo(int boo, int hoo)
	{
	        int x;
	        int y;
	        int Foo[4];
	        int Bar[4];
	        int i;
	
	        for (i=0; i<4; i++) Foo[i] = Bar[i] = i;
	        if (boo)
	        {
	                y = Foo[hoo];
	                x = Bar[boo];
	                Foo[x] = y;
	                Foo[hoo] = boo;
	                Bar[boo] = hoo;
	        }
	}
	
	Microsoft has confirmed this to be a problem in Microsoft C versions
	6.00 and 6.00a. We are researching this problem and will post new
	information here as it becomes available.
