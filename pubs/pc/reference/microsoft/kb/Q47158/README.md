---
layout: page
title: "Q47158: Warning C4051: Data Conversion from Constant to float"
permalink: /pubs/pc/reference/microsoft/kb/Q47158/
---

## Q47158: Warning C4051: Data Conversion from Constant to float

	Article: Q47158
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1989
	
	Question:
	
	Why does the following program cause the C compiler to issue warning
	C4051 data conversion at warning level 2 or 3?
	
	   void main(void)
	    {
	      float  num1 = 3.4;
	    }
	
	Response:
	
	The data conversion results from a type conversion between a float and
	a double. Num is declared as a float while 3.4 is a constant. Floating
	point constants have a default type of double. You may eliminate this
	warning error in one of two ways:
	
	1. Declare the constant as a float as follows:
	
	      float num1 = 3.4f;
	
	   where the "f", or an "F", following "3.4" indicates that the constant
	   is a 4-byte float instead of an 8-byte double.
	
	2. Type cast the constant to a float as follows:
	
	      float num = (float) 3.4;
