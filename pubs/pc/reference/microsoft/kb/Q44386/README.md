---
layout: page
title: "Q44386: Determining the Memory Model for Conditional Compilation"
permalink: /pubs/pc/reference/microsoft/kb/Q44386/
---

## Q44386: Determining the Memory Model for Conditional Compilation

	Article: Q44386
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_QuickC
	Last Modified: 25-JUL-1989
	
	There is a predefined identifier that can be used to allow the
	preprocessor to determine which memory model has been chosen for the
	current compilation. The identifier is M_I86?M, where "?" is an
	identifier for one of the following five memory models:
	
	   S = Small
	   M = Medium
	   L = Large
	   C = Compact
	   H = Huge
	
	This identifier can be used with a preprocessor command to produce
	conditional compilation dependent upon the memory model. An example of
	its use is shown below. For more information, refer to the include
	file MALLOC.H, which uses the identifier to determine which variant of
	the memory allocation function "malloc" should be used in the current
	compilation.
	
	Code Example
	------------
	
	/*
	 *
	 * This example demonstrates how to use the C compiler M_I86?M values.
	 * It also shows other various preprocessor components. The
	 * memory model is displayed using the message() pragma. If the memory
	 * model is not recognized by the program, the compilation terminates
	 * using the #error preprocessor directive. The identifier _MEMORY_MODEL_
	 * has been chosen arbitrarily, and has no special value to the C compiler.
	 *
	 */
	
	#include <stdio.h>
	
	#if defined (M_I86CM)
	    #define _MEMORY_MODEL_ "compact"
	#elif defined (M_I86SM)
	    #define _MEMORY_MODEL_ "small"
	#elif defined (M_I86MM)
	    #define _MEMORY_MODEL_ "medium"
	#elif defined (M_I86LM)
	    #define _MEMORY_MODEL_ "large"
	#elif defined (M_I86HM)
	    #define _MEMORY_MODEL_ "huge"
	#else
	    #error "ERROR: unknown memory model!!"
	    #define _MEMORY_MODEL_ "**UNKNOWN**"
	#endif
	
	#pragma message ("Using the " _MEMORY_MODEL_ " memory model...")
	
	void main(void);
	
	void main(void)
	{
	   printf("hello, world\n");
	}
