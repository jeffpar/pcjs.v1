---
layout: page
title: "Q67788: IRP Directive Has Single Line Limit of 120 Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q67788/
---

## Q67788: IRP Directive Has Single Line Limit of 120 Characters

	Article: Q67788
	Version(s): 5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist5.10a
	Last Modified: 6-FEB-1991
	
	The IRP (Instruction Repeat) directive in MASM has a single line limit
	of 120 characters. The example code below shows a macro with an IRP
	that has 125 characters. The result of this program is an error
	message that states:
	
	        End of file encountered on input file
	        Number of open conditionals:14
	        End of file encountered on input file
	
	This error occurs because the assembler is looking for a closing
	bracket (>), but the line is over the limit of 120 characters. As a
	result, the assembler accepts the rest of the code to be part of the
	IRP parameters. By shortening the final parameter to be within the
	limit (change TP$_EOS to TP), the bracket is read correctly and the
	remainder of the program is assembled with no errors.
	
	NOTE: In this example, the IRP argument list is stated in three lines;
	however, it should be all on the same line to cause the error. The
	120-character limit is only on the same line. A workaround is to
	continue the argument on the next line as seen below.
	
	Microsoft has confirmed this to be a problem in MASM version 5.10 and
	5.10a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	$tran   macro   keyword
	   irpc TP$_DUMMY,<keyword>
	      ifidn <&TP$_DUMMY>,<T>
	         irp TP$_DUMMY2,<TP$_ANY,TP$_ALPHA,TP$_DIGIT,
	                        TP$_STRING,TP$_SYMBOL,TP$_BLANK,TP$_DECIMAL,
	                        TP$_OCTAL,TP$_HEX,TP$_LAMBDA,TP$_EOS>
	            %out TP$_DUMMY2
	         endm
	      endif
	   endm
	endm
	
	   $tran     if_anything_cmd
	end
