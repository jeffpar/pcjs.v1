---
layout: page
title: "Q69156: Underscore+CR+LF Added Before DATA Statement If &gt; 250 Columns"
permalink: /pubs/pc/reference/microsoft/kb/Q69156/
---

## Q69156: Underscore+CR+LF Added Before DATA Statement If &gt; 250 Columns

	Article: Q69156
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 14-FEB-1991
	
	If an indented DATA statement in a program exceeds the 250th column
	and the program is then saved as ASCII text in the QB.EXE or QBX.EXE
	environment, then an underscore (_) plus a carriage return (CR, ASCII
	value 13) plus a linefeed (LF, ASCII value 10) will be added
	immediately in front of the DATA statement. The actual data contents
	in the DATA statement will not not changed.
	
	The addition of "_<CR><LF>" in front of the DATA statement occurs only
	if the last character in the DATA statement exceeds the 250th column,
	and the DATA statement is immediately preceded on the same line by
	spaces, a line number, line label, or other code.
	
	Microsoft has confirmed this problem in QB.EXE in Microsoft QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS; in QB.EXE in Microsoft
	BASIC Compiler versions 6.00 and 6.00b (buglist6.00 and buglist6.00b)
	for MS-DOS; and in QBX.EXE in Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS (buglist7.00 and
	buglist7.10). Microsoft is researching this problem and will post new
	information here as it becomes available.
	
	If the DATA statement is in the first column on the line or if the
	file is saved using Fast Load and Save format, then the problem does
	not occur (whether or not the line exceeds the 250th column).
	
	The added "_<CR><LF>" characters have no affect on the performance of
	the QuickBASIC program, and in QB.EXE or QBX.EXE, the "_<CR><LF>"
	characters just appear as an extra space. Each save in ASCII text
	format will add what appears to be an additional space in front of the
	DATA statement. Note that you can only see the "_<CR><LF>" characters
	if you type the file in DOS or load the file into a standard text
	editor.
	
	However, the problem does have an adverse affect if you load a
	line-numbered program into the GW-BASIC or BASICA Interpreter. In
	GW-BASIC or BASICA, the file is loaded only up to the "_<CR><LF>". The
	rest of the file is ignored and the message "Direct Statement In File"
	appears. For example, make the following line-numbered DATA statement
	exceed 250 characters, save it as an ASCII text file in QB.EXE or
	QBX.EXE, then try to load the file into GW-BASIC or BASICA:
	
	   100 DATA 123,1234567890,1234567890, ... ,1234567890
