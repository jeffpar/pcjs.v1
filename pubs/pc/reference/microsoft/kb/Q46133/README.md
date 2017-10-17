---
layout: page
title: "Q46133: Tecmar VGA Does Not Work in 43-Line Mode with QC2.00/QB4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q46133/
---

## Q46133: Tecmar VGA Does Not Work in 43-Line Mode with QC2.00/QB4.50

	Article: Q46133
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | B_QuickBas
	Last Modified: 27-JUN-1989
	
	The Tecmar VGA graphics card interacts incorrectly with both the
	QuickC Version 2.00 and QuickBasic Version 4.50 integrated
	environments. The screen comes up in 43-line mode, but it truncates
	the last seven lines of the screen.
	
	This has been duplicated at Microsoft and verified as a problem with
	both the Version 1.08 and Version 1.09 Tecmar ROMs. The only
	workaround is to use 25-line mode, which works correctly.
