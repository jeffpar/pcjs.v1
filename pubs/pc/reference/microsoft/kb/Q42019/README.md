---
layout: page
title: "Q42019: Missing Closing ")" on Macro Causes C1004 Unexpected-EOF Error"
permalink: /pubs/pc/reference/microsoft/kb/Q42019/
---

	Article: Q42019
	Product: Microsoft C
	Version(s): 5.10    | 5.10
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 16-MAY-1989
	
	The Microsoft C Version 5.10 Optimizing Compiler generates the
	following error message when the compiler encounters an incomplete
	macro invocation:
	
	   fatal error C1004: unexpected EOF
	
	A macro in the program missing a closing-right parenthesis causes this
	error to occur. The Microsoft Quick C Compiler Version 2.00 also
	generates this error. Microsoft C Versions 5.00 and 4.00 and QuickC
	Version 1.01 generate the following error:
	
	   C1057 unexpected EOF in macro expansion ( missing ')'? )
	
	Now the macro expander uses the same code to read characters when
	looking for an actual as it does to read any character. When we get
	the EOF, we cannot distinguish between a macro or the end of the code.
	This is correct behavior for C Version 5.10.
	
	The following is a sample piece of code that demonstrates this error:
	
	#include <stdio.h>
	#define add(wx, wy)  (wx) + (wy)
	void main(void)
	{
	int i;
	i = add( 1, 2 );
	printf( "i = %d\n", i );
	
	i = add( 1, 2 ;                 /* Causes C1004: unexpected EOF */
	
	printf( "Hello World\n" );
	for( i = 0; i < 10; i++ )
	        {
	        printf( "i + 10 = %d\n", add( i, 10 ) );
	        }
	}
