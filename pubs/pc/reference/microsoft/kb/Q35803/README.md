---
layout: page
title: "Q35803: External Addresses in &quot;=&quot; Directive Documentation Error"
permalink: /pubs/pc/reference/microsoft/kb/Q35803/
---

## Q35803: External Addresses in &quot;=&quot; Directive Documentation Error

	Article: Q35803
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-JAN-1989
	
	On Page 214, section 11.1.1, of the "Microsoft Macro Assembler
	Programmer's Guide," the documentation indicates the equal-sign (=)
	directive may be used with expressions that evaluate to an address. If
	the address refers to an external label, the error A2052 will be
	issued from the assembler.
	
	MASM has a restriction with the "=" directive that should be
	documented. The use of "=" directive with expressions that evaluate to
	an address is not allowed. The EQU directive should be used instead.
