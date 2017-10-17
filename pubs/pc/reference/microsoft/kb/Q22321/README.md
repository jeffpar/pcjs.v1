---
layout: page
title: "Q22321: The Most Common C Programming Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q22321/
---

## Q22321: The Most Common C Programming Errors

	Article: Q22321
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	The following is a list of the most common C programming errors. Any
	of these items could cause unpredictable results, such as trashed data
	or a system hang.
	
	 1. Using auto variables that have not been initialized.
	
	 2. Leaving out the closing comment delimiter.
	
	 3. Over-indexing an array.
	
	 4. Leaving out a semicolon (;) or brace ({}).
	
	 5. Using uninitialized pointers.
	
	 6. Using break with an IF block, since break does not exit out of IF
	    blocks. It only breaks you out of WHILE, FOR, or SWITCH loops.
	
	 7. Comparing a char variable against EOF, as in the following
	    example:
	
	       char c;
	       while ((c=getchar()) != EOF)
	           {
	           }
	
	    If c is a char, you cannot test c against EOF because a -1 cannot
	    fit into a character, so c must be an int.
	
	 8. Using a forward slash instead of a backslash (for example, /n
	    instead of \n).
	
	 9. Using = instead of == in a comparison.
	
	10. Overwriting the null terminator (the last byte) in a string by
	    indexing 1 byte too far.
	
	11. Placing a semicolon improperly, as in the following example:
	
	       void foo(int a,char b);   /* semicolon does not belong here */
	       {  }
	
	12. Forgetting that scanf() expects addresses.
	
	13. Using the wrong return value for a function. For example, a
	    function that returns a real, but is not declared, will return an
	    int by default.
	
	14. Using expressions with side effects. For example, a[i] = i++; is
	    ambiguous.
	
	15. Forgetting that static variables inside functions are initialized
	    only once.
	
	16. Unintentionally omitting a break from a case label in a switch
	    statement, and therefore, falling through to the next case.
