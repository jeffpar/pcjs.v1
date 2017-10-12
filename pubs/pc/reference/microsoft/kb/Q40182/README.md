---
layout: page
title: "Q40182: Use of Wrong Library Causes Unresolved External on __aDBused"
permalink: /pubs/pc/reference/microsoft/kb/Q40182/
---

	Article: Q40182
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JUN-1989
	
	Question:
	
	I just ported my code over from QuickC Version 1.01 to QuickC Version
	2.00. When I try to build my program, I get an unresolved external on
	__aDBused at link time. What's wrong?
	
	Response:
	
	You are using the wrong libraries. QuickC 2.00 libraries are
	incompatible with Version 1.01 libraries. Make sure your lib path is
	pointing to your QuickC Version 2.00 libraries, and not to any older
	libraries, such as those with C Version 5.10. To do this, follow these
	steps:
	
	1. Press (inside the QuickC environment) ALT+O to pull down the
	   Options Menu.
	
	2. Press "E" for Environment.
	
	3. Press TAB once to go to the libraries setting.
	
	4. Type in the path for the proper libraries, and press ENTER.
	
	You now can recompile.
	
	The exact error message will be as follows:
	
	   filename.obj(filename.c) : error L2029 : '__aDBused' : unresolved external
	
	With linker versions later than 3.65, this message will occur for each
	module in the program list.
