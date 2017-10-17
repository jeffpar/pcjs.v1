---
layout: page
title: "Q65925: Using OS/2 API Calls for Keyboard Input from BASIC PDS"
permalink: /pubs/pc/reference/microsoft/kb/Q65925/
---

## Q65925: Using OS/2 API Calls for Keyboard Input from BASIC PDS

	Article: Q65925
	Version(s): 7.00 7.10
	Operating System: OS/2
	Flags: ENDUSER | SR# S900831-121
	Last Modified: 19-OCT-1990
	
	This article contains a sample BASIC module, which calls the OS/2 API
	functions to perform a simple keyboard input routine in protected
	mode.
	
	This information applies to Microsoft BASIC compiler versions 6.00 and
	6.00b for MS OS/2 (for protected mode only) and Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for MS
	OS/2 (for protected mode only).
	
	For more information on the OS/2 keyboard input functions, please
	refer to the "Microsoft OS/2 Programmer's Reference" Volume 3, Pages
	164-180, published by Microsoft Press (1989).
	
	OS/2 protected mode allows for multiple logical keyboard buffers to be
	set up and used by a process. When a logical keyboard buffer is
	opened, it does not receive any characters until that buffer is given
	the focus by the KbdGetFocus function. When a keyboard buffer has the
	focus, it receives all characters that are typed in through the
	keyboard.
	
	The largest string that can be typed in is determined by the buffer
	that the program sets up; in this example, the buffer is set to 40.
	Any extra characters are ignored until the BACKSPACE, DEL, or arrow
	keys are pressed.
	
	This sample program uses the KbdOpen and KbdGetFocus function to open
	a logical keyboard. It then uses the KbdGetStatus and KbdSetStatus
	functions to preserve the status of the keyboard and then to modify
	the status, forcing the CAPSLOCK key on. It also uses the
	VioSetCurType function to set the display of the cursor (by default
	there is no cursor).
	
	To run the program in OS/2 protected mode, the program should be
	compiled and linked as follows:
	
	     BC /Lp OS2KEY;
	     LINK OS2KEY,,,BRT71ENP.LIB+OS2.LIB;
	
	OS2KEY.BAS
	----------
	
	'This sample program OS2KEY.BAS uses OS/2 keyboard input routines.
	'Wait flags for keyboard input and status check:
	CONST IOWAIT     = 0
	CONST IONOWAIT   = 1
	'Constant declarations for KdbInfo.fsMask:
	CONST KEYBOARDECHOON            = &H0001
	CONST KEYBOARDECHOOFF           = &H0002
	CONST KEYBOARDBINARYMODE        = &H0004
	CONST KEYBOARDASCIIMODE         = &H0008
	CONST KEYBOARDMODIFYSTATE       = &H0010
	CONST KEYBOARDMODIFYINTERIM     = &H0020
	CONST KEYBOARDMODIFYTURNAROUND  = &H0040
	CONST KEYBOARD2BTURNAROUND      = &H0080
	CONST KEYBOARDSHIFTREPORT       = &H0100
	'Constant declarations for Keyboard flags:
	CONST RIGHTSHIFT    = &H0001
	CONST LEFTSHIFT     = &H0002
	CONST CONTROL       = &H0004
	CONST ALT           = &H0008
	CONST SCROLLLOCKON  = &H0010
	CONST NUMLOCKON     = &H0020
	CONST CAPSLOCKON    = &H0040
	CONST INSERTON      = &H0080
	CONST LEFTCONTROL   = &H0100
	CONST LEFTALT       = &H0200
	CONST RIGHTCONTROL  = &H0400
	CONST RIGHTALT      = &H0800
	CONST SCROLLLOCK    = &H1000
	CONST NUMLOCK       = &H2000
	CONST CAPSLOCK      = &H4000
	CONST SYSREQ        = &H8000
	TYPE KbdInfoType    'KbdInfo structure
	    cb           AS INTEGER
	    fsMask       AS INTEGER
	    chTurnAround AS INTEGER
	    fsInterim    AS INTEGER
	    fsState      AS INTEGER
	END TYPE
	TYPE StringInBufType    'StringInBuf structure
	    cb    AS INTEGER
	    cchIn AS INTEGER
	END TYPE
	TYPE StringBufType    'Fixed length string to receive input characters
	    Chars AS STRING * 40   'BASIC doesn't allow passing fixed length
	END TYPE                   'strings, so use a user-defined type of
	                           'a fixed length string.
	TYPE VioCursorInfoType   'Type that holds the cursor attributes
	    yStart AS INTEGER
	    cEnd   AS INTEGER
	    cx     AS INTEGER
	    attr   AS INTEGER
	END TYPE
	'The fundamental OS/2 Keyboard functions
	DECLARE FUNCTION KbdOpen% (SEG hkbd%)
	DECLARE FUNCTION KbdClose% (BYVAL hkbd%)
	DECLARE FUNCTION KbdGetStatus% (SEG KbdInfo AS KbdInfoType, BYVAL hkbd%)
	DECLARE FUNCTION KbdSetStatus% (SEG KbdInfo AS KbdInfoType, BYVAL hkbd%)
	DECLARE FUNCTION KbdGetFocus% (BYVAL fWait%, BYVAL hkbd%)
	DECLARE FUNCTION KbdFreeFocus% (BYVAL hkbd%)
	DECLARE FUNCTION KbdStringIn% (SEG chBuffer AS StringBufType, _
	        SEG StringInBuf AS StringInBufType, BYVAL fWait%, BYVAL hkbd%)
	DECLARE FUNCTION VioSetCurType% (SEG VioCursorInfo AS _
	                                 VioCursorInfoType, BYVAL hvio%)
	'Dimension the structured variables
	DIM KbdInfo AS KbdInfoType
	DIM PrevkbdInfo AS KbdInfoType
	DIM StringInBuf AS StringInBufType
	DIM chBuffer AS StringBufType
	DIM VioCursorInfo AS VioCursorInfoType
	CLS
	ReturnVal% = KbdOpen%(hkbd%)             'Open a logical Keyboard
	IF ReturnVal% = 0 THEN
	 PRINT "Opened logical keyboard"
	 PRINT "Getting the focus: ";
	 ReturnVal% = KbdGetFocus%(IONOWAIT, hkbd%)   'Make it the one to
	                                              'receive keyboard
	 IF ReturnVal% = 0 THEN                       'input
	    PRINT "we have the focus"
	    'Save the previous state of the keyboard, so it can be reset:
	    PRINT "Saving the previous state of the input mode"
	    PRINT "Getting the status and checking for echo mode, input mode"
	    PrevkbdInfo.cb = LEN(KbdInfo)
	    ReturnVal% = KbdGetStatus%(PrevkbdInfo, hkbd%)
	    IF RetrunVal% = 0 THEN
	      'Check echo mode:
	      IF (PrevkbdInfo.fsMask AND KEYBOARDECHOON) THEN
	       PRINT "Echo on, ";
	      ELSE
	       PRINT "Echo off, ";
	      END IF
	      'Check input mode:
	      IF (PrevkbdInfo.fsMask AND KEYBOARDASCIIMODE) THEN  '
	       PRINT "Ascii mode"
	      ELSE
	       PRINT "Binary Mode"
	      END IF
	      'Set the cursor type: size, and attribute:
	      VioCursorInfo.yStart = 12    'beginning scan line for cursor
	                                   'starting from top position
	      VioCursorInfo.cEnd = 13      'ending scan line, zero-based
	      VioCursorInfo.cx = 0         'default width, one character
	      VioCursorInfo.attr = 0       'normal attribute, &hffff is hidden
	      hvio% = 0                    'video handle
	      ReturnVal% = VioSetCurType%(VioCursorInfo, hvio%)
	      IF ReturnVal% = 0 THEN
	       PRINT "Cursor is the normal TWO scan lines tall"
	      END IF
	
	      'Initialize KbdInfo to the new status:
	      PRINT "Setting the CAPSLOCK on"
	      KbdInfo.cb = LEN(KbdInfo)
	      KbdInfo.chTurnAround = PrevkbdInfo.chTurnAround
	      KbdInfo.fsInterim = PrevkbdInfo.fsInterim
	      KbdInfo.fsMask = (PrevkbdInfo.fsMask OR _    'Turn on the modify
	                        KEYBOARDMODIFYSTATE)       'state
	      KbdInfo.fsState = (PrevkbdInfo.fsState OR _  'force caps lock on
	                         CAPSLOCKON)
	      ReturnVal% = KbdSetStatus%(KbdInfo, hkbd%)   'Set the status
	      IF ReturnVal% = 0 THEN
	       PRINT "Caps lock should be on"
	       PRINT "Input some characters: ";
	       StringInBuf.cb = LEN(chBuffer)
	       'Input the string:
	       RetrunVal% = KbdStringIn%(chBuffer, StringInBuf, IOWAIT, hkbd%)
	
	     'During input, OS/2 does not advance the cursor, to prevent
	     'writing over what was typed, use a LOCATE statement, or a double
	     'PRINT to advance the cursor position
	       PRINT : PRINT "This is what you typed: "; chBuffer.Chars
	       SLEEP (3)                       'Sleep for three seconds
	      ELSE
	       PRINT "Caps on failed"
	      END IF
	      'Start cleaning up, restore the status, free focus, and close
	      'keyboard:
	      PRINT "Restoring the status"
	      RetrunVal% = KbdSetStatus%(PrevKbdInfo, hkbd%)
	      IF RetrunVal% = 0 THEN
	       PRINT "Status Returned"
	      ELSE
	       PRINT "Status Could Not Be Restored
	      END IF
	
	      'Free the focus and close the logical keyboard
	      PRINT "Freeing the focus and closing keyboard"
	      ReturnVal% = KbdFreeFocus%(hkbd%)
	      IF ReturnVal% = 0 THEN
	       ReturnVal% = KbdClose%(hkbd%)
	       IF ReturnVal% = 0 THEN
	         PRINT "Keyboard closed"
	       ELSE
	         PRINT "Keyboard could not be closed, Error= "; ReturnVal%
	       END IF
	      ELSE
	       PRINT "Focus could not be freed: "; ReturnVal%
	      END IF
	    ELSE
	     PRINT "Get status failed: "; RetrunVal%
	    END IF
	 ELSE
	    PRINT "ERROR on Focus, ReturnVal% = "; ReturnVal%
	 END IF
	ELSE
	    PRINT "Logical keyboard could not be opened"
	END IF
	END
