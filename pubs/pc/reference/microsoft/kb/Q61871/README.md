---
layout: page
title: "Q61871: PWB 1.00 Requires Decimal Value for Stack Size in LINK Options"
permalink: /pubs/pc/reference/microsoft/kb/Q61871/
---

## Q61871: PWB 1.00 Requires Decimal Value for Stack Size in LINK Options

	Article: Q61871
	Version(s): 1.00    | 1.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | buglist1.00 fixlist1.10
	Last Modified: 5-FEB-1991
	
	In the Programmer's WorkBench (PWB) version 1.00, there is a problem
	with changing a program's stack size in some situations. When
	specifying the stack size in the Link Options dialog box (from the
	Options menu), you must enter the value in the form of a decimal
	integer. Although the Help menu tells you this field accepts positive
	integers in octal and hexadecimal form, PWB 1.00 will not accept them.
	
	When an octal or hexadecimal value is entered in the stack-size field,
	any digits specified as A-F are discarded and replaced by 0 (zero). If
	digits precede a letter, the digits are retained and the letters are
	discarded.
	
	Microsoft has confirmed this to be a problem in PWB version 1.00. This
	problem was corrected in PWB version 1.10.
