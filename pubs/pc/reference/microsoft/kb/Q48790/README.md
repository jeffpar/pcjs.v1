---
layout: page
title: "Q48790: Potential Problems with Identifiers Over 31 Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q48790/
---

	Article: Q48790
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC S_QuicKASM
	Last Modified: 16-JAN-1990
	
	The #define statement in Microsoft C accepts identifiers up to 31
	characters. The compiler truncates identifiers over 31 characters, and
	on warning level 1 or greater, produces the following warning message:
	
	   warning C4011: identifier truncated to '<truncated identifier>'
	
	This can cause potential problems if two or more identifiers are
	identical up to the 31st character. If this is the case, the following
	warning message appears for each additional #define that is identical
	when truncated (on warning levels 1 or greater):
	
	   warning C4005: '<truncated identifier>' : redefinition
	
	All of these identifiers are assigned the value of the last identifier
	that was identical when truncated.
	
	This information also applies to QuickC Versions 1.01, 2.00, 2.01 and
	QuickAssembler Version 2.01.
