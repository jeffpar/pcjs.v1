---
layout: page
title: "Q51860: How to Print VGA SCREEN 13 Image to Epson Printer"
permalink: /pubs/pc/reference/microsoft/kb/Q51860/
---

## Q51860: How to Print VGA SCREEN 13 Image to Epson Printer

	Article: Q51860
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom appnote BQ0085 SR# S891207-106
	Last Modified: 18-OCT-1990
	
	The program listing below demonstrates one method of printing VGA
	SCREEN 13 images to an Epson (or compatible) printer with graphics
	capability.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS, and to Microsoft BASIC PDS (Professional Development
	System) versions 7.00 and 7.10 for MS-DOS. (Earlier versions do not
	support VGA SCREEN 13.)
	
	This article is one part of the application note titled "How to Print
	BASIC Video Screens to Epson Printers." A printed copy of this
	application note can be obtained by calling Microsoft Product Support
	Services at (206) 637-7096. This application note can also be obtained
	in separate parts in this Knowledge Base by searching for the
	following words:
	
	   Epson and print and screen and QuickBASIC
	
	If you have a printer other than an Epson-compatible, you must change
	the printer control codes used in the following program for setting
	line spacing and graphics mode. Control codes can be found in your
	printer's manual.
	
	The routine below for printing VGA SCREEN mode 13 is required only if
	you aren't running under MS-DOS versions 4.00 or later. In MS-DOS 4.00
	and later, the program GRAPHICS.COM supports all standard EGA and VGA
	SCREEN modes. Thus, the routine given in a separate article (part of
	this application note) for printing CGA SCREEN modes can be used to
	print EGA and VGA SCREENs in MS-DOS 4.00 and later.
	
	If you want further information about graphics memory and the various
	graphics modes, please refer to the following book, which is available
	in bookstores or by calling Microsoft Press at (800) 888-3303 or (206)
	882-8661:
	
	    "Programmer's Guide to PC and PS/2 Video Systems," by Richard
	    Wilton (published by Microsoft Press, 1987)
	
	Printing VGA Screen Mode 13
	---------------------------
	
	The method used in the program below prints the image sideways, which
	avoids the need to do any bit-shifting and uses a simple
	eight-dots-per-pixel shading pattern to represent different colors.
	
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
