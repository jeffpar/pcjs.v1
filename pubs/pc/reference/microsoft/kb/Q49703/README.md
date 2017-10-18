---
layout: page
title: "Q49703: PROC Directive Requires Language Parameter"
permalink: /pubs/pc/reference/microsoft/kb/Q49703/
---

## Q49703: PROC Directive Requires Language Parameter

	Article: Q49703
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 29-MAR-1990
	
	If the PROC directive is used with arguments and a language specifier
	is not used, the following warning is generated:
	
	   A4001: Extra characters on line
	
	The following is an example:
	
	    .model small
	    .code
	    public foo
	    foo proc uses di si, arg1:word
	    foo endp
	    end
	
	The statement "foo proc uses di si, arg1:word" generates the warning.
	
	The workaround for this problem is to specify a language parameter. To
	correct the program above, replace the statement ".model small" with
	".model small,language" where language is either FORTRAN, PASCAL,
	BASIC, or C.
	
	Microsoft has confirmed this to be a problem in Macro Assembler
	Version 5.10. We are researching this problem and will post new
	information here as it becomes available.
