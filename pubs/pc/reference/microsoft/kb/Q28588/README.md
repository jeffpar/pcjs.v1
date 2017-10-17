---
layout: page
title: "Q28588: Pascal Subprogram &quot;Invalid Format&quot; Loaded as Quick Library"
permalink: /pubs/pc/reference/microsoft/kb/Q28588/
---

## Q28588: Pascal Subprogram &quot;Invalid Format&quot; Loaded as Quick Library

	Article: Q28588
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 17-APR-1990
	
	A Pascal subprogram that receives single- or double-precision numbers
	as parameters cannot be made into a Quick library. QuickBASIC gives an
	"invalid format" error when the Quick library is specified during the
	invocation of the QB editor (QB /L pascsub.QLB). This error does not
	occur if using a Pascal function instead of a Pascal subprogram.
	
	The same subprogram can be linked to a QuickBASIC main module and the
	resulting EXE file runs without any problems.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and in the Microsoft BASIC Compiler Version 6.00 for
	MS-DOS and OS/2 (buglist6.00). This problem was corrected in
	QuickBASIC Version 4.50.
	
	Results of testing with previous versions indicate the same problem
	occurs with the release of QuickBASIC provided with the BASIC Compiler
	Version 6.00 for MS-DOS and OS/2.
	
	As a workaround, link the modules together instead of running in the
	QB.EXE editor.
	
	The following is sample code of the QuickBASIC main program (however,
	it never gets this far):
	
	DECLARE SUB PasSub (i!)    'Or i# gives the same results.
	i! = 100000
	CALL PasSub(i!)
	print i!
	
	The following is sample code for the the Pascal subprogram. There is
	a problem with both real4 (single) and real8 (double):
	
	    module Pstuff;
	     procedure PasSub(var b:real4);
	       begin
	         b := b + 1;
	       end; {PasSub}
	    end.
