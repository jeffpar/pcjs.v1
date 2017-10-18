---
layout: page
title: "Q30502: .RADIX 16 Directive and Real Number Initialization Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q30502/
---

## Q30502: .RADIX 16 Directive and Real Number Initialization Statement

	Article: Q30502
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	When .RADIX 16 directive is used, a real number initialization
	statement will generate the error "non-digit in number." The following
	is an example:
	
	.MODEL small
	.RADIX 16
	.data
	sym dd 1.0
	end
	
	   The problem does not occur under MASM Version 4.00 or 5.00, but
	does occur under MASM Versions 5.00a and MASM 5.10.
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
