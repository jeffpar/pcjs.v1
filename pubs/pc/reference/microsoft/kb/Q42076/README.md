---
layout: page
title: "Q42076: Errors C1059, C1060, D2027 Can Be Caused by Not Enough Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q42076/
---

## Q42076: Errors C1059, C1060, D2027 Can Be Caused by Not Enough Memory

	Article: Q42076
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 31-OCT-1989
	
	The Microsoft QuickC Version 2.00 command-line compiler QCL may
	generate the following fatal-errors when there is not enough memory:
	
	   C1059  out of near heap space
	
	   C1060  out of far heap space
	
	   D2027  could not execute 'qccom.exe'
	
	QuickC requires a minimum of 448K of available conventional DOS memory
	(512K recommended for larger applications) for proper operation.
	
	To check your available memory, use the DOS "chkdsk" program. The last
	number on the screen is your available memory.
	
	Note: If there is only a small amount of RAM available (less than 40K)
	QCL may hang.
