---
layout: page
title: "Q51859: How to Print Images on SCREENs 7 Through 12 to Epson Printer"
permalink: /pubs/pc/reference/microsoft/kb/Q51859/
---

## Q51859: How to Print Images on SCREENs 7 Through 12 to Epson Printer

	Article: Q51859
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom appnote BQ0085
	Last Modified: 18-OCT-1990
	
	The program listing below demonstrates one method of printing an EGA
	or VGA SCREEN 7, 8, 9, 10, 11, or 12 image to an Epson printer (or
	compatible) with graphics capability.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS; and to Microsoft BASIC PDS (Professional Development
	System) versions 7.00 and 7.10 for MS-DOS. (Earlier versions do not
	support VGA SCREEN 12.)
	
	This article is one part of the application note titled "How to Print
	BASIC Video Screens to Epson Printers." A printed copy of this
	application note can be obtained by calling Microsoft Product Support
	Services at (206) 637-7096. This application note can also be obtained
	in separate parts in this Knowledge Base by searching for the
	following words:
	
	   Epson and print and screen and QuickBASIC
	
	If you have a printer other than an Epson, you must change the printer
	control codes used in the following program for setting line spacing
	and graphics mode. Control codes can be found in your printer's
	manual.
	
	The routine below for printing EGA and VGA SCREEN modes 7 through 12
	is required only if you aren't running under MS-DOS version 4.00 or
	later. In MS-DOS 4.00 and later, the program GRAPHICS.COM supports all
	standard EGA and VGA SCREEN modes. Thus, the routine given in a
	separate article (part of the same application note) for printing CGA
	SCREEN modes can be used to print EGA and VGA SCREENs in MS-DOS 4.00
	and later.
	
	If you want further information about graphics memory and the various
	graphics modes, please refer to the following book, which is available
	in bookstores or by calling Microsoft Press at (800) 888-3303 or (206)
	882-8661:
	
	    "Programmer's Guide to PC and PS/2 Video Systems," by Richard
	    Wilton (published by Microsoft Press, 1987)
	
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
