---
layout: page
title: "Q41024: FATAL: Internal Stack Failure, System Halted"
permalink: /pubs/pc/reference/microsoft/kb/Q41024/
---

	Article: Q41024
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC S_PASCAL H_FORTRAN H_MASM
	Last Modified: 16-MAY-1989
	
	For DOS Version 3.20 or later, the following message is issued by DOS
	when too many interrupts occur too quickly and the pool of internal
	stack frames is exhausted:
	
	   FATAL: Internal Stack Failure, System Halted
	
	Increasing the number of stacks allocated for use by interrupt
	handlers in the STACKS command in CONFIG.SYS usually corrects the
	problem.
	
	The syntax is as follows:
	
	STACKS=n,s
	
	n = number of stacks, ranging from 8 to 64, with 9 as the as the default
	s = size of each stack, ranging from 32 to 512 bytes, default of 128
	
	For more information about the STACKS command, see Page 805 of the
	"MS-DOS Encyclopedia."
	
	This error can occur if network cards, laboratory measurement
	instruments, and other devices are in use. They may generate many
	hardware interrupts thus exhausting the DOS stack resources.
	
	Note: For MS-DOS Version 3.30 on an IBM-PC, IBM-XT, or
	IBM-PC-Portable, the default for n is 0 and s is 0 .
