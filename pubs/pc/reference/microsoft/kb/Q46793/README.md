---
layout: page
title: "Q46793: Bus Mouse and Cipher Tape Drive Card"
permalink: /pubs/pc/reference/microsoft/kb/Q46793/
---

	Article: Q46793
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 31-AUG-1989
	
	Problem:
	
	When using the Microsoft Bus Mouse in an AST Premium 386/25, I got the
	following error message after I installed a Cipher Tape drive card:
	
	   Bad or missing interrupt jumper
	
	Response:
	
	This problem occurred because the interrupt and primary/secondary
	jumper settings were wrong. To correct this problem, change J4 to
	interrupt 2, and J3 to secondary inport.
