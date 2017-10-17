---
layout: page
title: "Q57354: How to Print BASIC Video Screens to Epson Printers"
permalink: /pubs/pc/reference/microsoft/kb/Q57354/
---

## Q57354: How to Print BASIC Video Screens to Epson Printers

	Article: Q57354
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom BQ0085
	Last Modified: 18-OCT-1990
	
	This document explains how Microsoft BASIC programs can print video
	screen images to Epson-compatible printers. If you have a printer
	other than an Epson, you must change the printer control codes used in
	the following programs for setting line spacing and graphics mode.
	Control codes can be found in your printer's manual.
	
	This document is also available in four shorter, separate
	articles that can be found by querying on the following words:
	
	   Epson and print and screen and QuickBASIC
	
	These examples apply to Microsoft QuickBASIC versions 4.00, 4.00b, and
	4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b; and to
	Microsoft BASIC PDS (Professional Development System) versions 7.00
	and 7.10 for MS-DOS. The CGA method can be adapted for QuickBASIC
	versions 2.00, 2.01, and 3.00.
	
	          How to Print BASIC Video Screens to Epson Printers
	          --------------------------------------------------
	
	Introduction
	------------
	
	This document explains how Microsoft BASIC programs can print video
	screen images to Epson-compatible printers. If you have a printer
	other than an Epson, you must change the printer control codes used in
	the following programs for setting line spacing and graphics mode.
	Control codes can be found in your printer's manual.
	
	The routines presented below are divided based on SCREEN modes. SCREEN
	modes 0 through 2 use one method of printing, SCREEN 3 uses another,
	SCREEN modes 7 through 12 are all combined into one routine, and
	SCREEN 13 is another separate routine.
	
	The routines for printing EGA and VGA SCREEN modes 7 through 13 are
	required only if you aren't running under MS-DOS version 4.00 or
	later. In MS-DOS 4.00 and later, the program GRAPHICS.COM supports all
	standard EGA and VGA SCREEN modes. Thus, the routine given below for
	printing CGA SCREEN modes can be used to print EGA and VGA SCREENs in
	MS-DOS 4.00 and later.
	
	Each of these groups of SCREEN modes uses different methods of storing
	graphics information in video memory. A brief explanation of this is
	given before each program. If you want further information about
	graphics memory and the various graphics modes, please refer to the
	following book, which is available in bookstores or by calling
	Microsoft Press at (800) 888-3303 or (206) 882-8661:
	
	    "Programmer's Guide to PC and PS/2 Video Systems," by Richard
	    Wilton (published by Microsoft Press, 1987)
	
	These examples apply to Microsoft QuickBASIC versions 4.00, 4.00b, and
	4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b; and to
	Microsoft BASIC PDS (Professional Development System) versions 7.00
	and 7.10 for MS-DOS. The CGA method can be adapted for QuickBASIC
	versions 2.00, 2.01, and 3.00.
	
	Printing CGA Screen Modes 0 Through 2
	-------------------------------------
	
	The following are two methods of performing a CGA screen dump to a
	graphics printer:
	
	  Note: These methods will also support all standard EGA and VGA
	  SCREEN modes (SCREENs 7 through 13) if you are using
	  GRAPHICS.COM provided in MS-DOS 4.00 or later.
	
	1. You can manually execute a screen dump to a graphics printer of a
	   CGA SCREEN 0, 1, or 2 in BASIC by doing the following:
	
	   a. Run GRAPHICS.COM, which is a terminate-and-stay resident (TSR)
	      program located on the DOS disk (run GRAPHICS.COM only once per
	      boot session).
	
	   b. Press SHIFT+PRINT SCREEN (that is, press the PRINT SCREEN key
	      while holding down the SHIFT key).
	
	      The above SHIFT+PRINT SCREEN screen dump also can print the
	      screen in GW-BASIC, in IBM BASICA, or in most programs that use
	      CGA text or graphics.
	
	2. A hardware interrupt 5 also can be invoked to perform a CGA screen
	   dump to a graphics printer from a Microsoft BASIC program run on an
	   IBM PC. To perform the screen dump, do the following:
	
	   a. Run the GRAPHICS.COM program provided with the DOS disk (run
	      GRAPHICS.COM only once per boot session).
	
	   b. Once GRAPHICS.COM is resident in memory, using SHIFT+PRINT
	      SCREEN or hardware interrupt 5 will print screens displayed by
	      the IBM CGA card. In versions of MS-DOS earlier than 4.00, the
	      IBM GRAPHICS.COM program does not support the printing of EGA or
	      VGA screens, and only BASIC SCREENs 0, 1, and 2 can be printed.
	
	The following program, DUMP.BAS, shows the preferred method to CALL
	hardware interrupt 5 to perform a screen dump (this program can be
	compiled in QuickBASIC 4.00, 4.00b, or 4.50; in BASIC compiler 6.00 or
	6.00b; or in BASIC PDS 7.00 or 7.10 for MS-DOS):
	
	   ' Dump.Bas
	   TYPE Regtype
	     AX AS INTEGER
	     BX AS INTEGER
	     CX AS INTEGER
	     DX AS INTEGER
	     BP AS INTEGER
	     SI AS INTEGER
	     DI AS INTEGER
	     FLAGS AS INTEGER
	     DS AS INTEGER
	     ES AS INTEGER
	   END TYPE
	   DIM inary AS RegType
	   DIM outary AS RegType
	   CLS
	   SCREEN 1
	   PRINT "This goes to the printer"
	   LINE (1,1)-(100,100)
	   CALL interrupt (&H5, inary, outary)      ' Performs screen dump
	
	The program below, DUMP2.BAS, can be used with Microsoft QuickBASIC
	versions 2.00, 2.01, and 3.00 if you change CALL INT86OLD to CALL
	INT86. Otherwise, if you don't change CALL INT86OLD to CALL INT86,
	this program can be compiled as is in QuickBASIC 4.00, 4.00b, or 4.50;
	in BASIC compiler 6.00 or 6.00b; or in BASIC PDS 7.00 or 7.10:
	
	   ' DUMP2.BAS
	   DIM inary%(7), outary%(7)
	   SCREEN 1
	   PRINT "This goes to the printer"
	   LINE (1,1)-(100,100)
	   CALL int86old ( &H5, VARPTR(inary%(0)), VARPTR(outary%(0)) )
	
	   ' The following syntax, which leaves out the VARPTR function,
	   ' is also supported in QuickBASIC 4.00, 4.00b, 4.50, in BASIC
	   ' compiler 6.00 and 6.00b, and in BASIC PDS 7.00 and 7.10:
	   '         CALL int86old ( &H5, inary%(), outary%() )
	   ' This INT86OLD syntax is given on Pages 86-88 of the "QuickBASIC
	   ' 4.0: Language Reference" for 4.00 and 4.00b and on Pages 86-88 of
	   '"BASIC Compiler 6.0: Language Reference" for 6.00 and 6.00b.
	
	   'NOTE: The following syntax is ILLEGAL for CALL INT86 in
	   'QuickBASIC 2.00, 2.01, or 3.00:
	   '           CALL int86 ( &H5, inary%(), outary%() )
	
	To run the above DUMP.BAS or DUMP2.BAS program within the QB.EXE
	version 4.00, 4.00b, or 4.50 editor (or within QB.EXE from BASIC
	compiler 6.00 or 6.00b), you must invoke the editor with the QB.QLB
	Quick library, as follows:
	
	   QB DUMP.BAS /L QB.QLB
	
	To make an EXE program from one of the above programs, you must LINK
	with QB.LIB as follows:
	
	   BC DUMP.BAS;
	   LINK DUMP.OBJ,DUMP.EXE,,QB.LIB;
	
	The above LINK creates DUMP.EXE, which is a program that can be
	executed from DOS by typing "DUMP".
	
	For BASIC PDS version 7.00 or 7.10, you must use QBX.EXE, QBX.QLB, and
	QBX.LIB (instead of QB.EXE, QB.QLB, and QB.LIB) in the above steps.
	
	DUMP.BAS cannot run in QuickBASIC version 2.00, 2.01, or 3.00;
	instead, you must use DUMP2.BAS. To run DUMP2.BAS in QB.EXE version
	2.00, 2.01, or 3.00, do the following:
	
	1. Make a USERLIB.EXE that contains INT86, as follows:
	
	   a. In version 2.00 or 2.01, type the following at the DOS command
	      line:
	
	         BUILDLIB USERLIB.OBJ,userlib.EXE;
	
	   b. In version 3.00, type the following at the DOS command line:
	
	         BUILDLIB INT86.OBJ,userlib.EXE;
	
	2. Run GRAPHICS.COM (only once per boot session) if you will be
	   printing graphics.
	
	3. Invoke QB.EXE as follows:
	
	      QB DUMP2.BAS /L userlib.EXE
	
	4. Change INT86OLD to INT86 in DUMP2.BAS (since there is no INT86OLD
	   in version 2.00, 2.01, or 3.00).
	
	5. Press CTRL+R to run the program in QB.EXE.
	
	To make DUMP2.BAS into DUMP2.EXE using QuickBASIC version 2.00, 2.01,
	or 3.00, do the following:
	
	1. Do ONE of the following:
	
	   a. Create DUMP2.OBJ using the Compile command from the Run menu in
	      the QB.EXE editor.
	
	   b. You can also create DUMP2.OBJ using the separate compilation
	      method, where you must end the QB command line with a semicolon
	      (;), as follows:
	
	         QB DUMP2;
	
	2. Do one of the following, depending on which version of QuickBASIC
	   you are using:
	
	   a. In 2.00 or 2.01, type the following at the DOS command line:
	
	         LINK DUMP2+USERLIB.OBJ;
	
	   b. In 3.00, type the following at the DOS command line:
	
	         LINK DUMP2+INT86.OBJ;
	
	Printing Hercules Screen Mode 3
	-------------------------------
	
	Understanding how to print graphics screens generated by Hercules and
	Hercules-compatible graphics adapters requires familiarity with how
	Hercules graphics memory is set up.
	
	Hercules memory starts at hex-paragraph B000 (decimal 45056). Graphics
	memory starts with Page 0 at hex-paragraph B000 (decimal 45056), and
	Page 1 at hex-paragraph B800 (decimal 47104). (Paragraphs mark
	segment boundaries, and there are 16 bytes per paragraph.)
	
	However, graphics memory is interleaved, and is not contiguous. Each
	line of pixels in SCREEN mode 3 consists of 90 bytes. Thus, the top
	line of pixels (line 0) on Page 0 will start at hex-paragraph B000 at
	offset 0 and go for 90 bytes.
	
	To draw a line of pixels at the top of the screen (in line 0 of Page
	0), POKE 255 into positions 0 through 89 (where 255 means all 8 bits
	per byte being "on"), as follows:
	
	   SCREEN 3
	   DEF SEG = &HB000
	   FOR x = 0 TO 89    ' B000:0000 hex to B000:0059 hex (in
	      POKE x, 255     ' segment:offset notation)
	   NEXT x
	
	To perform this procedure on Page 1, change the value of the DEF SEG
	statement to hex-paragraph &HB800.
	
	Because graphics memory is interleaved and not contiguous, if you
	continue to POKE at an offset 90 bytes after hex-paragraph B000, the
	next line will appear on the screen at the fourth line down. To draw a
	line just one line down (on line 1), add 2000 Hex (8192 decimal) to
	the offset of the first byte on line 0, then POKE as follows:
	
	   DEF SEG = &HB000
	   FOR x = 8192 TO 8281     ' or B000:2000 hex to B000:2059 hex (in
	      POKE x, 255           ' segment:offset notation)
	   NEXT x
	
	This procedure must also be performed for line 2 and line 3. (Note
	that line numbering starts at 0.) As a result, the first byte of line
	2 will be B000:4000 hex, and the first byte of line 3 will be
	B000:6000 hex. The interleaving cycles every four lines, thus the first
	byte of line 4 will be B000:005A hex (45056:0090 decimal), and
	subsequent lines will follow the previous pattern, at offset intervals
	of 2000 hex (8192 decimal).
	
	The following diagram shows how the scan lines relate to the
	interleaved video buffer:
	
	               Video Buffer                    Display
	
	      B000:0000 +---------+                       +-------------
	                |         |<----------Scan Line 0 | ............
	           005A |---------|       +---Scan Line 1 | ............
	                |         |<---+  |  *Scan Line 2 | ............
	           00B4 |---------|    |  |  *Scan Line 3 | ............
	                .         .    +------Scan Line 4 | ............
	                .         .       |               |
	      B000:2000 |---------|       |
	                |         |<------+
	           205A |---------|          * NOTE:
	                .         .            Scan line 2 is at B000:4000 hex
	                .         .            Scan line 3 is at B000:6000 hex
	
	This same interleaving is used in video Page 1, which begins at hex-
	paragraph B800. Please see the figure on Page 89 of the "Programmer's
	Guide to PC and PS/2 Video Systems" for a more complete diagram of the
	display memory for Hercules graphics mode.
	
	The following subprogram prints SCREEN Page 0 of a Hercules graphics
	screen to an Epson or Epson-compatible printer. To print SCREEN Page
	1, use a DEF SEG = &HB800 statement (instead of &HB000 for Page 0).
	
	   DECLARE SUB HerculesPrintScreen ()
	   ' Before using Hercules SCREEN 3, you must run QBHERC.COM (included
	   ' with QuickBASIC 4.00 or 4.00b, and BASIC compiler 6.00 or 6.00b)
	   ' or MSHERC.COM (included with QuickBASIC 4.50).
	   SCREEN 3
	   ' Put your screen graphics commands here - and take out commands
	   ' between these markers:
	   ' --------------------------------------------------------------
	     FOR i% = 1 TO 719 STEP 10
	       LINE (1, 1)-(i%, 348)
	       LINE (1, 348)-(i%, 1)
	     NEXT i%
	   ' --------------------------------------------------------------
	   CALL HerculesPrintScreen
	
	   SUB HerculesPrintScreen STATIC
	      DEF SEG = &HB000  'Set segment to SCREEN 3, video Page 0
	      OPEN "LPT1" FOR BINARY AS #1  'Open printer port in binary mode
	      WIDTH #1, 255                 'Set print width to 256 bytes wide
	      adv872$ = CHR$(27) + "A" + CHR$(8)
	      dots408$ = CHR$(27) + "K" + CHR$(92) + CHR$(1)
	      linefeed$ = CHR$(10)
	
	      PUT #1, , adv872$        'Set printer linefeed to 8/72"
	      FOR x = 0 TO 89
	         PUT #1, , dots408$    'Set printer for bit image graphic mode
	         FOR y = 7740 + x TO x STEP -90
	            FOR z = 24576 + y TO y STEP -8192
	               image$ = CHR$(PEEK(z))
	               PUT #1, , image$  'Send bit-image graphics to printer
	            NEXT z
	         NEXT y
	         PUT #1, , linefeed$   'Send a linefeed to the printer
	      NEXT x
	
	      ResetPrn$ = CHR$(27) + "@"
	      PUT #1, , ResetPrn$      'Reset the printer to default settings
	      CLOSE #1
	   END SUB
	
	Printing EGA or VGA Screen Modes 7 Through 12
	---------------------------------------------
	
	Because EGA and VGA memory are stored in contiguous blocks per
	"plane," printing the screen to a printer can be a fairly simple
	operation. The method used in the program below prints the image
	sideways, which avoids the need to do any bit-shifting and uses a
	simple two-dots-per-pixel shading pattern to represent different
	colors.
	
	To produce different patterns for different colors, each color plane
	must be analyzed. In SCREEN modes with four video planes (7, 8, 9, and
	12), each of the four different base EGA/VGA colors --  blue, green,
	red, and intensity -- is represented in a separate memory bank or
	plane of EGA/VGA memory. Each bit in a color plane represents a pixel
	on the screen; thus, each pixel on the screen has a color attribute
	depicted by four bits, one in each color plane.
	
	Each plane is addressed for reading/writing by selecting the bank of
	memory to access with an OUT instruction. This program logically OR's
	the blue and red planes together and does the same with the green and
	intensity planes. This effectively reduces the number of pattern
	(color) combinations from 16 to 4. Therefore, some colors that appear
	to be different on the screen have the same appearance on paper.
	
	SCREEN modes 10 and 11 are almost identical, except that there are
	only two color planes; thus, each pixel on the screen has a color
	attribute depicted by two bits, one in each of the two color planes.
	Because there are only two bits per pixel and two pins are being
	fired, no OR'ing of the color planes needs to be done.
	
	The Epson printer can fire up to eight pins per graphics byte sent.
	Thus, moving from left to right, a loop that reads screen data from
	the bottom of the screen upward can access eight vertical columns at a
	time. This behavior coincides with the printer firing eight pins at a
	time and creates eight horizontal columns on the page, turning the
	printout sideways.
	
	   DECLARE SUB ScreenParams (scrn%, ScreenWidth%, ScreenLength%, NP%)
	   DECLARE SUB DRAWPIC (scrn%)
	   DECLARE SUB VGAtoEpson (scrn%, f$, flip%, border%)
	   ' Demonstrates the use of VGAtoEpson, a subprogram that dumps
	   ' a SCREEN 7, 8, 9, 10, 11 or 12 image to an Epson printer.
	
	   CLS : scrn% = 0
	   WHILE (scrn% < 7) OR (scrn% > 12)
	      INPUT "Enter Screen Mode: (7, 8, 9, 10, 11 or 12)"; scrn%
	   WEND
	
	   SCREEN scrn% : CALL DRAWPIC(scrn%)      ' Draw the picture
	   CALL VGAtoEpson(scrn%, "LPT1", 0, 255)  ' Do the VGA screen print
	   END
	
	   SUB DRAWPIC (scrn%)                     ' Draw picture on screen
	     CALL ScreenParams(scrn%, ScreenWidth%, ScreenLength%, NumPlanes%)
	     IF NumPlanes% = 2 THEN ci% = 0 ELSE ci% = 1  ' Color increment
	     xmax% = ScreenWidth% : ymax% = ScreenLength%
	     halfx% = xmax% / 2 : halfy% = ymax% / 2
	     x% = halfx% : c% = 1
	      FOR y% = ymax% TO halfy% STEP -5
	         deltax% = xmax% - x% : deltay% = ymax% - y%
	         LINE (halfx%, y%)-(x%, halfy%), c%
	         LINE (x%, ymax%)-(xmax%, y%), c% + ci%
	         LINE (halfx%, deltay%)-(x%, halfy%), c% + 2 * ci%
	         LINE (x%, 0)-(xmax%, deltay%), c% + 3 * ci%
	         LINE (halfx% + 1, y%)-(deltax%, halfy%), c% + 4 * ci%
	         LINE (deltax%, ymax%)-(0, y%), c% + 5 * ci%
	         LINE (halfx%, deltay%)-(deltax%, halfy% + 1), c% + 6 * ci%
	         LINE (deltax%, 0)-(0, deltay%), c% + 7 * ci%
	         x% = x% + (((xmax% + 1) / (ymax% + 1)) * 5)
	      NEXT y%
	   END SUB
	
	   SUB ScreenParams (scrn%, ScreenWidth%, ScreenLength%, NumPlanes%)
	     ' Return the screen dimensions in pixels
	     ' and the number of planes.
	     NumPlanes% = 4          ' Set default values for SCREEN 12
	     ScreenWidth% = 640 : ScreenLength% = 480
	     SELECT CASE scrn%       ' Change values for other SCREEN modes
	        CASE 7
	           ScreenWidth% = 320 : ScreenLength% = 200
	        CASE 8
	           ScreenLength% = 200
	        CASE 9
	           ScreenLength% = 350
	        CASE 10
	           NumPlanes% = 2 : ScreenLength% = 350
	        CASE 11
	           NumPlanes% = 2
	     END SELECT
	   END SUB
	
	   SUB VGAtoEpson (scrn%, fileN$, flip%, border%) STATIC
	   ' Sends the image on SCREEN 7, 8, 9, 10, 11 or 12
	   ' to an Epson printer.
	   ' Parameters:
	   '    scrn%   - SCREEN video mode of screen to print (7 through 12)
	   '    fileN$  - Name of file or device to send image to
	   '    flip%   - Invert flag (0 = normal, not 0 = invert)
	   '    border% - Character to use for border drawing on screens
	   '              9 and 10 (0 = none, 255 = solid, etc.)
	     OPEN fileN$ FOR BINARY AS 1            'Open the output file
	     WIDTH #1, 255
	     esc$ = CHR$(27) : crlf$ = CHR$(13) + CHR$(10)
	     line$ = esc$ + "A" + CHR$(8)           'Set printer to 8/72 lpi"
	     PUT #1, , line$
	     CALL ScreenParams(scrn%, ScreenWidth%, ScreenLength%, NumPlanes%)
	
	     IF ScreenLength% < 480 THEN       ' Figure how many bytes to send
	        numbyte% = ScreenLength% * 2 + 16   ' to printer for one
	        maxy% = ScreenLength% - 1           '  line of graphics.
	     ELSE
	        numbyte% = 960 : maxy% = 479
	     END IF
	
	     DEF SEG = &HA000               'Start of EGA/VGA screen memory
	     BorderOffset% = (960 - numbyte%) / (2 * 8)
	     IF ScreenLength% < 480 THEN
	        ' Print top line for border on screens where border will fit
	        line$ = SPACE$(BorderOffset%)           '(for margin)
	        PUT #1, , line$
	        line$ = esc$ + "L" + MKI$(numbyte%)
	        line$ = line$ + STRING$(numbyte%, border%) + crlf$
	        PUT #1, , line$
	     END IF
	
	     ' This loop is the horizontal byte location
	     colend% = (ScreenWidth% / 8) - 1
	     FOR col% = 0 TO colend%
	       ' Set the printer up to receive 716 or 960 bytes
	       ' of graphics data
	       IF ScreenLength% < 480 THEN
	          line$ = SPACE$(BorderOffset%)
	          PUT #1, , line$  '(for border)
	       END IF
	
	       line$ = esc$ + "L" + MKI$(numbyte%)  '(for init)
	       PUT #1, , line$
	       IF ScreenLength% < 480 THEN
	          line$ = STRING$(8, border%)
	          PUT #1, , line$    '(for border)
	       END IF
	
	       '--- This loop is the vertical byte position
	       FOR row% = maxy% TO 0 STEP -1
	         ' For 4 plane screens (7, 8, 9 and 12) logically OR the blue
	         ' plane with the red plane, send that byte, then OR the green
	         ' plane with the intensity plane and send that byte.
	
	         ' For screens 10 and 11, the video planes are sent directly
	         ' to the printer.
	         FOR plane% = 0 TO 1                'Plane (* 2) set
	           OUT &H3CE, 4 : OUT &H3CF, plane%
	           place& = row%                   'Figure out screen memory
	           place& = place& * (colend% + 1) ' location to read - use
	           place& = place& + col%          ' a long to avoid overflow.
	           mem% = PEEK(place&)
	
	           IF NumPlanes% = 4 THEN ' OR color planes together
	              OUT &H3CE, 4 : OUT &H3CF, plane% + 2
	              mem% = mem% OR PEEK(place&)
	           END IF
	
	           '--- Flip the byte if need be (inverses printed picture)
	           IF flip% <> 0 THEN mem% = 255 - mem%
	           line$ = CHR$(mem%) : PUT #1, , line$
	         NEXT plane%
	       NEXT row%
	
	       line$ = crlf$    ' Default for no border
	       IF ScreenLength% < 480 THEN
	          line$ = STRING$(8, border%) + crlf$   ' Righthand border
	       END IF
	       PUT #1, , line$
	     NEXT col%
	
	     IF ScreenLength% < 480 THEN     '--- Print bottom line for border
	        line$ = SPACE$(BorderOffset%)       '(for margin)
	        PUT #1, , line$
	        line$ = esc$ + "L" + MKI$(numbyte%)
	        line$ = line$ + STRING$(numbyte%, border%) + crlf$
	        PUT #1, , line$
	     END IF
	     ResetPrn$ = esc$ + "@"
	     PUT #1, , ResetPrn$                 ' Reset printer
	     line$ = CHR$(12) : PUT #1, , line$  ' Send formfeed (page eject)
	     CLOSE 1                             ' All done
	   END SUB
	
	Printing VGA Screen Mode 13
	---------------------------
	
	Printing SCREEN mode 13 can also be fairly simple. The method used in
	the program below prints the image sideways, which avoids the need to
	do any bit-shifting and uses a simple eight-dots-per-pixel shading
	pattern to represent different colors.
	
	To produce different patterns for different colors, each byte of pixel
	information must be analyzed. In SCREEN 13, each pixel is represented
	by 1 contiguous byte of information, thus allowing 256 colors per
	pixel. Since 8 printer pins are fired for each pixel, a direct mapping
	of the pixel byte to the printer pins to be fired is done.
	
	As stated before, 8 pins are fired for each pixel; the pins are fired
	in a 2 by 4 pattern. Since this is not square, some slight image
	distortion does occur.
	
	The Epson printer can fire up to eight pins per graphics byte sent.
	Thus, moving from left to right, a loop that reads screen data from
	the bottom of the screen upward can access eight vertical columns at a
	time. This behavior coincides with the printer firing eight pins at a
	time and creates eight horizontal columns on the page, turning the
	printout sideways.
	
	   DECLARE SUB VGAtoEpson (f$, flip%)
	
	   '--- VGAEPSON.BAS
	   '--- Demonstrates the use of VGAtoEpson, a subprogram that
	   '--- dumps a SCREEN 13 image to an Epson printer.
	   '--- Copyright (c) 1988 Microsoft Corp.
	   REM $INCLUDE: 'QB.BI'
	
	   DIM SHARED inregs AS regtype
	   DIM SHARED outregs AS regtype
	
	   SCREEN 13
	   '--- Draw picture on screen
	   xmax% = 319
	   ymax% = 199
	   halfx% = xmax% / 2
	   halfy% = ymax% / 2
	   x% = halfx%
	   c% = 1
	   FOR y% = ymax% TO halfy% STEP -2
	     LINE (halfx%, y%)-(x%, halfy%), c%
	     LINE (x%, ymax%)-(xmax%, y%), c% + 20
	     LINE (halfx%, (ymax% - y%))-(x%, halfy%), c% + 40
	     LINE (x%, 0)-(xmax%, (ymax% - y%)), c% + 60
	     LINE (halfx% + 1, y%)-((xmax% - x%), halfy%), c% + 80
	     LINE ((xmax% - x%), ymax%)-(0, y%), c% + 100
	     LINE (halfx%, (ymax% - y%))-((xmax% - x%), halfy% + 1), c% + 120
	     LINE ((xmax% - x%), 0)-(0, (ymax% - y%)), c% + 140
	     x% = x% + (((xmax% + 1) / (ymax% + 1)) * 5)
	     c% = c% + 1
	   NEXT y%
	
	   CALL VGAtoEpson("LPT1", 1)
	   SCREEN 0
	   END
	
	   SUB VGAtoEpson (f$, flip%) STATIC
	   '--- Sends the image on SCREEN 13 to an Epson graphics printer
	   '--- Parameters:
	   '         f$    -   Name of file or device to send image to
	   '         flip% -   Invert flag (0 = normal, not 0 = invert)
	
	     OPEN f$ FOR BINARY AS 1         'Open the output file
	     WIDTH #1, 255
	     esc$ = CHR$(27)
	     line$ = esc$ + "A" + CHR$(8)
	     PUT #1, , line$   'set printer to 8/72 lpi
	     DEF SEG = &HA000                'Start of VGA screen memory
	     '--- This loop is the horizontal byte location
	     FOR Col% = 0 TO 79
	        '--- Set the printer to receive 800 bytes of graphics data
	        line$ = esc$ + "L" + MKI$(800)
	        PUT #1, , line$  '(for init)
	
	        '--- This loop is the vertical byte position
	        FOR row% = 199 TO 0 STEP -1
	
	           place& = row% * 320&
	           place& = place& + Col% * 4
	           ' 4 bytes of pixel information are read in. Each
	           '  of these bytes is broken up across 4 variables
	           '  that are used to fire the printer pins. 2 bits
	           '  from each pixel byte are stored to each of the
	           '  variables.
	           mem1% = 0           ' Initialize storage bytes for
	           mem2% = 0           '   color information.
	           mem3% = 0
	           mem4% = 0
	           FOR byte% = 0 TO 3
	              newplace& = place& + byte%
	              shift% = 2 ^ ((7 - 2 * byte%) - 1)
	              mem% = PEEK(newplace&)
	              mem% = mem% AND 3
	              mem% = mem% * shift%
	              mem1% = mem1% OR mem%
	
	              mem% = PEEK(newplace&)
	              mem% = (mem% AND 12) / 4
	              mem% = mem% * shift%
	              mem2% = mem2% OR mem%
	
	              mem% = PEEK(newplace&)
	              mem% = (mem% AND 48) / 16
	              mem% = mem% * shift%
	              mem3% = mem3% OR mem%
	
	              mem% = PEEK(newplace&)
	              mem% = (mem% AND 192) / 64
	              mem% = mem% * shift%
	              mem4% = mem4% OR mem%
	           NEXT
	
	           '--- Flip the byte, if called from
	           IF flip% <> 0 THEN
	              mem1% = 255 - mem1%
	              mem2% = 255 - mem2%
	              mem3% = 255 - mem3%
	              mem4% = 255 - mem4%
	           END IF
	
	           '--- Send bytes to device
	           line$ = CHR$(mem1%) + CHR$(mem2%)
	
	           line$ = line$ + CHR$(mem3%) + CHR$(mem4%)
	           PUT #1, , line$
	        NEXT
	        line$ = CHR$(13) + CHR$(10)
	        PUT #1, , line$
	     NEXT
	     ResetPrn$ = esc$ + "@"
	     PUT #1, , ResetPrn$  ' Reset printer
	     line$ = CHR$(12)
	     PUT #1, , line$      ' Send formfeed (page eject)
	     CLOSE 1              ' All done
	   END SUB
