---
layout: page
title: "Q38291: Cannot Define Preprocessor Directives with #define"
permalink: /pubs/pc/reference/microsoft/kb/Q38291/
---

	Article: Q38291
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 28-NOV-1988
	
	The Microsoft C Compiler does not allow a "#define" statement to
	define another preprocessor directive. Although the preprocessor
	output option ( /P or /E ) generates the desired expansion, the
	Microsoft C Compiler Version 5.10 generates the following error
	messages when compiling the code below:
	
	   error C2014: preprocessor command must start as first non-whitespace
	   error C2054: expected '(' to follow 'define'
	   error C2061: syntax error : identifier 'MAX'
	
	The following code demonstrates the problem:
	
	#define A( x )      x##define       MAX     100
	
	A( # )
	/*
	    Preprocessor output expands A( # ) to be:
	#define       MAX     100
	*/
	
	char w[ MAX ];
	void main(void);
	void main()
	{
	w[ 0 ] = w[ MAX ];
	}
