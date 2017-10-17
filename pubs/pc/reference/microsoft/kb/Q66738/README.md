---
layout: page
title: "Q66738: Results Unpredictable with Multiple va_arg() in Parameter List"
permalink: /pubs/pc/reference/microsoft/kb/Q66738/
---

## Q66738: Results Unpredictable with Multiple va_arg() in Parameter List

	Article: Q66738
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 15-JAN-1991
	
	Because the order of expression evaluation is not always defined in C,
	certain behavior depends strictly on the particular C implementation.
	This is demonstrated by the sample program below, which shows the
	unpredictable values passed to a function when the va_arg() macro is
	used more than once in a function parameter list.
	
	Sample Code
	-----------
	
	#include<stdio.h>
	#include<stdarg.h>
	
	void foo(int, ...);
	
	void main(void)
	{
	     foo(1, 2, 3, 4);
	}
	
	void foo(int first, ...)
	{
	     va_list arg_ptr;
	     va_start(arg_ptr, first);
	
	     printf("%d %d %d %d\n",first, va_arg(arg_ptr, int),
	                                   va_arg(arg_ptr, int),
	                                   va_arg(arg_ptr, int));
	}
	
	When compiled under C version 5.10, the output is as follows:
	
	   1 4 3 2
	
	When compiled under C version 6.00 or C 6.00a, the output is as
	follows:
	
	   1 4 4 4
	
	The va_arg() macro provides a way to access the arguments of a
	function when the function takes a variable number of arguments. The
	va_arg() macro returns a variable parameter by referencing the pointer
	(arg_ptr) to the list of arguments and then increments this pointer to
	point to the next variable argument. Thus, the values passed to the
	printf() function in the above example depend on the order in which
	the va_arg() macros are evaluated.
	
	However, the C language does not guarantee the evaluation order of
	most expressions, so code should never be written in a way that
	depends on the evaluation order within an expression to proceed in a
	particular manner. The output of the sample code above demonstrates
	the undefined behavior and the unwanted side effects that may result
	from this type of code just from compiling it under different versions
	of the compiler.
	
	To preserve the original order of the arguments in the sample above,
	the va_arg() macro must be used only once in a single expression. One
	method is to use a loop to call the va_arg() macro once every
	iteration. The loop will process the variable arguments one by one and
	stop when the last parameter is reached. This can be done by passing
	an additional parameter as a flag to the function foo.
	
	The following is a corrected version of the program where the
	expressions are independent of evaluation order:
	
	Corrected Sample Code
	---------------------
	
	#include<stdio.h>
	#include<stdarg.h>
	
	void foo(int, ...);
	
	void main(void)
	{
	     foo(1, 2, 3, 4, -1);     /* using -1 as a flag */
	}
	
	void foo(int first, ...)
	{
	     int temp;
	     va_list arg_ptr;
	     va_start(arg_ptr, first);
	
	     temp=first;
	     while(temp != -1)        /* test for flag -1 */
	     {
	          printf("%d ", temp);
	          temp=va_arg(arg_ptr, int);
	     }
	}
	
	The output is as follows:
	
	    1 2 3 4
