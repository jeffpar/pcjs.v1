---
layout: page
title: "Q38218: Why pointer1++ = pointer2 Is Illegal"
permalink: /pubs/pc/reference/microsoft/kb/Q38218/
---

	Article: Q38218
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 21-NOV-1988
	
	Question:
	
	Why is the following statement
	
	   pointer1++ = pointer2 ;
	
	illegal, causing error 2106 : left operand must be lvalue,
	when the following statement is legal?
	
	   *pointer1++ = *pointer2 ;
	
	Both pointer1 and pointer2 are declared as pointers to the same type.
	
	Response:
	
	Because the post-increment operator ++ has higher precedence than the
	assignment operator =, the following statement
	
	   pointer1++ = pointer2 ;
	
	is equivalent to the following statement:
	
	   (pointer1++) = pointer2 ;
	
	As defined by the post-increment operation, the result of evaluating
	the expression (pointer1++) is NOT a lvalue. So (pointer1++) cannot
	be used as a left operand of the assignment operator.
	
	However, a statement such as the following, which is equivalent to
	*(pointer1++) = *pointer2 ;, is legal:
	
	    *pointer1++ = *pointer2 ;
	
	This statement is legal because although (pointer1++) is not a lvalue,
	it can be used for indirection and *(pointer1++) is a lvalue.
	
	It is very important to understand the difference between the value of
	the expression (pointer1++) and the value of pointer1. Although
	(pointer1++) has higher precedence in the above statements, the result
	of evaluating (pointer1++) has the old value that pointer1 had before
	the evaluation of the expression (pointer1++). Because of the side
	effect of the post-increment operator, the evaluation of (pointer1++)
	causes the value of pointer1 to be incremented by 1 only after the
	rest of the statement has been evaluated. In other words, as an
	address, (pointer1++) points to the same memory location as pointer1
	used to. Therefore, *pointer1++ or *(pointer1++) represents the same
	object as *pointer1 used to.
	
	The following example has the effect of assigning "a" to memory
	offset location 0x100, then incrementing ptr1 to point to memory
	offset 0x101:
	
	char * ptr1 = 0x100; /* ptr1 points to memory offset 0x100
	                        in the current data segment
	                        for small or medium memory models */
	*ptr1++ = 'a';
