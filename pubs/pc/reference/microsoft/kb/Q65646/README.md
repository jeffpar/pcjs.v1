---
layout: page
title: "Q65646: /Zg Prototypes Unsigned Functions as Unsigned Short"
permalink: /pubs/pc/reference/microsoft/kb/Q65646/
---

## Q65646: /Zg Prototypes Unsigned Functions as Unsigned Short

	Article: Q65646
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS |
	Flags: ENDUSER |
	Last Modified: 24-OCT-1990
	
	Using the /Zg option on the following code, the compiler will
	generate a function prototype for func() that returns an unsigned
	short. This is by design and is not a problem if the code is to be
	compiled on a machine where ints and short ints are the same size.
	
	Sample Code
	-----------
	
	unsigned func(void)
	{
	   unsigned b = 1;
	   printf("Hello World\n);
	   return (b);
	}
	
	The code generates the following prototype:
	
	   unsigned short func (void);
	
	Both unsigned and unsigned int specify the same data type; unsigned is
	a shortened name for unsigned int. Likewise, unsigned short is another
	name for unsigned short int. In the Microsoft C 6.00 implementation,
	unsigned/unsigned int and unsigned short/unsigned short int specify
	compatible data types.
