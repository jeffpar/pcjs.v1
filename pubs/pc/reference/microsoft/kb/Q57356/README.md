---
layout: page
title: "Q57356: &quot;Overflow&quot; Accessing &gt; 32K Array Inside User-Defined TYPE"
permalink: /pubs/pc/reference/microsoft/kb/Q57356/
---

## Q57356: &quot;Overflow&quot; Accessing &gt; 32K Array Inside User-Defined TYPE

	Article: Q57356
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S891113-17 buglist7.00
	Last Modified: 14-JAN-1990
	
	When a program is compiled with the /D switch, the length of arrays
	inside user-defined TYPEs is limited to 32,768 bytes. The compiler
	will not generate an error if a larger array is declared inside a
	user-defined type, but accessing any element that is offset more than
	32,768 bytes into the array will cause an "Overflow" error.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2. We are researching this problem and will report new information
	here as it becomes available.
	
	This limitation applies only to arrays inside user-defined TYPEs, a
	new feature that was introduced in BASIC PDS 7.00 for MS-DOS and MS
	OS/2.
	
	The following two examples illustrate when the "Overflow" error occurs
	and when it doesn't.
	
	Example 1
	---------
	
	When compiled with the BC /D switch, this program generates an
	"Overflow" error. This is because element 16,385 of the INTEGER array
	inside of the user-defined TYPE is being accessed. 16,385 * 2 (2 bytes
	per INTEGER) is greater than 32,768, so that element is out of bounds.
	
	TYPE aType
	   anArray (1 TO 16385) AS INTEGER  'The compiler will not
	                                    'flag this as an error -
	END TYPE                            '(16385*2) > 32768
	DIM aVariable as aType
	
	FOR i = 1 TO 16385
	   aVariable.anArray(i) = 1   'When i = 16385 the "Overflow"
	NEXT i                        'error will be generated.
	
	Example 2
	---------
	
	The following program does not generate an "Overflow" error. This is
	because the highest element of the INTEGER array inside the
	user-defined type being accessed is 16,384. 16,384 * 2 (2 bytes per
	INTEGER) is not greater than 32,768, so the element is not out of
	bounds.
	
	TYPE aType
	   anArray (1 TO 16385) AS INTEGER  'The compiler will not
	                                    'flag this as an error -
	END TYPE                            '(16385 * 2) > 32768
	DIM aVariable as aType
	
	FOR i = 1 TO 16384
	   aVariable.anArray(i) = 1   'No "Overflow" error -
	NEXT i                        '16384 * 2 <= 32768.
