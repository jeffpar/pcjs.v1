---
layout: page
title: "Q40606: Internal Compiler Error getattrib.c from typedef"
permalink: /pubs/pc/reference/microsoft/kb/Q40606/
---

## Q40606: Internal Compiler Error getattrib.c from typedef

	Article: Q40606
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 16-MAY-1989
	
	The code below causes the following error in the C Version 5.10
	compiler:
	
	   Fatal error C1001:  Internal Compiler Error
	   (Compiler file '@(#)getattrib.c:1.42' line 170)
	   Contact Microsoft Tech Support
	
	In C Version 5.00, the error will be in the following:
	
	   (Compiler file '@(#)getattrib.c:1.40' line 162)
	
	In the QuickC compilers, it has random results, including hanging the
	machine, returning to the editor after compilation with no messages,
	and entering debug mode.
	
	The following code demonstrates the problem:
	
	typedef struct {
	               char  foo;
	               float bar;
	               int   baz;
	               }                /* missing declarator, semicolon */
	void main(void)
	{
	}
	
	The error occurs whenever the declarator and terminating semicolon are
	both omitted. If the declarator is present, but there is no semicolon,
	then the compiler catches the error.
	
	The declarator and semicolon are both syntactically mandatory to
	conform to the ANSI draft standard; however, C Versions 5.x0 and
	QuickC Versions 1.0x allow a typedef without a declarator to compile
	if the semicolon is present. The proper statement is as follows:
	
	typedef struct {
	               char  foo;
	               float bar;
	               int   baz;
	           }  boink;
	
	void main(void)
	{
	}
