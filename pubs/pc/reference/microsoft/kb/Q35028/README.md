---
layout: page
title: "Q35028: Passing Textargs to M with the /E Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q35028/
---

	Article: Q35028
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 1-SEP-1988
	
	Question:
	
	How can I pass textargs to the editor using the /e command-line
	switch?
	
	Response:
	
	Type in the name of the function you want the editor to execute. If
	you want to use more than one function, enclose the functions in
	double-quotation marks. If your functions require arguments, use the C
	syntax for specifying quotation marks within strings, i.e., the
	backslash escape character (\). Thus, a double-quotation mark within
	a string is specified with \".
	
	The following examples demonstrate various methods of passing
	command-line arguments to M:
	
	m /e psearch myfile
	
	This example invokes the Microsoft Editor on the file "myfile",
	passing it the command "psearch" to be executed immediately. The
	psearch will search for whatever string was last specified (in the
	search buffer).
	
	m /e "mark psearch" myfile
	
	This example again edits "myfile", but this time it passes two
	commands to M: "mark" and "psearch". The Mark command goes to the
	beginning of the file, and psearch searches forward for an occurrence
	of the search-string (which must have been specified in a previous
	search).
	
	m /e "arg \"search string\" psearch" myfile
	
	This example passes the editor the following string:
	
	"arg "search string" psearch"
	
	The \" characters are a C escape sequence that evaluates to a
	double-quotation mark ("); as a result, the entire string has a string
	embedded in it. The effect of this command is to tell the editor to
	search for the literal text "search string".
	
	m /e "arg \"\\\"a quoted search string\\\"\" psearch" myfile
	
	This is the most complicated case of argument passing. It
	passes the following string to the editor:
	
	"arg "\"a quoted search string\"" psearch"
	
	This command searches for the QUOTED literal text ""a quoted search
	string"".  The "\" and \"" are necessary to cause M itself to postpone
	evaluation of the double-quotation marks until actual search time.
