---
layout: page
title: "Q30451: How to Print CGA SCREEN 0, 1, or 2 Image to Epson Printer"
permalink: /pubs/pc/reference/microsoft/kb/Q30451/
---

## Q30451: How to Print CGA SCREEN 0, 1, or 2 Image to Epson Printer

	Article: Q30451
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI appnote BQ0085
	Last Modified: 17-OCT-1990
	
	Below are two methods for making a screen dump of SCREEN 0, 1, or 2
	(CGA modes) to an Epson or Epson-compatible printer. These methods
	also support all standard EGA and VGA SCREEN modes (SCREENs 7 through
	13) if you are using the GRAPHICS.COM provided in MS-DOS 4.00 or
	later.
	
	The examples below apply to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b; and to
	Microsoft BASIC PDS (Professional Development System) versions 7.00
	and 7.10 for MS-DOS. The program DUMP2.BAS below can be used with
	Microsoft QuickBASIC versions 2.00, 2.01, and 3.00 if you change CALL
	INT86OLD to CALL INT86.
	
	This article is one part of the application note titled "How to Print
	BASIC Video Screens to Epson Printers." A printed copy of this
	application note can be obtained by calling Microsoft Product Support
	Services at (206) 637-7096. This application note can also be obtained
	in separate parts in this Knowledge Base by querying on the following
	words:
	
	   Epson and print and screen and QuickBASIC
	
	If you want further information about video graphics memory, please
	refer to the following book, which is available from bookstores or
	Microsoft Press by calling (800) 888-3303 or (206) 882-8661:
	
	   "Programmer's Guide to PC and PS/2 Video Systems," by Richard
	   Wilton (Microsoft Press, 1987)
	
	Printing CGA SCREEN Modes 0 Through 2
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
