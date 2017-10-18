---
layout: page
title: "Q35114: Comparison of a Constant and a Relocatable Are Not Allowed"
permalink: /pubs/pc/reference/microsoft/kb/Q35114/
---

## Q35114: Comparison of a Constant and a Relocatable Are Not Allowed

	Article: Q35114
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The comparison of a constant (left-hand side) and a relocatable
	(right-hand side) are not allowed. The following is an example:
	
	.errnz 0FFFFh-(MAXSELS * size SELENTRY) GT seltable-1
	
	A workaround for this problem that will direct the assembler to
	generate the correct opcodes is to use the segment name that contains
	the structure seltable, as follows:
	
	.errnz data:0FFFFh-(MAXSELS * size SELENTRY) GT seltable -1
