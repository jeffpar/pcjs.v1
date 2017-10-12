---
layout: page
title: "Q46896: CALLTREE Produces Argument Mismatch with Void Parameter List"
permalink: /pubs/pc/reference/microsoft/kb/Q46896/
---

	Article: Q46896
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_calltree buglist1.00 s_editor
	Last Modified: 15-JAN-1991
	
	The CALLTREE utility program included with the Microsoft C version
	5.10 produces the following error message if a void parameter list is
	used for the function foo() and the options -a and -b are specified on
	the command line:
	
	   Argument Mismatch Calling        foo  in  main.c(10)
	
	Microsoft has confirmed this to be a problem in version 1.00. We are
	researching this problem and will post new information here as it
	becomes available.
	
	The CALLTREE utility program can be used to produce a tree-like
	structure of function usage. Documentation on the options for CALLTREE
	can be found in the C 5.10 CodeView and Utilities manual in the
	"Microsoft Editor for the MS OS/2 and MS-DOS Operating Systems: User's
	Guide," section on pages 112-114.
	
	The following program demonstrates the problem:
	
	void foo(void);   /* prototye contains (void) */
	
	void main(void)
	{
	  foo();     /* function call does not contain (void) */
	             /* replace with foo(void); to prevent warning message */
	}
	
	void foo(void)
	{
	  printf("Inside foo\n");
	}
	
	Invoke CALLTREE by issuing the following command:
	
	calltree -a -b back.out -w warn.out main.c
	
	The "warn.out" file will now contain the error message:
	
	   Argument Mismatch Calling        foo  in  main.c(5)
