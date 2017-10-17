---
layout: page
title: "Q35519: PCOPY &amp; Multiple Pages Not Supported in MS OS/2 Protected Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q35519/
---

## Q35519: PCOPY &amp; Multiple Pages Not Supported in MS OS/2 Protected Mode

	Article: Q35519
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# G880910-3123 docerr
	Last Modified: 2-FEB-1990
	
	Multiple video pages are not supported in the protected mode of MS
	OS/2. As stated on Page 40 of the "Microsoft BASIC Compiler 6.0:
	User's Guide" and on Page 522 of the "Microsoft BASIC 7.0:
	Programmer's Guide," the SCREEN function ignores the active and visual
	page parameters.
	
	Since multiple pages are not supported, the PCOPY function is not
	allowed in MS OS/2 protected mode. This fact needs to be added to the
	section on BASIC language changes for MS OS/2 protected mode.
	
	Through BASIC, there is no way to manipulate the video buffer directly
	in MS OS/2 protected mode. However, it can be done through the use of
	OS/2 API calls. The following API calls can be used to modify the
	video buffer:
	
	   VioGetBuf
	   VioShowBuf
	   VioGetPhysBuf
	   VioScrLock
	   VioScrUnLock
	
	The VioGetBuf function retrieves the address and length of the logical
	video buffer (LVB). The address of the buffer is returned in a long.
	The high 2 bytes are the segment and the low 2 bytes are the offset,
	as in the following example:
	
	   x = VioGetBuf(pointer, length, 0)
	   segment& = pointer / &H10000
	   offset& = pointer MOD &H10000
	
	To modify the buffer, change the segment to the segment value returned
	and use PEEK and POKE to read and modify the information. Once the
	information is changed, VioShowBuf is used to display the changes.
	
	The VioGetPhysBuf function retrieves the selector of the physical
	video buffer. The physical video buffer contains the current screen
	image. To modify the screen, change the segment to the selector
	returned and use PEEK and POKE to read and modify the screen. This
	method is faster than using VioGetBuf/VioShowBuf because you are
	directly modifying the screen.
	
	For more information about these VIO API calls, please refer to your
	OS/2 documentation. Listed below are two sample programs that use the
	methods discussed above.
	
	Code Examples
	-------------
	
	'The following program uses VioGetPhysBuf:
	DEFINT A-Z
	TYPE PhysBufData
	     bufstart AS LONG
	     buflength AS LONG
	     selector1 AS INTEGER
	     selector2 AS INTEGER
	END TYPE
	
	DECLARE FUNCTION VioGetBuf (_
	   SEG p1 AS LONG,_
	   SEG p2 AS INTEGER,_
	   BYVAL p3 AS INTEGER)
	
	DECLARE FUNCTION VioShowBuf (_
	   BYVAL p1 AS INTEGER,_
	   BYVAL p2 AS INTEGER,_
	   BYVAL p3 AS INTEGER)
	
	DECLARE FUNCTION VioGetPhysBuf (_
	   SEG p1 AS PhysBufData,_
	   BYVAL p2 AS INTEGER)
	
	DECLARE FUNCTION VioScrLock (_
	   BYVAL p1 AS INTEGER,_
	   SEG p2 AS INTEGER,_
	   BYVAL p3 AS INTEGER)
	
	DECLARE FUNCTION VioScrUnLock (_
	   BYVAL p1 AS INTEGER)
	
	CLS
	FOR i = 1 TO 10
	    PRINT "This is a test"
	NEXT i
	DIM stuff AS PhysBufData
	x = VioScrLock(1, status, 0)
	PRINT
	PRINT "Lock Status: "; status
	stuff.bufstart = &HB8000
	stuff.buflength = 43 * 80 * 2
	x = VioGetPhysBuf(stuff, 0)
	IF (x) THEN
	    PRINT "Error: "; x; " occurred."
	    END
	ELSE
	    PRINT
	    PRINT "Start: "; HEX$(stuff.bufstart)
	    PRINT "Length: "; stuff.buflength
	    PRINT "Selector1: "; stuff.selector1
	    PRINT "Selector2: "; stuff.selector2
	    PRINT
	    PRINT
	    PRINT "Enter a key to begin changing..."
	    WHILE INKEY$ = "": WEND
	    offset = 0
	    DEF SEG = stuff.selector1
	    FOR i = offset TO offset& + stuff.buflength - 1 STEP 2
	       POKE i, 65     'Character
	       POKE i + 1, &H17'Attribute
	    NEXT i
	    DEF SEG
	    x = VioScrUnLock(0)
	END IF
	PRINT "Enter a key to quit..."
	WHILE INKEY$ = "": WEND
	END
	
	'The following program uses VioGetBuf/VioShowBuf:
	DEFINT A-Z
	TYPE PhysBufData
	     bufstart AS LONG
	     buflength AS LONG
	     selector1 AS INTEGER
	     selector2 AS INTEGER
	END TYPE
	
	DECLARE FUNCTION VioGetBuf (_
	   SEG p1 AS LONG,_
	   SEG p2 AS INTEGER,_
	   BYVAL p3 AS INTEGER)
	
	DECLARE FUNCTION VioShowBuf (_
	   BYVAL p1 AS INTEGER,_
	   BYVAL p2 AS INTEGER,_
	   BYVAL p3 AS INTEGER)
	
	DECLARE FUNCTION VioGetPhysBuf (_
	   SEG p1 AS PhysBufData,_
	   BYVAL p2 AS INTEGER)
	
	DECLARE FUNCTION VioScrLock (_
	   BYVAL p1 AS INTEGER,_
	   SEG p2 AS INTEGER,_
	   BYVAL p3 AS INTEGER)
	
	DECLARE FUNCTION VioScrUnLock (_
	   BYVAL p1 AS INTEGER)
	
	CLS
	FOR i = 1 TO 10
	    PRINT "This is a test"
	NEXT i
	DIM pointer AS LONG
	DIM length AS INTEGER
	DIM handle AS INTEGER
	x = VioGetBuf(pointer, length, 0)
	segment& = pointer / &H10000
	offset& = pointer MOD &H10000
	IF (x) THEN
	    PRINT "Error: "; x; " occurred."
	    END
	ELSE
	    PRINT "POINTER = "; HEX$(pointer)
	    PRINT "LENGTH = "; length
	    PRINT
	    PRINT "SEGMENT = "; HEX$(segment&)
	    PRINT "OFFSET = "; HEX$(offset&)
	    PRINT
	    PRINT "Enter a key to begin changing the buffer..."
	    WHILE INKEY$ = "": WEND
	    CLS
	    DEF SEG = segment&
	    FOR i = offset TO offset& + length - 1 STEP 2
	      POKE i, 65     'Character
	      POKE i + 1, &H17'Attribute
	    NEXT i
	    DEF SEG
	    PRINT "Enter a key to see the changes..."
	    WHILE INKEY$ = "": WEND
	    x = VioShowBuf(0, length, 0)
	END IF
	PRINT "Enter a key to quit..."
	WHILE INKEY$ = "": WEND
	END
