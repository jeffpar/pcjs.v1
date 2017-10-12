---
layout: page
title: "Q58802: _asm Needed for Each Line of Inline Assembly Macros"
permalink: /pubs/pc/reference/microsoft/kb/Q58802/
---

	Article: Q58802
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKASM
	Last Modified: 21-FEB-1990
	
	In QuickC Version 2.00, the _asm keyword is needed between each code
	line of inline assembly macros. _asm works as a statement separator
	similar to the C comma or semicolon operators.
	
	When writing #define macros in C, they must be written on a single
	logical line. The escape character allows you to extend this logical
	line over more than one source line in your program. However, it is
	important to remember that the preprocessor is simply going to
	concatenate the macro into one logical line before compilation.
	
	Since assembly code is usually separated only by a new line, this
	causes a problem with multi-line assembly macros. Putting the _asm
	keyword before each assembly command forces the needed separation and
	allows the macro to behave properly. This is described briefly in "C
	For Yourself" on Page 277.
	
	Sample Code
	-----------
	
	The following macro causes errors C4405 and C2400 when compiled under
	QuickC:
	
	#define SETPAGE( page )  _asm \
	                         {    \
	                              mov ah, 5 \
	                              mov al, byte ptr page \
	                              int 10h \
	                         }
	
	In the preprocessor, this concatenates to the following:
	
	_asm { mov ah, 5 mov al, byte ptr page int 10h }
	
	The correct syntax for the macro, as it appears on Page 277 of "C for
	Yourself," is as follows:
	
	#define SETPAGE( page )  _asm \
	                         {    \
	                              _asm mov ah, 5 \
	                              _asm mov al, byte ptr page \
	                              _asm int 10h \
	                         }
	
	Note that the first _asm statement before the opening curly brace ({)
	is not needed.
