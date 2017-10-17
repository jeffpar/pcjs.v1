---
layout: page
title: "Q48967: Confusion Regarding the /Zs Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q48967/
---

## Q48967: Confusion Regarding the /Zs Switch

	Article: Q48967
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC S_QuickAsm
	Last Modified: 16-JAN-1990
	
	The /Zs switch instructs the compiler to scan your code and check for
	syntax errors. This switch does not generate any code. Switches that
	assume code will be generated do not have any effect when used in
	conjunction with /Zs.
	
	Therefore, if you are using the /Zs switch and are unaware of the fact
	that it does not generate any code, it may appear that other switches,
	such as the /Fa switch, which generates an assembly listing, do not
	function.
