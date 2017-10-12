---
layout: page
title: "Q47105: Best to Avoid C Run-Time Library Routines in TSRs"
permalink: /pubs/pc/reference/microsoft/kb/Q47105/
---

	Article: Q47105
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G890601-19569
	Last Modified: 30-AUG-1989
	
	Question:
	
	I have two questions about using the C run-time library in a TSR
	(terminate-and-stay-resident program):
	
	1. Will I encounter any problems with calling the following routines
	   from a TSR? What about other library routines?
	
	      _strncmp    __aFFalshr   __chkstk   _sprintf  _free
	      __acrtused  _memcpy      _realloc   _strlen   _malloc
	      _strcmp     __aFFaulshr
	
	2. What DOS system calls (INT 21) do the C library references shown
	   above generate? I want to avoid calling DOS because it's not
	   re-entrant.
	
	Response:
	
	Microsoft does not recommend using standard library routines in TSRs
	at all, even though they may appear to be safe. The main problem is
	that although they may be safe in this version of the compiler, they
	may change in future versions. Microsoft does not support using the
	run-time code in a TSR.
	
	In particular, you can have severe problems with chkstk, sprintf,
	malloc, realloc, and free. It is likely that the other routines won't
	present too much of a problem, but without digging through the source
	and knowing EXACTLY what you're doing, there is no way to be sure.
	
	There is, however, an excellent alternative. Microsoft offers the
	run-time library source for sale. Call our sales number at (800)
	426-9400 for pricing and to order. With this source, you have almost
	total control over what your TSR looks like and how it acts. You can
	inspect each routine you use to ensure that it won't cause any
	interactions you don't want, and you can modify those routines that
	do. You're also better insulated against later modifications to the
	run-time library; since you control the code, you can modify it when
	you need to. This is by far your best alternative. You'll KNOW what's
	going on and you'll be able to ensure that you can maintain your
	applications. The only routines not included in this source are the
	floating-point and graphics routines.
	
	You may be able to find a source for routines written to support TSR
	programming even though Microsoft does not offer such software. Look
	for ads in the programmer-oriented PC magazines and/or call some of
	the programming-oriented software dealers.
	
	The run-time source allows you to determine which functions call DOS
	via INT 21h and which don't. Having the source also allows you to come
	up with alternative strategies for those functions that make calls.
	
	The "MS-DOS Encyclopedia" (published by Microsoft Press) is an
	excellent source of information about writing TSRs.
