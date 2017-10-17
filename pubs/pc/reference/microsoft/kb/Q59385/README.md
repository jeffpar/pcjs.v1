---
layout: page
title: "Q59385: Incomplete EXPORTS List May Cause L2022 and L2029"
permalink: /pubs/pc/reference/microsoft/kb/Q59385/
---

## Q59385: Incomplete EXPORTS List May Cause L2022 and L2029

	Article: Q59385
	Version(s): 3.65
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-MAR-1990
	
	Compiling and linking a Windows program and receiving the following
	two link errors can be caused by an incomplete EXPORTS list:
	
	   LINK : error L2022: ProcedureName : export undefined
	   LINK : error L2029: 'ProcedureName' : unresolved external
	
	Windows programming involves the creation of a .DEF (definitions)
	file. All Windows procedures to be exported must be listed in this
	file. The following is an example:
	
	   EXPORTS     ProcedureName
	
	When this list is incomplete, the L2022 error is generated. The L2029
	error can be generated if the case of the EXPORT line doesn't match
	the case of the actual function.
	
	Listing all procedures to be exported in the .DEF file prevents both
	of these errors.
	
	Note: These errors can also occur with Presentation Manager programs
	or programs that use DLLs under OS/2.
