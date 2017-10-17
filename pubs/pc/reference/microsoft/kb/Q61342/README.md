---
layout: page
title: "Q61342: Description for L2043 in BASIC PDS 7.00 Manual Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q61342/
---

## Q61342: Description for L2043 in BASIC PDS 7.00 Manual Incorrect

	Article: Q61342
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr SR# S900415-3
	Last Modified: 8-JAN-1991
	
	Page 689 of the "Microsoft BASIC 7.0: Language Reference" for
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 incorrectly states for LINKer error message L2043 that the
	module QUICKLIB.OBJ was missing. This should be changed to say that
	the module QBXQLB.LIB was missing.
	
	This information applies to Microsoft BASIC PDS versions 7.00 and 7.10
	for MS-DOS.
	
	The description on Page 689 for the LINKer error message L2043 is
	incorrectly given as follows:
	
	   L2043    Quick Library support module missing
	
	            The required module QUICKLIB.OBJ was missing.
	
	            The module QUICKLIB.OBJ must be linked when creating a
	            Quick library.
	
	The correct explanation is as follows:
	
	   L2043    Quick Library support module missing
	
	            The required module QBXQLB.OBJ was missing.
	
	            The module QBXQLB.OBJ must be linked when creating a
	            Quick library.
