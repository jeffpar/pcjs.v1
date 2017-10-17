---
layout: page
title: "Q52103: Casting Large Double to Float Gives Compile or Run-Time Error"
permalink: /pubs/pc/reference/microsoft/kb/Q52103/
---

## Q52103: Casting Large Double to Float Gives Compile or Run-Time Error

	Article: Q52103
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 10-JAN-1990
	
	Casts of double numbers (greater than 3.4E+38) to float numbers can
	cause serious problems at compile time or at run time. Although this
	is expected behavior, it is inconsistent with typical overflow casting
	in that no errors or warnings are produced by the compiler when
	nonfloat overflow casts are made.
	
	In addition, overflowing a float by casting it to a double constant
	may cause the compiler to generate several lines of random characters.
	
	Microsoft has confirmed this random character generation to be a
	problem with C Version 5.10. We are researching this problem and will
	post new information as it becomes available.
	
	If a constant that is greater than 3.4E+38 (the maximum float) is cast
	to a float, the compiler will fail with the following error:
	
	   fatal error C1045: floating point overflow
	
	The following code sample demonstrates the compile error:
	
	     /* This code when compiled will produce compiler error code
	        C1045. */
	
	     void main(void)
	     {
	          float f;
	
	          f = (float)6e39;
	          /* All numbers up to 3.4e38 work fine */
	     }
	
	If a double return value (greater than 3.4E+38) is cast to a float,
	the following run-time error message is displayed:
	
	   run-time error M6104: MATH
	   -floating-point error: overflow
	
	This following code sample demonstrates the run-time error:
	
	     /* This code will compile fine but produces a run-time error
	        M6104. */
	
	     #include <stdlib.h>
	
	     void main(void)
	     {
	         float f;
	
	         f = (float)atof("6e39");
	         /* Once again, all numbers up to 3.4e38 work fine */
	     }
	
	On the other hand, the following integer cast overflow demonstrates
	that on a nonfloating point cast overflow, no errors are produced:
	
	     /* The following code produces no compiler errors, warnings
	        (even at warning level 3), or run-time errors. */
	
	     #include <stdio.h>
	
	     void main(void)
	     {
	         int i;
	
	         i = (int)70000;
	         /* The signed integer i is overflowed in this case and will
	            probably produce unintended results. */
	     }
	
	There is no workaround regarding the casting of double constants to
	floats at compile time other than eliminating the offending cast from
	the code. On the other hand, the problem with the floating point
	overflow error at run time can be caught by using the signal()
	function to trap floating point exceptions. However, both problems can
	be avoided if you ensure that a value greater than 3.4E+38 (maximum
	float value as determined by the IEEE standard for 4 byte floating
	point numbers) is never assigned to a float.
