---
layout: page
title: "Q45349: A Problem with Division Always Returning 1"
permalink: /pubs/pc/reference/microsoft/kb/Q45349/
---

## Q45349: A Problem with Division Always Returning 1

	Article: Q45349
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 8-JUN-1989
	
	QuickC has demonstrated difficulty performing division under certain
	circumstances. When time optimization (/Ot or /Ox) is enabled,
	the program below outputs the following:
	
	   quotient = 1
	
	The correct value is 5. No matter what the division operands are, the
	result is always 1 in this program. This behavior does not occur with
	longs or floats -- only with ints. The program that demonstrates this
	behavior is the following:
	
	   #include <stdio.h>
	
	   struct X
	   { int i; } x = { 3 };
	
	   void foo (struct X *);
	
	   void main (void)
	   {
	     int denom, quotient;
	
	     foo (&x);
	     denom    = x.i;
	     quotient = 15/denom;
	
	     printf ("quotient = %d", quotient);
	   }
	
	   void foo (struct X *adr)
	   {}
	
	To work around this problem with the program listed, disable time
	optimization. In the integrated environment, select
	Options.Make.Compiler Flags.Off. From the QCL command line, do not
	specify /Ot (or /Ox which implies /Ot).
	
	This problem can also be observed with the "C For Yourself" program
	GRAPHIC.C. The output of this program compresses when it is compiled
	with time optimization enabled.
	
	Microsoft has confirmed this to be a problem with QuickC Version 2.00.
	We are researching this problem and will post new information as it
	becomes available.
