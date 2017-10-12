---
layout: page
title: "Q43648: Returning Control to CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q43648/
---

	Article: Q43648
	Product: Microsoft C
	Version(s): 2.20
	Operating System: MS-DOS
	Flags: ENDUSER | CONTROL-C CONTROL+C CONTROL+BREAK CONTROL-BREAK ^C ^BREAK
	Last Modified: 3-MAY-1989
	
	The following are two software methods of returning control to
	CodeView during program execution:
	
	1. Use the debug interrupt, interrupt 03, in your code. Interrupt 03
	   is called a microprocessor (or logical) interrupt. It is the
	   interrupt that CodeView uses to make breakpoints. Hard code
	   interrupt 03 into your code in selected places where you want to
	   return control to CodeView. The following sample program will
	   demonstrate the technique. Note that a macro could easily be
	   constructed to insert breakpoints where desired.
	
	        #include <dos.h>
	        #include <stdio.h>
	
	        void main()
	        {
	            union REGS    inregs;
	            int           i = 1;
	
	            for( ;; )
	            {
	                printf( "Loop iteration: %d\n", i++ );
	                int86( 0x03, &inregs, &inregs );
	            }
	
	2. Use CTRL+C and CTRL+BREAK to return control to CodeView. This is
	   a useful method for breaking out of a program is currently running
	   or that has locked up.  The position in the source code to which
	   you are returned depends on when you hit the ^C and what caused
	   the system to hang, e.g. an infinite loop, a bad pointer, etc.
	   Execution may be continued from this point in the usual manner
	   (F5, F8, F10, etc.).
	
	   Under OS/2 CTRL+BREAK does not return control to CodeView. CTRL+C
	   may be used to abort a normally executing program but you cannot
	   continue to debug from that point as you can in DOS.
	
	There is no hardware interrupt that will return control to CodeView.
