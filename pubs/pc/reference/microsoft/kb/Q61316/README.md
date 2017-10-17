---
layout: page
title: "Q61316: C 6.00 Installation Defaults to x87 Libraries Under OS/2 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q61316/
---

## Q61316: C 6.00 Installation Defaults to x87 Libraries Under OS/2 2.00

	Article: Q61316
	Version(s): 6.00    | 6.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 25-MAY-1990
	
	Due to the built-in coprocessor emulation in OS/2 2.00, the Microsoft
	C version 6.00 Setup program behaves as if there is a coprocessor
	present, and defaults accordingly.
	
	Since C 6.00 Setup will determine that a coprocessor is installed, the
	coprocessor libraries will be installed by default. If these are not
	wanted or other libraries are to be installed, be sure to choose the
	Setup options appropriately.
