---
layout: page
title: "Q33104: SH_COMPAT Share Flag for SOPEN()"
permalink: /pubs/pc/reference/microsoft/kb/Q33104/
---

	Article: Q33104
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 2-AUG-1988
	
	SH_COMPAT is not a valid share flag for SOPEN() under OS/2.
	SH_COMPAT is only valid in the DOS environment. The documentation in
	the "Microsoft C 5.1 Opitimizing Compiler Run-time Library Reference,"
	Page 548, does not document this restriction on the use of SH_COMPAT.
