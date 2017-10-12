---
layout: page
title: "Q38299: How CodeView Interprets Values (octal, decimal, hexadecimal)"
permalink: /pubs/pc/reference/microsoft/kb/Q38299/
---

	Article: Q38299
	Product: Microsoft C
	Version(s): 1.x 2.00 2.10 2.20 | 2.20
	Operating System: MS-DOS             | OS/2
	Flags: ENDUSER |
	Last Modified: 23-NOV-1988
	
	Problem:
	
	When trying to watch a portion of memory, I have a problem with
	the following command at the dialog prompt:
	
	   WW DS:0050 L 4.
	
	I thought this should have created a watch on the four words starting
	at offset 0x50. It actually set the watch starting at 0x28, CodeView
	interpreted the number as if it had been in base 8. Using the N
	command to change the radix doesn't make any difference.
	
	Response:
	
	In this case, the 0's before the offset cause CodeView to evaluate the
	expression in octal. CodeView provides three different prefixes for
	numbers to use an explicit base: 0 signifies octal, 0n signifies
	decimal, and 0x signifies hexadecimal. The current radix setting will
	have no bearing on numbers entered with these prefixes; however, it
	will affect those without prefixes.
	
	The lines below have different meanings when setting watches.
	The left column is the command, while the right column is an example
	of the display produced in the watch window. Radix is assumed to be 10.
	
	The following is an example:
	
	1. ww 50               50    :  0067:0032  6942
	
	2. ww 050              050   :  0067:0028  6328
	
	3. ww 0n50             0n50  :  0067:0032  6942
	
	4. ww 0x50             0x50  :  0067:0050  6163
	
	The first command sets the watch at the address specified using the
	current radix. This address will change when you use the N command to
	change the radix; the 50 on the left of the watch remains the same;
	however, the offset in the address will change to watch 50 in the new
	base. This address will always be displayed in hexadecimal, but 50
	will be evaluated differently.
	
	Examples 2 through 4 show watches being set in octal, decimal, and
	hexadecimal modes, respectively. These addresses will never change
	with a change of radix.
	
	Notice that watches 1 and 3 match. This is because by default CodeView
	is in base 10, so 50 and 0n50 evaluate to the same thing. Using N 8 will
	cause watches 1 and 2 to match, and N 16 will match 1 and 4.
