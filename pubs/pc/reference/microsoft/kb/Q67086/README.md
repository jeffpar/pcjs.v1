---
layout: page
title: "Q67086: va_arg() Fails on Odd-Size Structs Packed on 1-Byte Boundaries"
permalink: /pubs/pc/reference/microsoft/kb/Q67086/
---

## Q67086: va_arg() Fails on Odd-Size Structs Packed on 1-Byte Boundaries

	Article: Q67086
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_quickc buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 19-JAN-1991
	
	Because the va_arg() macro does not handle odd-sized arguments
	properly, odd-sized structures should not be passed by value to
	variable argument functions if the structures are packed on 1-byte
	boundaries. Because an even number of bytes is always put on the stack
	for each argument passed, a packed structure with an odd size will not
	be retrieved properly. Using an even packing size or passing the
	structure by reference will eliminate this problem.
	
	For more information on the va_arg() problem with odd-sized arguments,
	query on the following words:
	
	   va_arg and char
	
	To demonstrate this problem, assume a program contains code resembling
	the following:
	
	#pragma pack(1)
	
	struct foo {
	             int  x;
	             char y[5];
	           } oddstruct;
	
	If the structure "oddstruct" is passed to a function by value and that
	function takes a variable number of arguments, then accessing the
	structure from within the function with va_arg() will fail. The
	sizeof(oddstruct) is actually 7 in this case, but 8 bytes will have
	been pushed on the stack.
	
	Microsoft has confirmed this to be a problem in C versions 5.10, 6.00,
	and 6.00a and QuickC versions 2.00, 2.01, 2.50, and 2.51 (buglist2.00,
	buglist2.01, buglist2.50, and buglist2.51). We are researching this
	problem and will post new information here as it becomes available.
