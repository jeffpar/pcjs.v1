---
layout: page
title: "Q60252: Initializing Bitfields as Integers in C"
permalink: /pubs/pc/reference/microsoft/kb/Q60252/
---

## Q60252: Initializing Bitfields as Integers in C

	Article: Q60252
	Version(s): 4.x 5.00 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS             | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 17-JUL-1990
	
	Initializing the values of an entire bitfield structure as an integer
	can be done in several ways:
	
	1. Declare the bitfield structure as part of a union with an integer.
	   (This is the preferred method).
	
	2. Use an integer pointer by setting the pointer to the address of the
	   structure and then changing what the pointer points to.
	
	3. To get a copy of the bitfield into an integer variable, you must
	   enforce the bitfield type constraints.
	
	For examples of these three methods, see below.
	
	In Microsoft C, bitfields are stored in word-sized blocks with the
	least significant bit representing the first bit of the bitfield. For
	example, the bitfields in bitstruct, defined below in the example,
	are stored as follows:
	
	           <  p4   > <  p3   > < p2> <p1>
	        |?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|
	
	Assigning the integer 0x4c to this structure results in the following
	bit pattern:
	
	        |0|0|0|0|0|0|0|0|0|1|0|0|1|1|0|0|
	
	The bitfields are given the following respective values:
	
	   p1=0 p2=3 p3=2 p4=0
	
	If the number of bits needed for a bitfield structure exceeds 16,
	words will be added as needed to provide room for the structure with
	no single bitfield crossing a word boundary.
	
	Note: There is no "standard" for storing bitfields; therefore, any
	program that depends on them being stored in this manner, low to high,
	will not be portable.
	
	Sample Code
	-----------
	
	struct strtype
	   {
	   unsigned p1:2;
	   unsigned p2:3;
	   unsigned p3:5;
	   unsigned p4:5;
	   } bitstruct;
	
	union untype
	   {
	   struct strtype un_bitstruct;
	   unsigned bit_integer;
	   } bitunion;
	
	unsigned *intptr;
	unsigned intgr;
	
	void main(void)
	{
	   /*  Using the bitfield structure only */
	
	      /* Set the pointer to address of bitfield */
	   intptr=(unsigned *)&bitstruct;
	
	      /* Change the bitfield */
	   *intptr=0x4c;
	
	      /* Get the new value */
	   intgr=*(unsigned *)&bitstruct;
	
	   /* Using an union makes this much easier (syntactically) */
	
	      /* Set the pointer */
	   intptr=&bitunion.bit_integer;
	
	      /* Change the bitfield */
	   bitunion.bit_integer=0x4c;
	
	      /* Get the new value */
	   intgr=bitunion.bit_integer;
	}
	
	Note: If you are using C 6.00 or later or QC 2.50 or later, you could
	use the anonymous union construct that these compilers support. In
	that case, the code would change to:
	
	struct strtype
	   {
	   unsigned p1:2;
	   unsigned p2:3;
	   unsigned p3:5;
	   unsigned p4:5;
	   } bitstruct;
	
	union untype
	   {
	   struct strtype un_bitstruct;
	   unsigned bit_integer;
	   };                      // Look ma!  No name..
	
	unsigned *intptr;
	unsigned intgr;
	
	void main(void)
	{
	   /*  Using the bitfield structure only */
	
	      /* Set the pointer to address of bitfield */
	   intptr=(unsigned *)&bitstruct;
	
	      /* Change the bitfield */
	   *intptr=0x4c;
	
	      /* Get the new value */
	   intgr=*(unsigned *)&bitstruct;
	
	   /* Using an union makes this much easier (syntactically) */
	
	      /* Set the pointer */
	   intptr=&bit_integer;    // See here...
	
	      /* Change the bitfield */
	   bit_integer=0x4c;       // And here...
	
	      /* Get the new value */
	   intgr=bit_integer;      // And here...  (Much easier, huh?)
	}
