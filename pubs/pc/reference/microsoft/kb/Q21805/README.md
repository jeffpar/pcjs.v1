---
layout: page
title: "Q21805: &lt; RESUME Linenumber &gt; Is Not Allowed for Subprograms"
permalink: /pubs/pc/reference/microsoft/kb/Q21805/
---

## Q21805: &lt; RESUME Linenumber &gt; Is Not Allowed for Subprograms

	Article: Q21805
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 16-NOV-1988
	
	Question:
	
	How can I use ON ERROR GOTO to trap errors that occur inside of
	subprograms separately compiled from the main program in QuickBASIC
	Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00, and 4.00 for MS-DOS?
	
	Response:
	
	The following information should be added to the "Microsoft QuickBASIC
	Compiler" documentation for Versions 1.x, 2.x, and 3.00:
	
	Error handling in separately compiled subprograms should be coded in
	the following fashion:
	
	   SUB test STATIC
	   ON ERROR GOTO errortrap
	      ' body of subprogram
	   END SUB
	   errortrap:
	      ' The error is handled here:
	      PRINT "Error Number Trapped="ERR
	      RESUME NEXT
	
	In QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00, and 4.00,
	the ON ERROR GOTO Label statement must be established for each module;
	otherwise, an error occurring in that module will not be trapped, and
	the program will stop. In QuickBASIC Versions 4.00 and earlier, error
	handling routines are local to each separately compiled module. A
	given error handling routine serves all subprograms that are compiled
	in the same module. To trap errors, the ON ERROR GOTO statement should
	appear in each subprogram that is compiled separately from the main
	module.
	
	In contrast to earlier versions, QuickBASIC Versions 4.00b and 4.50,
	and the Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS
	and MS OS/2 offer global handling of ON ERROR (as explained in the
	UPDATE.DOC disk file). With global error-handling, an ON ERROR handler
	in the main program handles errors occurring in separate modules when
	those modules do not have their own ON ERROR handlers.
	
	All versions of QuickBASIC do not allow you to use < RESUME
	linenumber > or < RESUME linelabel > to handle errors that occur in
	subprograms. QuickBASIC only allows the use of RESUME or RESUME NEXT
	with subprograms. This fact needs to be added to Pages 128 and 129 of
	the "Microsoft QuickBASIC Compiler" documentation for Versions 2.x and
	3.00.
	
	In Version 1.02, if a < RESUME linenumber > or < RESUME linelabel >
	statement is used in a separately compiled subprogram, an "SB"
	(subprogram) error displays, but an OBJ file still will be created.
	You should not LINK the OBJ file if it receives an "SB" error, or if
	it uses < RESUME linenumber > or < RESUME linelabel > with
	subprograms. If you did use the file, you could receive unpredictable
	errors at run time due to eventual stack overflow.
	
	QuickBASIC Versions 2.00 and later will properly give you a
	"Subprogram Error" message and will not produce an OBJ file if you use
	< RESUME linenumber > or < RESUME linelabel >.
	
	Note also that < RETURN linenumber > or < RETURN linelabel > is not
	allowed with "ON event GOSUB" trapping used with subprograms; only
	RETURN is allowed. This fact applies to ON TIMER GOSUB, ON KEY GOSUB,
	ON PLAY GOSUB, ON STRIG GOSUB, and ON PEN GOSUB. Event trapping should
	be structured similar to error trapping in the sample program above.
	
	For a related article, you may query on "subprogram module error
	resume QuickBASIC" in this database.
