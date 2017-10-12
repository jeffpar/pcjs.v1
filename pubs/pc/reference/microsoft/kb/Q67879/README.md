---
layout: page
title: "Q67879: Scanf() Format Specifications and Syntax"
permalink: /pubs/pc/reference/microsoft/kb/Q67879/
---

	Article: Q67879
	Product: Microsoft C
	Version(s): 6.00a 6.00 | 6.00a 6.00
	Operating System: MS-DOS     |  OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 31-JAN-1991
	
	The scanf() format specifiers allowed for strings are usually
	specified with the %s format. However, %s is a shortened version of
	what is actually being used. Because %s reads until the first white
	space, %[^\0x20\t\n] is equivalent. This reads as "read in the string
	until encountering a space (\0x20), a tab (\t), or a newline (\n)."
	
	The following are some examples of different uses for the string type:
	
	   String          Usage
	   ------          -----
	
	   %[a-z]          Reads a string until it does not encounter a
	                   letter in "abc...z".
	   %[^a-z]         Reads a string until it encounters a letter
	                   in "abc...z".
	   %[]]            According to ANSI, this will read until it
	                   does not encounter a "]".
	   %[^]]           Reads a string until it encounters a "]".
	   %*[^%]          Scans a string (does not buffer it) until it
	                   reaches a "%".
	
	   Note: The "*" tells the compiler to scan the string and not read it
	   into the buffer.
	
	   %[-af-k]        Reads a string until it does not encounter a
	                   "-", "a", or "f-k" (fgh...k).
	   %[]             Not legal -- unpredictable results.
	   %[^]            Not legal -- unpredictable results.
	
	   Note: Because scanf() receives a string as a parameter, this is not
	   caught by the compiler as an error.
	
	   %40c            Reads in 40 characters to the string.
	
	   Note: A null character is not appended automatically in this case.
	   Also, this does not automatically end scanf() execution after the
	   40th character is read in. Because this is buffered input, a
	   carriage return must be entered to cause the string scan to
	   complete. If a carriage return is entered within the 40 character
	   string, it will be displayed normally, but will continue to prompt
	   for more input until all 40 characters have been read.
	
	     %[^.-]          Reads a string until it encounters a "." or a
	                     "-".
