---
layout: page
title: "Q46735: Loop Optimization May Cause Improper Type Cast of int"
permalink: /pubs/pc/reference/microsoft/kb/Q46735/
---

	Article: Q46735
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1989
	
	In certain situations, compiling with loop optimization may cause a
	type cast of an int to a long or unsigned long to produce an incorrect
	value if the cast precedes a loop. When an int is type cast to a long,
	the correct conversion sign extends. Thus, a negative integer remains
	negative. On the other hand, when casting an int to an unsigned long,
	the correct conversion is to sign extend to long, THEN convert the
	long to unsigned long. This means a negative integer will be cast to a
	really huge positive number when cast to an unsigned long. This
	expected behavior is documented on page 141 of the "Microsoft C 5.1
	Optimizing Compiler Language Reference." Loop optimization may cause
	errors in both of these type casts. Disabling loop optimization or
	rearranging the code corrects the problem.
	
	The following program, when compiled with the /Oal or /Ox option,
	displays this erroneous type casting. In the third assignment
	statement, -31536 is cast to a long and assigned to lNum. The result
	should still be -31536, but lNum ends up being 34000. The fourth
	assignment statement casts this same number to an unsigned long and
	assigns it to ulNum. The expected result, as described above, is the
	huge positive number 4294935760, but the value assigned to ulNum is
	again 34000.
	
	Program Sample
	--------------
	
	#include <stdio.h>
	
	void main(void)
	{
	   int iNum;
	   unsigned uNum;
	   long lNum;
	   unsigned long ulNum;
	
	        lNum = 34000;
	        printf ("lNum = %ld\n", lNum);
	        iNum = (int) lNum;
	        printf ("iNum = (int) lNum = %d \n", iNum);
	        lNum = (long) iNum;
	        printf ("lNum = (long) iNum = %ld \n", lNum);
	        ulNum = (unsigned long) iNum;
	        printf ("ulNum = (unsigned long) iNum = %lu \n", ulNum);
	
	        for (lNum = 0L; lNum < 17 ; lNum += 1)
	               ;
	        printf ("%s", "done");
	}
	
	The following is the program output:
	
	lNum = 34000                                <== Correct
	iNum = (int) lNum = -31536                  <== Correct
	lNum = (long) iNum = 34000                  <== WRONG! (should be -31536)
	ulNum = (unsigned long) iNum = 34000        <== WRONG! (should be 4294935760)
	done
