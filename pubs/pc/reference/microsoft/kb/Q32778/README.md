---
layout: page
title: "Q32778: C4001 and C4074 &quot;Function Given File Scope&quot; Warnings"
permalink: /pubs/pc/reference/microsoft/kb/Q32778/
---

## Q32778: C4001 and C4074 &quot;Function Given File Scope&quot; Warnings

	Article: Q32778
	Version(s): 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1991
	
	When compiling at warning level 4 (/W4), with language extensions
	enabled, a function prototype placed within a function will cause the
	compiler to generate the following warning:
	
	   C4001 nonstandard extension used - 'function given file scope'
	
	According to the ANSI standard, functions cannot be declared with
	block scope; they must appear at file scope. The warning indicates
	that allowing the placement of the function prototype inside the block
	is an extension to the C language, and the compiler will behave as
	though the function was declared at file scope. The warning can be
	avoided by placing the function prototype outside the function.
	
	With C versions 5.10 and earlier, this warning occurs at warning level
	3 (/W3) and appears as follows:
	
	   C4074 non-standard extension used - 'function given file scope'
	
	The sample program below demonstrates this warning.
	
	Sample Code
	-----------
	
	void main (void);
	void main (void)
	 {
	 void foo(int x);
	 }
