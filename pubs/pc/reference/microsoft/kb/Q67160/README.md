---
layout: page
title: "Q67160: CV1017: Syntax Error Can Be Caused by a Leading Zero"
permalink: /pubs/pc/reference/microsoft/kb/Q67160/
---

## Q67160: CV1017: Syntax Error Can Be Caused by a Leading Zero

	Article: Q67160
	Version(s): 3.00 3.10 3.11 | 3.00 3.10 3.11
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 4-JAN-1991
	
	Since CodeView treats all values with a leading zero as octal numbers,
	the following error is reported when the value is not a valid octal
	number:
	
	   CV1017: syntax error
	
	To enter a number in hexadecimal form, the value must be preceded with
	"0x" (without the quotation marks). If the value is a number in
	decimal form, any leading zeros should be dropped.
	
	You can also use the "0n" prefix to specify decimal numbers,
	independent of the current radix.
