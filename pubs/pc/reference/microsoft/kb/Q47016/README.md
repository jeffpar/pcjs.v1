---
layout: page
title: "Q47016: Incorrect Response File Used with LIB Causes U1183 Error"
permalink: /pubs/pc/reference/microsoft/kb/Q47016/
---

## Q47016: Incorrect Response File Used with LIB Causes U1183 Error

	Article: Q47016
	Version(s): 3.1x   | 3.1x
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-AUG-1989
	
	Question:
	
	I want to use a response file entitled LIB_OPS with the library
	manager just for specifying my library operations. When I invoke LIB
	with the command
	
	   LIB mylib.lib @lib_ops, mylib.lst;<cr>
	
	it generates the following error:
	
	   LIB : fatal error U1183 : 'cannot open response file'
	
	However, when I invoke LIB using the command prompts and supply my
	response file for the Operations prompt as follows, everything works
	correctly:
	
	    .
	    .
	    Operations: @lib_ops<cr>
	    .
	    .
	
	What differentiates the two cases?
	
	Response:
	
	Using a response file on the command line of the library manager
	requires that the response filename be delimited correctly. This is
	mandated by the command-line parser, which considers trailing argument
	delimiters such as a comma or semicolon to be part of the response
	filename. Consequently, the parsing of the unknown filename prohibits
	DOS from locating and opening the correct response file. When a
	response file is detected on the LIB command line (via the "@"
	character), the command interpreter parses following characters as the
	filename argument until a DOS delimiter, either a space character or a
	carriage return, is encountered. Hence, LIB commands such as
	
	   LIB @response;<cr>
	   LIB mylib.lib @response, mylib.lst;<cr>
	
	generate the U1183 "cannot open response file" because the file
	"response" is actually parsed as "response;" and "response,",
	respectively, neither of which exist in the current working directory
	or those directories searched for by the DOS APPEND command. However,
	correctly delimiting the end of the response file argument with a
	space or carriage return allows the following LIB commands to work
	correctly:
	
	   LIB @response ;<cr>
	   LIB @response<cr>
	   LIB mylib.lib @response ,mylib.lst;<cr>
	
	When operating the library manager with a response file containing
	information for one or more of the LIB arguments, it must be invoked
	in one of the following two ways:
	
	1. With the response file supplied on the LIB command line and the
	   file's final character delimited correctly (by a space or carriage
	   return).
	
	2. With no command line arguments and the response file used as a
	   reply to the appropriate LIB command prompt.
	
	The first method is discussed and illustrated in the information
	above. The second method of using the library manager prompts is
	equally effective. However, when supplying a response file to a LIB
	command prompt, the filename must be delimited correctly as in the
	aforementioned, or the U1183 error occurs. The following example
	demonstrates the generation of this error due to incorrect delimiting
	of the response file:
	
	LIB<cr>
	
	Microsoft (R) Library Manager  Version 3.14
	Copyright (C) Microsoft Corp 1983-1988. All rights reserved
	
	Library name: mylib.lib<cr>
	
	Operations: @response;<cr>
	
	LIB : Fatal Error U1183:  Cannot open response file
	
	Correcting the response file argument to the Operations prompt as
	follows eliminates the problem:
	
	Operations: @response<cr>
	
	or
	
	Operations: @response thisisextrajunkbutwillworkcuzofthe<space>delimiter
