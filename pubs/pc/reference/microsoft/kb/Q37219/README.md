---
layout: page
title: "Q37219: No Such Thing as a static auto Variable."
permalink: /pubs/pc/reference/microsoft/kb/Q37219/
---

	Article: Q37219
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER   | S_QUICKC docerr
	Last Modified: 21-NOV-1988
	
	Page 86 (section 4.6.2, third paragraph) of the "Microsoft QuickC and
	Optimizing C Language Reference" states "A static auto variable can
	be initialized..."
	
	However, the storage classes static and auto are mutually exclusive --
	there is no "static auto" class. The text should read, "A static OR
	auto variable can be initialized..."
