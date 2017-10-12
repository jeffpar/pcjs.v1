---
layout: page
title: "Q44925: Status Line Input with a Blinking Cursor"
permalink: /pubs/pc/reference/microsoft/kb/Q44925/
---

	Article: Q44925
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | GETINPUT.ARC S12311.EXE
	Last Modified: 13-SEP-1989
	
	Question:
	
	Is it possible in the Microsoft Editor to write an extension that will
	accept a line of input from the user, preferably from the status line?
	
	Response:
	
	Version 1.02 of the Microsoft Editor offers a very convenient way to
	do this. The GetString() callback function performs exactly this type
	of input. Version 1.00 of the Editor, however, does not have such a
	callback. It is possible to put together a routine that reads user
	input using the ReadChar() function in M Version 1.00. However, since
	ReadChar() waits for the next available character, there is no
	convenient way to flash a cursor during input when using this
	approach.
	
	The function provided below is a status-line input routine that does
	provide a flashing cursor. It uses the KbHook() and KbUnHook()
	functions to prevent the editor from scanning the keyboard and then
	reads the keyboard directly using the kbhit() and getch() functions
	from the C run-time library.
	
	An example C extension that demonstrates this function is available
	in the Software\Data Library. This file can be found by searching on
	the keyword GETINPUT, the Q number of this article, or S12311.
	GETINPUT was archived using the PKware file-compression utility.
	
	Status-Line Input Routine
	-------------------------
	
	#include "ext.h"
	#include <stdio.h>
	#include <string.h>
	#include <stdlib.h>
	#include <conio.h>
	
	#define TRUE            1
	#define FALSE           0
	
	typedef unsigned        BOOL;
	
	char *GetInput( int BufLen, char *theBuffer );
	
	/* GetInput provides a means of getting user input from the status line
	 * with a blinking cursor in a manner similar to M 1.02's GetString().
	 * KbUnHook is used to capture keyboard input. KbHook restores normal
	 * keyboard reading to the editor.
	 *
	 * Receives:    BufLen - Length of input buffer
	 *              theBuffer - Pointer to input buffer
	 *
	 * Returns:     A pointer to the modified buffer, or NULL if ESC was
	 *              used to cancel input.
	 */
	char *GetInput(
	    int             BufLen,
	    char            *theBuffer )
	{
	    char            Key;                        /* ASCII code of key */
	    int             i = 0;                      /* Position in buffer */
	    BOOL            CursorOn = TRUE;            /* State of cursor */
	    int             FlashCount = 0;             /* Cursor state counter */
	    int             CursorToggleCount = 100;    /* Iterations between changes
	                                                   in cursor state */
	    char            *r;                         /* Return pointer */
	
	    /* Unhook the keyboard so that the editor no longer intercepts
	     * keystrokes.
	     */
	    KbUnHook();
	
	    /* Get keyboard input from user, stopping when ESC or ENTER is hit.
	     * Characters not in the range of 32 to 127 are ignored.  Backspace
	     * will work properly.  No more than (BufLen - 2) characters may
	     * be entered.
	     */
	    do
	    {
	        /* Flash a cursor while waiting for the next keypress.
	         */
	        while( !kbhit() )
	        {
	            if( ++FlashCount == CursorToggleCount )
	            {
	                FlashCount = 0;
	                CursorOn = !CursorOn;
	                if( CursorOn )
	                {
	                    strcat( theBuffer, "_" );
	                    DoMessage( theBuffer );
	                }
	                else
	                {
	                    theBuffer[i] = '\0';
	                    DoMessage( theBuffer );
	                }
	            }
	        }
	
	        /* Snarf the key
	         */
	        Key = (char)getch();
	
	        /* Handle backspace.
	         */
	        if( (Key == 8) && (i > 0) )
	        {
	            theBuffer[--i] = '\0';
	            DoMessage( theBuffer );
	        }
	
	        /* Handle normal character.
	         */
	        if( (Key >=32) && (Key <= 127) && (i < BufLen - 2) )
	        {
	            theBuffer[i++] = Key;
	            theBuffer[i] = '\0';
	            DoMessage( theBuffer );
	        }
	    } while( (Key != 13) && (Key != 27) );
	
	    /* If ESC was pressed, toss the input and NULL the input buffer,
	     * else perform a little cleanup.
	     */
	    if( Key == 27 )
	    {
	        theBuffer[0] = '\0';
	        DoMessage( theBuffer );
	        r = NULL;
	    }
	    else
	    {
	        if( CursorOn )
	            theBuffer[i] = '\0';
	        DoMessage( theBuffer );
	        r = theBuffer;
	    }
	
	    /* Restore normal keyboard input.
	     */
	    KbHook();
	
	    return( r );
	}
