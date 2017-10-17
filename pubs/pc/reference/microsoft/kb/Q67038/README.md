---
layout: page
title: "Q67038: Inline Assembly Won't Allow Expressions for the TYPE Operator"
permalink: /pubs/pc/reference/microsoft/kb/Q67038/
---

## Q67038: Inline Assembly Won't Allow Expressions for the TYPE Operator

	Article: Q67038
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 18-NOV-1990
	
	The TYPE Operator in MASM returns a number that represents the type of
	an identifier or expression. With the inline assembly capability in C
	and QuickC, the TYPE operator does not have the full functionality
	that it does in MASM. In an _asm block, the TYPE operator will only
	accept an identifier -- expressions are not allowed.
