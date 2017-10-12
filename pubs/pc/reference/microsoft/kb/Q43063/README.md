---
layout: page
title: "Q43063: Calls Stack Is Sometimes Incomplete"
permalink: /pubs/pc/reference/microsoft/kb/Q43063/
---

	Article: Q43063
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 2-MAY-1989
	
	In QuickC Version 2.00, the calls stack is incomplete under specific
	circumstances. When you select Debug menu, Calls option, and the
	current statement is the opening brace of a function, the calls stack
	omits the second function that should be in the list. This is the only
	function omitted and can be restored to the list by using F8 to trace
	one line further into the code.
	
	The calls stack is complete in QuickC Versions 1.00 and 1.01.
	
	The calls stack lists all function calls that led to the current
	function. It is used for repositioning the cursor to a calling
	function by selecting that function from the calls stack. This is
	useful because it allows you to press F7 to execute the code necessary
	to return to a calling function.
	
	Microsoft is researching this problem and will new post information as
	it becomes available.
	
	To demonstrate the problem, consider the following program:
	
	   void A (void);
	   void B (void);
	
	   void main (void)
	    {
	      A ();
	    }
	
	   void A (void)
	    {
	      B ();
	    }
	
	   void B (void)
	    {
	    }
	
	1. Press F8 once. Selecting menu Debug, option Calls will result in the
	   following display:
	
	      main()
	
	   This is correct.
	
	2. Press F8 twice. This procedure will trace into function A and
	   highlight the opening brace. Selecting Calls will now list the
	   following:
	
	      A()
	
	   This is incorrect. In addition to A(), main() should be listed.
	
	3. Press F8 again. Selecting Calls will now correctly list the
	   following:
	
	      A()
	      main()
	
	   Tracing past the initial brace of function A corrected the calls
	   stack.
	
	4. Press F8 again. Selecting Calls now lists the following:
	
	      B()
	      main()
	
	   This is once again incorrect. Between B() and main(), A() should be
	   listed.
