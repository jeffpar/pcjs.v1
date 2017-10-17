---
layout: page
title: "Q45536: LINK 5.02 Should Not Be Used with ILINK 1.10"
permalink: /pubs/pc/reference/microsoft/kb/Q45536/
---

## Q45536: LINK 5.02 Should Not Be Used with ILINK 1.10

	Article: Q45536
	Version(s): 5.02
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC
	Last Modified: 30-AUG-1989
	
	LINK Version 5.02, which comes as a secondary linker for QuickC 2.00,
	should not be used with ILINK Version 1.10, which also comes with
	QuickC 2.00.
	
	Inside the QuickC environment, this combination has caused problems
	with floating point-values being printed with printf. Outside of the
	environment, the same executable results in math error M6104.
	
	The source code below prints "FP = 0.00000" instead of "FP =
	5.020000". Running from the DOS prompt, in this case, produces the
	same results.
	
	Source Code
	-----------
	
	    #include <stdio.h>
	
	    void main( void )
	    {
	        float fp = 5.02F;
	
	        printf( "FP = %f\n", fp );
	    }
	
	LINK Version 4.06 should be used if ILINK is also to be used. If it is
	necessary to use Version 5.02 of the linker, incremental linking
	should be disabled from within the environment.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
