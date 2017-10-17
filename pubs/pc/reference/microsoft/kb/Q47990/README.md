---
layout: page
title: "Q47990: Possible Causes of &quot;'&#95;&#95;iob' : Unresolved External&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q47990/
---

## Q47990: Possible Causes of &quot;'&#95;&#95;iob' : Unresolved External&quot;

	Article: Q47990
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | SR# G890807-24188 _iob iob
	Last Modified: 16-JAN-1990
	
	When linking with CRTLIB.LIB, the problems listed below can cause the
	following message when linking a main program to the C run-time DLL
	created as described in the MTDYNA.DOC file supplied with the C
	Compiler Version 5.10:
	
	   ....  error : L2029 : '__iob' : unresolved external
	
	The problems that can cause this message include the following:
	
	1. Compiling with the wrong include files. Typically, this involves
	   compiling without the /I option, as described in MTDYNA.DOC.
	
	2. Compiling without defining the symbol DLL. DLL must be defined in
	   any program that calls the C run-time library DLL.
	
	These options, as well as other important information, are covered in
	Section 5.2 of MTDYNA.DOC.
