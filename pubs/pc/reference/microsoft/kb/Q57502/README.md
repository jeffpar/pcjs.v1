---
layout: page
title: "Q57502: LoadFont Function Example Documentation Error in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q57502/
---

## Q57502: LoadFont Function Example Documentation Error in BASIC 7.00

	Article: Q57502
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891211-4 docerr
	Last Modified: 8-JAN-1991
	
	Page 524 of the "Microsoft BASIC 7.0: Language Reference" for
	Microsoft BASIC Professional Development System (PDS) Versions 7.00
	and 7.10 shows an incorrect example of how to load a font by its order
	in the font file. This documentation incorrectly states the following:
	
	   Note that to load fonts according to their order in the font
	   file, l% would take the form:
	
	      l% = LoadFont%("n1,n3,n6")
	
	The code above should read as follows (where l% means L%, not to be
	confused with 1%):
	
	   l% = LoadFont%("n1/n3/n6")
	
	When loading multiple fonts, each font given in the fontspec$ argument
	of LoadFont%(fontspec$) should be separated by forward slashes (the
	"/" character), not by commas.
	
	If the code in this documentation error is used, only the first font
	is loaded (l% contains the number "1", indicating that only one font
	is loaded).
	
	Code Example
	------------
	
	The following code example demonstrates the documentation problem. To
	use this code example, you must start QBX.EXE with /L FONTBEFR.QLB to
	access the font routines.
	
	REM $INCLUDE: 'fontb.bi'
	'* Load a the Times Roman font.
	SCREEN 9
	PRINT "Registering Times Roman font."
	FontNum% = RegisterFonts("D:\BC7\FONTS\TMSRB.FON")
	PRINT "Number of fonts in the file: "; FontNum%
	PRINT "Loading fonts 4,5,6 from the Times Roman file."
	var1% = LoadFont%("N4,N5,N6")
	PRINT "Number of fonts successfully loaded"; var1%
	PRINT "value of FontErr", FontErr
	a$ = "Hello world"
	var1% = OutGText%(100, 100, a$)
	END
