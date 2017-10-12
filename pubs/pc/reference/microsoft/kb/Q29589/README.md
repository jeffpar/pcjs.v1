---
layout: page
title: "Q29589: Incorrect Interface Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q29589/
---

	Article: Q29589
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-OCT-1988
	
	The last example on Page 48 of the "Microsoft C 5.1 Optimizing
	Compiler Mixed-Language Programming Guide" reads as follows:
	
	INTERFACE TO FUNCTION REAL*8 CFUN [C] (I,J)
	
	This is incorrect. It should read as follows:
	
	INTERFACE TO REAL*8 FUNCTION CFUN [C] (I,J)
