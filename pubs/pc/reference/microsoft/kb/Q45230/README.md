---
layout: page
title: "Q45230: Conflict between Global and Local Variables When Debugging"
permalink: /pubs/pc/reference/microsoft/kb/Q45230/
---

## Q45230: Conflict between Global and Local Variables When Debugging

	Article: Q45230
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 13-SEP-1989
	
	The Microsoft QuickC Version 2.00 integrated debugger has a problem if
	a global variable in one source file has the same name as a local
	variable in another source file and that function has a printf()
	function call. The easiest workaround is to rename one of the
	variables. A problem description is given below.
	
	Microsoft has confirmed this to be a problem with the Microsoft QuickC
	Compiler Version 2.00. We are researching this problem and will post
	new information as it becomes available.
	
	The following two source files demonstrate this problem. To reproduce
	the problem, compile and link the two source files together. Step to
	the first executable line in the program and set a watch on the "foo"
	variable. Now step through the program and notice that the debugger
	does not show the correct value of foo after the assignment, although
	the sub() function will be called.
	
	Source File Example 1
	---------------------
	
	/* main.c */
	extern void sub(void);
	int foo;
	main() {
	    foo = 20;
	    if (foo == 20) sub();
	}
	
	/* sub.c */
	#include <stdio.h>
	void sub(void) {
	    int foo;
	    printf("test");
	}
	
	To get around this problem, rename one of the offending variables,
	remove the printf() from the sub() function, or add another assignment
	to any global variable before the "foo = 20;" line in the main()
	function.
	
	Source File Example 2
	---------------------
	
	/* main.c */
	extern void sub(void);
	int foo,temp;
	main() {
	    temp = 20;      /* could also say "foo = 20;" */
	    foo = 20;
	    if (foo == 20) sub();
	}
