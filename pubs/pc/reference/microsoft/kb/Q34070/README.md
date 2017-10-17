---
layout: page
title: "Q34070: Converting from IEEE to MS binary format"
permalink: /pubs/pc/reference/microsoft/kb/Q34070/
---

## Q34070: Converting from IEEE to MS binary format

	Article: Q34070
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	Question:
	
	How can I convert an IEEE number into Microsoft binary format?
	
	Response:
	
	The "Microsoft Run-Time Library Reference" manual contains
	documentation of four functions that are used to convert IEEE format
	to MS binary format and MS binary format to IEEE format.
	
	The four functions are as follows:
	
	fieeetomsbin: Converts a single precision floating-point
	              number in IEEE format to MS binary format
	fmsbintoieee: Converts a single precision floating-point
	              number in MS binary format to IEEE format
	dieeetomsbin: Converts a double precision number in IEEE
	              format to MS binary format
	dmsbintoieee: Converts a double precision number in MS binary
	              format to IEEE format
