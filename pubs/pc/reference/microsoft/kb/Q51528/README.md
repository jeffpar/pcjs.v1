---
layout: page
title: "Q51528: Run-Time Function fabs() Is Prototyped in MATH.H"
permalink: /pubs/pc/reference/microsoft/kb/Q51528/
---

## Q51528: Run-Time Function fabs() Is Prototyped in MATH.H

	Article: Q51528
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | docerr S_QUICKASM
	Last Modified: 14-MAR-1990
	
	The on-line help in QuickC 2.00 and QuickAssembler 2.01 incorrectly
	states that the run-time function fabs() is prototyped in the STDLIB.H
	header file. The function is actually prototyped in the MATH.H header
	file.
	
	The other two run-time functions abs() and labs() are prototyped in
	STDLIB.H header file.
