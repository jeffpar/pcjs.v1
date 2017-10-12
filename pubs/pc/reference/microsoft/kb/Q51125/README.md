---
layout: page
title: "Q51125: "C For Yourself" Documentation Error -- Long Double"
permalink: /pubs/pc/reference/microsoft/kb/Q51125/
---

	Article: Q51125
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | docerr s_quickasm
	Last Modified: 17-JAN-1990
	
	On Page 48 (fourth paragraph from the bottom) of the "C for Yourself"
	manual, it states that a long double has 19 digits of precision. This
	statement is incorrect.
	
	A long double has 15 digits of precision and is the same as a double
	in the current implementation. The same error occurs on the following
	page (Page 49) under Table 4.1.
