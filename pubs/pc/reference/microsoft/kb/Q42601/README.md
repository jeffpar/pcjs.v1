---
layout: page
title: "Q42601: CodeView: Watchpoints and Tracepoints with Enumerated Types"
permalink: /pubs/pc/reference/microsoft/kb/Q42601/
---

## Q42601: CodeView: Watchpoints and Tracepoints with Enumerated Types

	Article: Q42601
	Version(s): 2.20   | 2.20
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_c
	Last Modified: 28-MAR-1989
	
	CodeView will not display the members of an enumerated type as they
	are declared in a C program. Only the integer representations of these
	types of variables can be shown. The following is an example:
	
	/*  Example enumerated type.
	 */
	
	enum e_type
	{
	    var1,
	    var2,
	    var3
	};
	
	enum e_type foo = var1;
	
	CodeView will not display "var1", "var2", or "var3" when watching a
	variable of type e_type, such as foo. CodeView will instead show the
	integer values of the variable: 0, 1, and 2, respectively. In order to
	watch the variable foo, you must explicitly display its value as an
	integer. The following command will add the proper watch:
	
	    w? foo,d
	
	To set a watchpoint or a tracepoint on the same variable, further type
	casts must be made. These lines will produce watchpoints and
	tracepoints on foo, as follows:
	
	    wp? *(int *)&foo == 1
	    tp? *(int *)&foo
	
	Trying to set a watchpoint without the proper type cast will result in
	the following error:
	
	    Operand types incorrect for this operation
	
	Setting a tracepoint on foo without this type cast will set the
	tracepoint but will only show "?CANNOT DISPLAY" in the watch window.
	Going through the right steps will display the current integer value
	of the variable, as it should.
