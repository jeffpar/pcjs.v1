---
layout: page
title: "Q37666: Additional Causes of Error C2152"
permalink: /pubs/pc/reference/microsoft/kb/Q37666/
---

## Q37666: Additional Causes of Error C2152

	Article: Q37666
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QUICKC docerr
	Last Modified: 14-NOV-1988
	
	Page 267 of the "Microsoft C 5.1 Optimizing Compiler User's Guide"
	(Page 337 of the "Microsoft QuickC Programmer's Guide") states that
	error C2152 (pointers to functions with different attributes) is
	caused when the following occurs:
	
	   An attempt was made to assign a pointer to a function
	   declared with one calling convention (cdecl, fortran, or
	   pascal) to a pointer to a function declared with a
	   different calling convention.
	
	This is correct, but incomplete. Additional causes are mixing near
	and far function pointers and mixing interrupt and non-interrupt
	function pointers.
