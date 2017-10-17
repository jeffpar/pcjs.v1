---
layout: page
title: "Q58436: Setting Size and Number of Internal Stacks"
permalink: /pubs/pc/reference/microsoft/kb/Q58436/
---

## Q58436: Setting Size and Number of Internal Stacks

	Article: Q58436
	Version(s): 3.x 4.x 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm s_quickpas s_pascal
	Last Modified: 9-FEB-1990
	
	If an INTERNAL STACK OVERFLOW system error occurs, the number and/or
	size of internal stacks in DOS should be increased in the CONFIG.SYS
	file. The syntax for this is as follows
	
	   STACKS=number,size
	
	where number = number of stacks (8-64, default 9) and size = size of
	the stacks (32-512,default 128).
	
	The following information was taken from the MS-DOS Encyclopedia, Page
	805:
	
	   Each time certain hardware interrupts occur, ... , MS-DOS Version
	   3.2 switches to an internal stack before transferring control to
	   the handler that will service the interrupt. In the case of
	   nested interrupts, MS-DOS checks to ensure that both interrupts
	   do not get the same stack. After the interrupt has been processed,
	   the stack is released. This protects the stacks owned by
	   application programs or system device drivers from overflowing when
	   several interrupts occur in rapid succession.
	   .
	   .
	   .
	   If too many interrupts occur too quickly and the pool of internal
	   stack frames is exhausted, the system halts with the message
	   INTERNAL STACK OVERFLOW. Increasing the number parameter in the
	   stacks command usually corrects the problem.
