---
layout: page
title: "Q46129: Problem with QuickC Inline Assembler INT Call and Typedefs"
permalink: /pubs/pc/reference/microsoft/kb/Q46129/
---

## Q46129: Problem with QuickC Inline Assembler INT Call and Typedefs

	Article: Q46129
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM buglist2.00
	Last Modified: 27-JUN-1989
	
	When compiled with QuickC Version 2.00, the code below compiles and
	gives the following message for the line containing the initialization
	of bar:
	
	   error C2064 : term does not evaluate to function
	
	Removing the parentheses from the 0 in the initialization causes the
	following message:
	
	   error C2143 : missing ')' before 'constant'
	
	Inline assembler code must contain an interrupt call (INT) for this
	error to occur. Using a simple type cast before the typedef'ed type
	cast solves the problem. In the following example, reverse the order
	of the initializations for bar and fad to put the simple typecast
	first.
	
	Code Example
	------------
	
	typedef unsigned short far *FOO;
	
	FOO   bar;
	float fad;
	
	    void main( void )
	    {
	        _asm { int 11h }
	
	        bar = ((FOO) (0));   /* reversing this line with the next */
	        fad = (float)3.4;    /* prevents the problem              */
	    }
	
	Microsoft has confirmed this to be a problem in QuickC Version 2.00.
	We are researching this problem and will post new information as it
	becomes available.
