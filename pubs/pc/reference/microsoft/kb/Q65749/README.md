---
layout: page
title: "Q65749: How to BSAVE and BLOAD Multiple Screen Pages in SCREEN 0"
permalink: /pubs/pc/reference/microsoft/kb/Q65749/
---

## Q65749: How to BSAVE and BLOAD Multiple Screen Pages in SCREEN 0

	Article: Q65749
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900817-137 B_BasicCom docerr
	Last Modified: 21-SEP-1990
	
	The graphics GET and PUT statements cannot be used to store or draw
	text screens in SCREEN mode 0 (zero). Therefore, it is necessary to go
	directly to video memory, using the BSAVE and BLOAD statements, in
	order to store and draw text mode (SCREEN 0) screens. This article
	gives an explanation and an example of BSAVEing and BLOADing all eight
	of the text mode SCREEN pages available on 256K EGA and VGA graphics
	adapters. The code can be easily adapted for the number of video pages
	supported by any adapter.
	
	This information applies to Microsoft QuickBASIC versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS; to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS; and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS.
	
	In text mode, the video pages, sometimes called video buffers, are
	stored starting at address B800:0000 hex, where the portion before the
	colon is the segment and the portion after is the offset. Each video
	page buffer starts on a 4K boundary (or every &H1000 bytes = 1000 hex
	= 4096 decimal). Therefore, saving video pages is a straightforward
	process of changing to segment &HB800, starting at an offset of n*4096
	(&H1000) bytes for each nth page, and BSAVEing 4K of memory to a file.
	Note that you count pages from 0. Therefore, page 0 is at offset 0 *
	4096, or offset 0, from segment B800 hex, so you start saving at
	address B800:0000. To change the segment pointer used by the BSAVE
	statement in BASIC, use the DEF SEG statement. Because the BSAVE
	statement has an "offset" parameter, it is simple to save multiple
	pages by changing the offset parameter in the BSAVE statement with the
	formula PageN%*4096, where PageN% is the current page (counting from
	zero) being saved.
	
	For more information about graphics programming and video page
	buffers, see Chapter 3 of "Programmer's Guide to PC and PS/2 Video
	Systems" by Richard Wilton (Microsoft Press, 1987).
	
	Documentation Error
	-------------------
	
	Wilton's book (mentioned above) contains a documentation error on Page
	75 when discussing video pages. It incorrectly states the following:
	
	   ...each page starts on a 1 KB (1024-byte) boundary
	
	This should be corrected to say:
	
	   ...each page starts on a 4 KB (4096-byte) boundary.
	
	Note that Wilton's book uses "KB" as an abbreviation for kilobyte
	(1024 bytes), whereas this Knowledge Base uses "K".
	
	The next sentence in Wilton's book correctly states the following:
	
	   The four 80-by-25 pages thus start at B800:0000, B800:1000,
	   B800:2000, and B800:3000.
	
	Code Example
	------------
	
	The SLEEP statement in the following program should be replaced with
	the statement INPUT X$ in order to run in QuickBASIC 2.00, 2.01, 3.00,
	or 4.00. (The SLEEP statement was first introduced in QuickBASIC 4.00b
	and BASIC compiler 6.00.)
	
	FOR i% = 0 TO 7 ' If your EGA only supports 4 pages, use 3, not 7.
	  SCREEN 0, 0, i%, i% ' Initialize each screen page.
	  CLS
	NEXT
	
	FOR i% = 0 TO 7 ' If your EGA only supports 4 pages, use 3, not 7.
	   SCREEN 0, , i%, i% ' Cycle through the pages and write chars.
	   FOR j% = 1 TO 2000
	     PRINT CHR$(i% + 127); ' Print some colorful characters.
	     COLOR j% MOD 16
	   NEXT j%
	   filename$ = "page" + CHR$(i% + &H31) + ".pic"
	   DEF SEG = &HB800 ' Change segment to video memory.
	   BSAVE filename$, i% * &H1000, &H1000 ' Save the i%-th page.
	   DEF SEG ' Important: Move back to the default data segment!
	   LOCATE 10, 10: COLOR 23: PRINT "Hit any key for next page"
	   SLEEP
	NEXT
	
	WHILE INKEY$ <> "": WEND
	
	FOR i% = 0 TO 7 ' If your EGA only supports 4 pages, use 3, not 7.
	   SCREEN 0, 0, i%, i%
	   CLS
	   COLOR 7
	   PRINT "hit any key to restore page "; i%;
	   SLEEP: WHILE INKEY$ <> "": WEND
	   filename$ = "page" + CHR$(i% + &H31) + ".pic"
	   DEF SEG = &HB800
	   BLOAD filename$, i% * &H1000
	   DEF SEG
	   SLEEP
	NEXT i%
	
	SCREEN 0, 0, 0, 0 ' Clean up before ending
	KILL "page?.pic"  ' and kill the picture files.
	END
