---
layout: page
title: "Q65105: How to Call VioPopUp() from a Protected Mode BASIC Program"
permalink: /pubs/pc/reference/microsoft/kb/Q65105/
---

## Q65105: How to Call VioPopUp() from a Protected Mode BASIC Program

	Article: Q65105
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: OS/2
	Flags: ENDUSER | SR# S900812-3
	Last Modified: 4-SEP-1990
	
	A protected mode BASIC program that is running in a background session
	can temporarily seize control of the screen and interact with the
	user, regardless of which session is currently in the foreground. This
	is accomplished by calling the OS/2 API function VioPopUp(). Below is
	a sample program that demonstrates how to do this.
	
	This information applies to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2 and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS OS/2.
	
	VioPopUp() takes two parameters:
	
	   Parameter   Description
	   ---------   -----------
	
	   PTR WORD    Contains option flags for pop-up
	       WORD    Video handle (0 = default)
	
	If bit 0 of the first parameter is set, VioPopUp() will wait until a
	pop-up is available. If bit 0 is cleared, VioPopUp() will return
	immediately with an error if a pop-up is not available.
	
	If bit 1 of the first parameter is set, the pop-up will be
	transparent. This means that if the display is already in a text mode,
	no mode change will occur and the screen contents and cursor position
	will not be disturbed. Also session switching will be disabled. If the
	display is not in a text mode, the pop-up will have no special effect
	on any other process.
	
	If bit 1 of the first parameter is cleared, the pop-up will be
	nontransparent. This means that the display will be put into an
	80-by-25 text mode, the screen cleared, and the cursor placed into the
	upper-left corner. Also, session switching will be disabled.
	
	During a pop-up, all other processes run normally except that they
	can't interact with the user or modify the physical display. Any
	attempt to perform these actions is blocked until the process in
	pop-up mode calls the API function VioEndPopUp(). When this happens,
	the pop-up process reverts to the background, the process that was in
	the foreground when the pop-up occurred regains its status, and the
	physical display is restored.
	
	Microsoft BASIC 6.00 and 6.00b and Microsoft BASIC PDS 7.00 and 7.10
	can directly call OS/2 API functions by linking with the DOSCALLS.LIB
	(for 6.00 and 6.00b) or OS2.LIB (for 7.00 and 7.10) libraries. Note
	that a WORD in BASIC has a type of INTEGER. Also, data items preceded
	by PTR can be passed using the SEG clause in the DECLARE statement of
	the function; otherwise, BYVAL is used.
	
	For more information about VioPopUp() and VioEndPopUp(), see Pages
	113-115 of "Advanced OS/2 Programming" by Ray Duncan (Microsoft Press,
	1989).
	
	The following sample program generates a pop-up, displays a message
	while in the pop-up, and then ends the pop-up. Before doing so, it
	lets the user choose the type of pop-up (transparent or
	nontransparent) and then emits five delayed beeps to allow the user to
	switch sessions.
	
	To compile the program, enter the following at the OS/2 command prompt:
	
	   bc popup;
	
	The command line for linking the program with BASIC 6.00 or 6.00b is
	as follows:
	
	   link /nop popup,,,doscalls;
	
	The command line for linking the program with BASIC PDS 7.00 or 7.10
	is as follows:
	
	   link /nop popup,,,os2;
	
	POPUP.BAS
	---------
	
	DECLARE FUNCTION VioPopUp%    (SEG Flags%, BYVAL Handle%)
	DECLARE FUNCTION VioEndPopUp% (BYVAL Handle%)
	
	'Loop until the user chooses a valid option.
	DO UNTIL (Flags% = 1) OR (Flags% = 3)
	
	   'Prompt the user for an option.
	   INPUT "Transparent (1) or Nontransparent (2) pop-up"; Flags%
	
	   'Setting bit 0 tells OS/2 to wait until a pop-up is available.
	   'Bit 1 is set for transparent mode, cleared for nontransparent.
	   SELECT CASE Flags%
	   CASE 1
	      Flags% = 3
	   CASE 2
	      Flags% = 1
	   CASE ELSE
	      PRINT "Invalid option!"
	      BEEP
	   END SELECT
	
	LOOP
	
	FOR I% = 1 TO 5   'Delay so user has time to switch sessions.
	   BEEP
	   SLEEP 1
	NEXT I%
	
	ErrorCode% = VioPopUp% (Flags%, 0)   'Start the pop-up.
	
	COLOR 13, 1                          'Display a colored message on the
	LOCATE 12, 36                        'the screen.
	PRINT "Surprise!"
	
	LOCATE 25, 35
	PRINT "Hit any key";                 'Wait until a key is pressed.
	WHILE INKEY$ = ""
	WEND
	
	ErrorCode% = VioEndPopUp% (0)        'End the pop-up and the program.
	END
