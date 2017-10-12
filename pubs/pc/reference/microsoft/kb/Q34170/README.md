---
layout: page
title: "Q34170: C4040 Occurs on Declaration of Huge Array"
permalink: /pubs/pc/reference/microsoft/kb/Q34170/
---

	Article: Q34170
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | 5.10
	Flags: ENDUSER |
	Last Modified: 17-AUG-1988
	
	The compiler warning "C4040 near/far/huge on identifier ignored"
	occurs on the declaration of a huge array if the array is not
	declared globally or statically. A huge or far array only can be
	declared at the global (or static) level because local (auto)
	variables are allocated on the stack and cannot be far or huge.
	   To ensure that your arrays are allocated as huge or far arrays,
	declare them at the global level or declare them with the static
	storage class.
