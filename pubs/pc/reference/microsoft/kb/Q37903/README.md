---
layout: page
title: "Q37903: ON TIMER GOSUB; ON PLAY Time Increments Smaller Than 1 Second"
permalink: /pubs/pc/reference/microsoft/kb/Q37903/
---

## Q37903: ON TIMER GOSUB; ON PLAY Time Increments Smaller Than 1 Second

	Article: Q37903
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 19-OCT-1990
	
	The resolution of the ON TIMER (n) GOSUB statement is limited to
	increments of 1 second.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS, and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	One way to work around this limitation (to get a better timer-event
	resolution) is to use the ON PLAY statement, which can transfer
	control to a subroutine each time a musical note is played. With a
	fast tempo and very short notes, one can transfer control as much as
	30 times a second.
	
	The following are three separate methods to get a small time interval:
	
	1. Use BIOS INTERRUPT 15 Hex, with function 86 hex (or, in decimal,
	   INTERRUPT 21 with function 134) for a resolution at intervals of
	   976 microseconds (976 millionths or .000976 of a second).
	
	2. Use BIOS INTERRUPT 1A hex (26 decimal) with function 0 for a
	   resolution at about 18.20648 ticks per second (or .05492549
	   seconds).
	
	3. Use the ON PLAY statement for resolution at 30 times per second
	   (or .0333333).
	
	This article describes method 3 above. To find the two separate
	articles that explain methods 1 and 2, search in this Knowledge Base
	for the following exact words:
	
	   BASIC and timer and increments and smaller and second
	
	ON PLAY
	-------
	
	The MESSAGE.BAS listing shown below illustrates method 3, plus a
	method for producing smooth, pixel-based scrolling. Rather than using
	the PRINT statement, the bits for each character in the message are
	PEEKed from the ROM character table one column at a time.
	
	No music is actually played in this example because note zero is used,
	which means to pause with no sound.
	
	If 30 times per second is too fast, the speed may be varied either by
	adjusting the tempo or by using notes longer than the 64th note. Note
	that the PLAY command is again used "inside" the subroutine to prime
	the PLAY buffer and keep the process going. QuickBASIC doesn't allow
	you to use notes shorter in duration than a 32nd note. Notes shorter
	in duration than a 32nd note freeze the PC's system clock and the
	system time does not advance.
	
	This information is taken from Page 334 of "PC Magazine," Vol. 7,
	Number 17, October 11, 1988. The information comes from a letter sent
	to "PC Magazine" by James A. Parsly of Knoxville, Tennessee, and from
	an article written by Ethan Winer.
	
	The ON PLAY GOSUB statement is supported under MS-DOS, but NOT under
	MS OS/2 protected mode.
	
	The following is a code example:
	
	MESSAGE.BAS
	-----------
	
	DEFINT A-Z
	SCREEN 2
	'set up message and window location
	MESSAGE$ = "........The quick brown fox jumped over the lazy dog "
	LEFT = 220
	RIGHT = 420
	TOP = 8
	LETNUM = 0
	COLUMN = 8
	
	'draw box around window:
	LINE (LEFT - 2, TOP - 2)-(RIGHT + 2, TOP + 9), 1, B
	DIM BUFF(2 + INT((RIGHT - LEFT + 7) / 8) * 4)  'space for buffer.
	DEF SEG = &HF000   'segment of ROM characters.
	
	'To get a smooth crawl, we must use timed interrupts. However, ON
	'TIMER has a minimum interval of 1 second, which is not fast enough.
	'We are forced to use ON PLAY with a song consisting of a single rest.
	
	PLAY ON                                 'turn event ON
	PLAY "MB T130 L32 N0"                   'set up "song".
	ON PLAY(1) GOSUB MOVEIT                 'set up timed interrupt.
	
	'A foreground task can be executing here. In this case, the time of
	'day is printed on the screen.
	
	WHILE INKEY$ = ""
	      LOCATE 5, 37
	      PRINT TIME$
	WEND
	END
	
	'Interrupt handler for ON PLAY
	'
	'MOVEIT receives control at regular intervals through the ON PLAY
	'statement. It takes the current image in the window and shifts it
	'right one column. It then adds a new column at the left-hand edge.
	'This creates a message that "crawls" from left to right.
	
	MOVEIT:
	      GET (LEFT, TOP)-(RIGHT - 1, TOP + 7), BUFF 'get current image.
	      PUT (LEFT + 1, TOP), BUFF, PSET     'shift image to right.
	
	     'A new column is added at the left. This is constructed using the
	     'character pattern table located in ROM at F000:FA6E.
	
	      COLUMN = COLUMN + 1
	      IF COLUMN = 9 THEN
	            COLUMN = 1
	            LETNUM = LETNUM + 1     'start a new letter.
	            IF LETNUM > LEN(MESSAGE$) THEN LETNUM = 1
	            'wrap around if necessary.
	            'compute offset into pattern table for the new letter.
	            OFFSET = &HFA6E + ASC(MID$(MESSAGE$,LEN(MESSAGE$)-
	            LETNUM + 1,1)) * 8
	      END IF
	
	      'copy one column of the pattern into left edge of the window:
	      FOR ROW = 0 TO 7
	            BYTE = OFFSET + ROW
	            BIT = (PEEK(BYTE) AND 2 ^ (COLUMN - 1))
	            IF BIT = 0 THEN
	                  PRESET (LEFT, TOP + ROW)
	            ELSE
	                  PSET (LEFT, TOP + ROW)
	            END IF
	      NEXT
	
	      PLAY "MB N0"       'create a new "song".
	RETURN
