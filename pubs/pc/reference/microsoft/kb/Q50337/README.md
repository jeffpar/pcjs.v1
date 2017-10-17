---
layout: page
title: "Q50337: Internal Compiler Error: ctypes.c:1.107, Line 474"
permalink: /pubs/pc/reference/microsoft/kb/Q50337/
---

## Q50337: Internal Compiler Error: ctypes.c:1.107, Line 474

	Article: Q50337
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-NOV-1989
	
	The program below generates the following error when compiled with the
	default command-line options under the Microsoft C optimizing compiler
	Version 5.10:
	
	   intr.c(12) : fatal error C1001: Internal Compiler Error
	                   (compiler file '@(#)ctypes.c:1.107', line 474)
	                   Contact Microsoft Technical Support
	
	The following program demonstrates the internal compiler error:
	
	#define  interrupt_number = 0x62     /*  any number will do */
	
	struct interface {
	                     int counter;
	                     char signature[8];
	                 } far interface;
	
	void far*far*interrupt_vector = ( void far * )0L;
	
	int main( void )
	{
	   /* offending line--invalid */
	   interrupt_vector[interrupt_number] = interface;
	
	   /* replace with this line */
	// interrupt_vector[interrupt_number] = &interface;
	}
	
	The program is not syntactically valid: the offending line attempts to
	assign a structure (rather than a pointer to the structure) to a void
	function pointer.
	
	Modifying the offending line of code to a pointer rather than a
	structure [i.e., using the "address of" operator ("&") on the
	interface structure] eliminates the internal compiler error and makes
	the program correct.
