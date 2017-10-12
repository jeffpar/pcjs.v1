---
layout: page
title: "Q47764: Ambiguous Documentation of Enter ASCII (EA) Command"
permalink: /pubs/pc/reference/microsoft/kb/Q47764/
---

	Article: Q47764
	Product: Microsoft C
	Version(s): 2.10 2.20 | 2.10 2.20
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 16-AUG-1989
	
	In the "Microsoft C 5.1 Optimizing Compiler" manual, the "CodeView and
	Utilities" section does not thoroughly document the EA command for
	CodeView. The following is a more complete explanation:
	
	   EA address [list]
	
	   The Enter ASCII (EA) command modifies array to the value of [list].
	   Address refers to what you want to modify. [list] refers to a
	   string literal such as "hello". EA will copy [list] to array. Thus,
	   if you specify address by giving an array, such as an array of
	   characters, the array will have [list] copied into it. However, if
	   you were to give a pointer to a character, then the bytes that make
	   up the pointer will be directly modified, not the block of memory
	   the pointer is pointing at.
	
	Consider the following examples:
	
	char array[] = "Hello";
	char *ptr    = "Hello";
	
	>EA array "Hi"
	>EA ptr   "Hi"
	
	The result is that the array would contain "Hillo", and ptr will be
	pointing to some unknown memory location.
	
	The array is considered a constant pointer to a block of memory, and
	as such, any operations on it can only affect the block of memory.
	However, ptr is a variable; therefore, any operations on it affect the
	value of ptr, which happens to be a two- or four-byte number. That
	number happens to refer to a location in memory.
	
	If you want to changed the block of memory that ptr points to, you
	must do the following:
	
	   >EA &ptr[0] "Hi"
	
	Essentially, this takes the address of the character that ptr is
	pointing at, gives a constant address, and thus modifies the block of
	memory there. To clarify, imagine you have a character located some
	place in memory. To move a character, you must make a copy of it to
	some other memory location; it is not possible to take its address and
	modify the address directly to change where the character is located.
	Thus, the address of that character is always a constant value. ptr[0]
	happens to be a character located someplace in memory. As such, the
	address of that specific character is a constant value. Since a
	constant cannot be modified, EA changes the block of memory starting
	at where the constant pointer is pointing.
