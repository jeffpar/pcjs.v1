---
layout: page
title: "Q45093: QC Advisor Says That fabs() Prototyped in STDLIB.H"
permalink: /pubs/pc/reference/microsoft/kb/Q45093/
---

## Q45093: QC Advisor Says That fabs() Prototyped in STDLIB.H

	Article: Q45093
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 19-SEP-1989
	
	The QuickC Version 2.00 on-line help screen for the fabs() function
	incorrectly states that this function is prototyped in STDLIB.H. This
	is a documentation error. The fabs() function is actually prototyped
	in MATH.H. The abs() and labs() functions are prototyped in STDLIB.H.
	
	Attempts to use the fabs() function when MATH.H has not been included
	will produce inaccurate results at run time. At warning levels 2 and
	3, the compiler produces messages indicating that fabs() has not been
	prototyped and returns an integer by default; however, at warning
	levels 0 and 1 there is no indication that this problem exists.
