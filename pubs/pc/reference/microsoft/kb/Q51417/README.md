---
layout: page
title: "Q51417: CURRENCY Data Type Not Available in Alternate Math (BC /FPa)"
permalink: /pubs/pc/reference/microsoft/kb/Q51417/
---

## Q51417: CURRENCY Data Type Not Available in Alternate Math (BC /FPa)

	Article: Q51417
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 6-AUG-1990
	
	The CURRENCY data type available in Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 can be used only with
	the coprocessor/emulation math package (BC /FPi, the default). The
	CURRENCY type is not supported in the alternate math package (BC /FPa
	option). Trying to compile a program that uses CURRENCY variables with
	the alternate math package results in "Currency type illegal in
	alternate math pack" errors.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	The implementation of a CURRENCY data type for alternate math would
	have delayed the release of BASIC PDS 7.00 and 7.10, keeping the
	product from developers who need the other new features. This feature
	is under review and will be considered for inclusion in a future
	release.
	
	The CURRENCY data type is not found in Microsoft BASIC Compiler
	versions earlier than Microsoft BASIC PDS version 7.00.
	
	You can declare a variable with the CURRENCY data type by appending
	the variable name with the suffix @ (the "at" sign), or you can use
	the DIM statement with the AS CURRENCY clause (DIM x AS CURRENCY).
