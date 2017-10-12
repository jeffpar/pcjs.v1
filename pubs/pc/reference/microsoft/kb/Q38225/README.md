---
layout: page
title: "Q38225: Error C1053 Compiler Limit : Struct/union Nesting"
permalink: /pubs/pc/reference/microsoft/kb/Q38225/
---

	Article: Q38225
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error docerr
	Last Modified: 19-DEC-1988
	
	The following error is from "Fatal-Error Messages" in the "Microsoft C
	Optimizing Compiler User's Guide," Section E.3.1, Page 250, and in the
	"Microsoft QuickC Compiler Programmer's Guide," Section D.1.1, Page
	319:
	
	C1053       compiler limit : struct/union nesting
	
	            Structure and union definitions were nested to more than
	            10 levels.
	
	The error message and explanation given for C1053 in the "Microsoft
	QuickC Compiler Programmer's Guide" is incorrect. It has been switched
	with the message and description for C1027.
	
	The compiler cannot recover from a fatal error; it terminates after
	printing the error message.
