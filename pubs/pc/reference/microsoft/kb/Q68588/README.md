---
layout: page
title: "Q68588: OutGText% Works Only on First Call If WINDOW Invoked; UI Font"
permalink: /pubs/pc/reference/microsoft/kb/Q68588/
---

## Q68588: OutGText% Works Only on First Call If WINDOW Invoked; UI Font

	Article: Q68588
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910114-77
	Last Modified: 29-JAN-1991
	
	Using the OutGText% function more than once does not display the text
	in the same location if you have invoked the SCREEN command prior to
	invoking OutGText%. GTextWindow must be called before any OutGText%
	commands.
	
	This information applies to the User Interface (UI) Toolbox Font
	procedures in Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS. (See GTextWindow in the README.DOC
	file.)
	
	The procedure OutGText% initializes the screen to its full-screen
	parameters before displaying the user's text. To reinitialize the
	screen back to its original user-specified parameters, GTextWindow
	must have been called. GTextWindow stores the screen coordinates for
	later use (for example, in the OutGText% function).
	
	Because the WINDOW statement uses the same parameters as GTextWindow,
	you may want to include the command WINDOW(X1,Y1,X2,Y2) in the
	GTextWindow procedure, and substitute the GTextWindow call whenever
	referencing the WINDOW statement.
	
	Code Example
	------------
	
	The code below demonstrates the correct method to display the text
	"Hello world" in the location (0,100). If GTextWindow is not called,
	"Hello world" will be displayed twice in two different locations.
	
	SCREEN 9
	FontNum% = RegisterFonts("TMSRB.FON")
	var1% = LoadFont%("N4,N5,N6")
	a$ = "Hello world"
	CALL GTextWindow(-200, -200, 200, 200, FALSE)   'store coordinates
	WINDOW (-200, -200)-(200, 200)
	PSET (0, 100)
	var1% = OutGText%(0, 100, a$)
	var1% = OutGText%(0, 100, a$)
	PSET (0, 100)
	END
	
	Reference
	---------
	
	According to the README.DOC file for BASIC PDS 7.00 and 7.10, after
	the first call to OutGText to output text, you must precede each
	subsequent call to OutGText with a call to GTextWindow in order to
	preserve logical coordinates of the window.
