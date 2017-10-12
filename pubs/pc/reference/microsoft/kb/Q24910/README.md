---
layout: page
title: "Q24910: Memory Not Freed by DOS 2.x for exec or spawn with P_OVERLAY"
permalink: /pubs/pc/reference/microsoft/kb/Q24910/
---

	Article: Q24910
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | tar57672
	Last Modified: 21-SEP-1988
	
	Within DOS Versions 2.x only, recurrent use of an exec function or a
	spawn function with P_OVERLAY eventually causes a return indicating
	that there is no more available RAM memory.
	
	This is a DOS Versions 2.x problem, whose exact nature is unknown.
	Microsoft has traced the problem to the point where DOS corrupted
	memory, and memory is not being freed back to DOS Versions 2.x.
	
	If you encounter this problem, upgrade to DOS Versions 3.x, which
	do not have this problem.
	
	It appears that only the exec() family (or spawn() with P_OVERLAY
	specified) is affected by this DOS problem. The spawn() family (except
	when P_OVERLAY is specified) seems to work correctly.
