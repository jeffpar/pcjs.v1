---
layout: page
title: "Q44389: Only Certain C Library Functions Have an Intrinsic Form"
permalink: /pubs/pc/reference/microsoft/kb/Q44389/
---

## Q44389: Only Certain C Library Functions Have an Intrinsic Form

	Article: Q44389
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-MAY-1989
	
	The /Oi compiler option generates intrinsic functions instead of
	function calls only for specified run-time library functions. It does
	not generate intrinsic functions for all run-time library functions or
	for application program functions.
	
	To approximate intrinsic functions with application code, use the
	#define directive or the /D compiler option to define a macro.
	
	For more information on the /Oi option and the list of functions
	having intrinsic forms, refer to the "Microsoft C 5.1 Optimizing
	Compiler User's Guide," Pages 93-94, and the C 5.10 README.DOC, "Part
	2: Notes for the 'Microsoft C Optimizing Compiler User's Guide.'"
