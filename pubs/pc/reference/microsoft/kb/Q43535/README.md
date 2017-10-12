---
layout: page
title: "Q43535: 'strerror' Example in QuickC Manual May Yield Error"
permalink: /pubs/pc/reference/microsoft/kb/Q43535/
---

	Article: Q43535
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 2-MAY-1989
	
	The 'strerror' example given at the top of Page 582 of the "Microsoft
	QuickC Run-Time Library Reference" may yield the following error:
	
	   error C2086: 'errno' : redefinition
	
	Two conditions are required to produce this error:
	
	1. Compile for the compact- or large-memory model (/AC or /AL).
	
	2. Compile without ANSI compatibility enforced (no /Za).
	
	This error occurs because, under the above conditions, the external
	reference has an implied 'far cdecl' and contradicts the external
	reference in the include file ERRNO.H, as follows:
	
	   extern int errno;
	
	The external reference in the include file ERRNO.H is as follows:
	
	   extern int near cdecl errno;
	
	To correct this example, remove the following line:
	
	   extern int errno;
	
	This line is not necessary in any case because the external reference
	to errno has already been made in ERRNO.H.
	
	Only QuickC Version 2.00 will produce the above error as it is the
	first Microsoft compiler to declare errno to be external in the
	include file ERRNO.H.
