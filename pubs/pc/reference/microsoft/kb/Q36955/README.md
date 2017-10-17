---
layout: page
title: "Q36955: C2086, C2061 on CFLOW.C when Language Extentions Not Enabled"
permalink: /pubs/pc/reference/microsoft/kb/Q36955/
---

## Q36955: C2086, C2061 on CFLOW.C when Language Extentions Not Enabled

	Article: Q36955
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 12-DEC-1988
	
	Compiling the sample program CFLOW.C with language extensions disables
	results in the following errors:
	
	cflow.c(4) : error C2086: 'size_t' : redefinition
	cflow.c(934) : error C2061: syntax error : identifier 'c'
	
	The Microsoft extensions to C can be disabled by compiling with
	the option /Za (enforce ANSI compatibility) or, when in QuickC,
	clearing the X from the Language Extensions check box in the Compile
	dialog box.
	
	The C2086 error occurs because both CFLOW.C and STDIO.H have the following:
	
	typedef unsigned int size_t;
	
	Redefinition of a typedef is a language extension. This information is
	stated in the "Microsoft C Optimizing Compiler User's Guide" on Page
	100.
	
	The C2061 error occurs on the line
	
	static int near c;
	
	because the keyword "near" is an extension to C, and so is understood
	by the compiler to be the simple identifier being defined, leaving the
	now-surplus "c" to be flagged as syntactically incorrect. This
	information is documented in the user's guide on Page 99.
