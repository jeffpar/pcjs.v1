---
layout: page
title: "Q39145: QuickC Incorrectly Issues a C4051 Data Conversion Warning"
permalink: /pubs/pc/reference/microsoft/kb/Q39145/
---

	Article: Q39145
	Product: Microsoft C
	Version(s): 1.00 1.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 20-JAN-1989
	
	The Microsoft Quick C Compiler generates a "C4051: data conversion"
	warning message for the following code when compiled with warning
	level 3. This occurs in the integrated environment QC as well as
	the command line compiler, QCL.
	
	The following is a code example:
	
	void main()
	{
	  char temp ;
	  temp = 0xff ;
	}
	
	The warning is noting that the variable "temp", which is a signed
	char, is being initialized with a value that is larger than a signed
	char can represent. The bit pattern is not affected in this example
	since 0xff can be represented by an unsigned char.
	
	This warning does not affect how the bits are stored in the byte
	of storage.  The message is informing you that this bit pattern
	will not be interpreted as expected in a signed character
	translation.
	
	This is expected behavior for the QuickC compiler Versions 1.00 and
	1.01.
	
	This warning is not produced in QuickC Version 2.00.
