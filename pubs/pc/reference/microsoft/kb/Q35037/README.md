---
layout: page
title: "Q35037: How C Interprets Integer Constants with Leading Zeroes"
permalink: /pubs/pc/reference/microsoft/kb/Q35037/
---

## Q35037: How C Interprets Integer Constants with Leading Zeroes

	Article: Q35037
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER |
	Last Modified: 18-OCT-1988
	
	Question:
	
	Why do the assignments "a = 20" and "a = 020" return different results
	when the values are printed? Why aren't 020 and 20 the same?
	
	The following is an example:
	
	a = 20;
	printf("%d", a);   /* this prints "20" */
	a = 020;
	printf("%d", a);   /* but this prints "16" */
	
	Response:
	
	In C, any number preceded by a 0 is handled as an octal number (base
	8). Therefore, "a = 20" is handled as you would expect; however, "a =
	020" is handled as an octal number and therefore represents the
	decimal value 16.
	
	Note also that ALL character constants of the form '\o', '\oo',
	'\ooo', and the string equivalents are always octal as well.  (Hex
	character constants start with "\x".)  For instance, '\33' or '\033'
	are both the ESCape character (decimal 27, hex 1B).  There is no way
	to use decimal numbers to specify a character constant; however, you
	may use decimal integer constants instead (example: ch = 27;  ).
