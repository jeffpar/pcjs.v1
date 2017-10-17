---
layout: page
title: "Q37726: Error C2143 Syntax Error : Missing 'token1' before 'token2'"
permalink: /pubs/pc/reference/microsoft/kb/Q37726/
---

## Q37726: Error C2143 Syntax Error : Missing 'token1' before 'token2'

	Article: Q37726
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 14-NOV-1988
	
	The following error is from "Compilation-Error Messages" in the
	"Microsoft C Optimizing Compiler User's Guide," Section E.3.2, Page
	265, and in the "Microsoft QuickC Compiler Programmer's Guide,"
	Section D.1.2, Page 336:
	
	C2143       syntax error : missing 'token1' before 'token2'
	
	            The compiler expected token1 to appear before token2. This
	            message may appear if a required closing brace (}), right
	            parenthesis ()), or semicolon (;) is missing.
	
	When the compiler encounters any of the errors listed in this section,
	it continues parsing the program (if possible) and outputs additional
	error messages. However, no object file is produced.
	
	This error can occur when a semicolon (;) is missing at the end of a
	function prototype. The following program demonstrates this:
	
	void foo(void)
	void main(void)
	{
	}
	
	When this code is compiled, the following errors occur:
	
	error C2085: 'main' : not in formal parameter list
	error C2143: syntax error : missing ';' before '{'
	
	With no semicolon to mark the end of the prototype, the compiler
	interprets the prototype as the start of a function definition, and
	the next line to follow the prototype as if it were the first
	declaration within a function definition.
