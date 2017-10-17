---
layout: page
title: "Q34142: Link Error L1073"
permalink: /pubs/pc/reference/microsoft/kb/Q34142/
---

## Q34142: Link Error L1073

	Article: Q34142
	Version(s): 5.01.21 5.01.20
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 11-AUG-1988
	
	The linker error L1073 is documented in the CodeView and Utilities
	update section of the manuals for MASM Version 5.10, C Version 5.10,
	FORTRAN Version 4.10, and Pascal Version 4.00. The error message is as
	follows:
	
	   L1073 file-segment limit exceeded.
	
	   The number of physical file segments exceeds the limit of 254
	imposed by OS/2 protected mode and by Windows for each application or
	dynamic-link library. (A file segment is created for each group
	definition, nonpacked logical segment, and set of packed segments.)
	   Reduce the number of segments or group more of them, making sure
	/PACKCODE is enabled.
