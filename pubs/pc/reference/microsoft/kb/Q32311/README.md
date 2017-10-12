---
layout: page
title: "Q32311: L1063 Error Not Documented in C Versions 5.00 or 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q32311/
---

	Article: Q32311
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 18-AUG-1988
	
	The link error message, "L1063 out of memory for CodeView
	information," is not documented in the manuals or in the README.DOCs
	for C Versions 5.00 and 5.10. However, it is documented in the FORTRAN
	Version 4.10 package in the CVREADME.DOC on the disk labeled
	"Microsoft CodeView for MS-DOS".
	   The following information was taken from the FORTRAN Version 4.10
	CVREADME.DOC, "NOTES ON CODEVIEW AND UTILITIES," the section titled
	"Microsoft Segmented-Executable Linker (LINK)," the subsection "New
	LINK Error Messages":
	
	   L1063 out of memory for CodeView information
	
	   The linker was given too many object files with debug information,
	and the linker ran out of space to store it. Reduce the number of
	object files that have debug information.
