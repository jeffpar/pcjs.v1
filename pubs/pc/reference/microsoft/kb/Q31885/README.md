---
layout: page
title: "Q31885: ON &lt;Event&gt; GOSUB Suspended Until INPUT or INPUT&#36; Is Satisfied"
permalink: /pubs/pc/reference/microsoft/kb/Q31885/
---

## Q31885: ON &lt;Event&gt; GOSUB Suspended Until INPUT or INPUT&#36; Is Satisfied

	Article: Q31885
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI B_GWBasicC B_MQuickB B_BasicInt
	Last Modified: 8-NOV-1990
	
	Execution of event trapping GOSUB routines is suspended in BASIC until
	an INPUT or LINE INPUT statement or INPUT$ function is satisfied.
	Events suspended during INPUT, INPUT$, or LINE INPUT include the
	following:
	
	1. ON TIMER(n) GOSUB
	   (found in many Microsoft BASICs, including GW-BASIC, QuickBASIC
	   for MS-DOS, and QuickBASIC for Macintosh)
	
	2. ON KEY(n) GOSUB
	   (found in QuickBASIC and GW-BASIC for MS-DOS, but not in QuickBASIC
	   for Macintosh)
	
	3. ON DIALOG GOSUB, ON MENU GOSUB, and ON MOUSE GOSUB
	   (found in QuickBASIC for the Apple Macintosh, but not in QuickBASIC
	   for MS-DOS)
	
	The suspending of event GOSUBs during INPUT, INPUT$, or LINE INPUT is
	an intentional design requirement and occurs in all Microsoft BASIC
	products that support event trapping, including the following
	products:
	
	1. Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, and 4.50 for MS-DOS
	
	2. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS OS/2 and
	   MS-DOS
	
	3. Microsoft BASIC Professional Development System (PDS) versions 7.00
	   and 7.10 for MS-DOS and MS OS/2
	
	4. Microsoft GW-BASIC Interpreter versions 3.20, 3.22, and 3.23 for
	   MS-DOS
	
	5. Microsoft QuickBASIC version 1.00 for the Apple Macintosh
	
	6. Microsoft BASIC Compiler version 1.00 for the Apple Macintosh
	
	7. Microsoft BASIC Interpreter versions 2.00, 2.10, and 3.00 for
	   the Apple Macintosh (Event trapping is not supported in Microsoft
	   BASIC Interpreter versions 1.00 and 1.01 for the Apple Macintosh.)
	
	Suppose you write a program with ON TIMER(5) GOSUB so that every five
	seconds a message is displayed on the screen. If an INPUT$ function or
	INPUT or LINE INPUT statement is executed that expects a value from
	the keyboard, the ON TIMER(5) GOSUB will not execute until the ENTER
	key is pressed to terminate the input. Only one TIMER event is
	remembered on the stack, no matter how much time passed during the
	INPUT$, INPUT, or LINE INPUT. An example of this event suspension is
	demonstrated in Program 1 below.
	
	If you want to trap events and also input from the keyboard, you can
	poll the INKEY$ function as shown in program 2 below instead of using
	INPUT$, INPUT, or LINE INPUT. The INKEY$ function returns one key
	press at a time, and allows event GOSUB traps to occur between
	invocations.
	
	BASIC checks between statements to see if an event has occurred. When
	the INPUT$, INPUT, or LINE INPUT executes, execution of the ON event
	GOSUB statement is suspended until the INPUT$, INPUT, or LINE INPUT is
	satisfied. This behavior is intentional and occurs in all Microsoft
	BASIC products that support event trapping.
	
	If you are using ON KEY(n) GOSUB to trap keys (in GW-BASIC or
	QuickBASIC for MS-DOS), only one key press during INPUT$, INPUT, or
	LINE INPUT will be remembered on the stack for a given defined KEY, no
	matter how many times that key is pressed. This behavior is by design
	(to prevent stack overflow).
	
	The following are code examples:
	
	Program 1
	---------
	
	The following program shows that ON TIMER(n) GOSUB waits while the
	INPUT statement is pending:
	
	   REM  Program 1, using the INPUT statement.
	   ON TIMER(5) GOSUB MESSAGE     ' TRAP EVERY 5 SECONDS
	   TIMER ON
	   INPUT X$   ' NO GOSUB IS DONE UNTIL THIS INPUT IS SATISFIED.
	   FOR I=1 TO 2000
	    PRINT X$
	   NEXT
	   END
	   MESSAGE:
	       PRINT " FIVE SECONDS "
	       RETURN
	
	Program 2
	---------
	
	The following program polls the INKEY$ function for INPUT and lets the
	ON TIMER(5) GOSUB statement successfully perform the TIMER event trap
	every five seconds:
	
	   REM  ********   Program 2, using the INKEY$ function.
	   ON TIMER(5) GOSUB MESSAGE          ' TRAP EVERY 5 SECONDS
	   TIMER ON
	   CLS
	   MOREIN:
	      A$ = INKEY$
	      IF A$ = "" GOTO MOREIN
	      IF A$ = CHR$(13) GOTO DONE   'Input until ENTER key is pressed.
	      X$ = X$ + A$: J = J + 1
	      PRINT A$;
	      IF J > 79 THEN PRINT "Exceeded 79 characters.": GOTO DONE
	   GOTO MOREIN
	   DONE:
	       PRINT
	       FOR I = 1 TO 2000
	         PRINT X$
	       NEXT
	       END
	   MESSAGE:
	       PRINT " FIVE SECONDS "    ' DISPLAY MESSAGE AFTER 5 SECONDS.
	       RETURN
	
	Note: The following Microsoft BASIC products do NOT support event
	trapping features, such as ON TIMER(n) GOSUB or ON KEY(n) GOSUB:
	
	1. Microsoft Business BASIC Compiler versions 1.00 and 1.10 for
	   MS-DOS
	
	2. Microsoft BASIC Compiler versions 5.35 and 5.36 for MS-DOS
