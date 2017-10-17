---
layout: page
title: "Q39256: QuickBASIC May Not Function with 25-MHz 80387 Coprocessor"
permalink: /pubs/pc/reference/microsoft/kb/Q39256/
---

## Q39256: QuickBASIC May Not Function with 25-MHz 80387 Coprocessor

	Article: Q39256
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881212-11
	Last Modified: 4-SEP-1990
	
	Customers have reported that QuickBASIC version 4.50 does not function
	correctly with a 25-MHz 80387 math-coprocessor chip. The reported
	problems include the following:
	
	1. Incorrect floating-point numeric results
	
	2. Coprocessor not detected
	
	The problem does not occur on 80387 chips slower than 25 MHz.
	
	Microsoft has not tested QuickBASIC version 4.50 with 25-MHz 80387
	chips.
	
	To test potential problems, you can compare numeric results with and
	without the coprocessor by turning the coprocessor on or off. The
	following command in MS-DOS turns off access to the coprocessor in the
	current boot session (where any message with one or more characters
	must follow the "="):
	
	   SET NO87=Coprocessor is currently disabled.
	
	The following command makes the coprocessor accessible again (where no
	characters follow the "="):
	
	   SET NO87=
