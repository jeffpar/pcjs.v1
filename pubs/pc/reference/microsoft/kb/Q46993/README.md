---
layout: page
title: "Q46993: C Version 5.10 Does Not Handle const Keyword Like ANSI"
permalink: /pubs/pc/reference/microsoft/kb/Q46993/
---

	Article: Q46993
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G890706-22068
	Last Modified: 18-AUG-1989
	
	Consider the following program "fubar.c":
	
	1:  void main(void)
	2:      {
	3:      char * const String;
	4:
	5:      *String   = 'a';
	6:      String[0] = 'a';
	7:      }
	
	Lines 5 and 6 would be expected to have the same effect. However,
	compiling
	
	   cl fubar.c
	
	produces the following error message:
	
	   fubar.c(6) : error C2166: lval specifies 'const' object
	
	If the "const" attribute is removed from the declaration of "String",
	the error message is eliminated. As per the ANSI C usage of "const",
	Lines 5 and 6 should indeed be synonymous.
	
	Response:
	
	Version 5.10's handling of const doesn't quite match the current ANSI
	draft, and works inconsistently.
	
	Microsoft is researching this problem and will post new information as
	it becomes avialable.
	
	Note: according to ANSI, to create the error on the two lines
	consistently, you need to use
	
	   const char * string = "This is a string";
	
	or (equivalently)
	
	   char const * string = "This is a string";
	
	both of which say that "string" points to a const char. The following
	line says that the pointer "string" is constant, but the char to which
	it points is not -- so no error occurs:
	
	   char * const string = "This is a string";
	
	To make both constant, use the following:
	
	   const char * const string = "This is a string";
	
	Note that the above four examples do not work correctly on Version
	5.10. This feature is under review and should be fixed in the next
	release.
