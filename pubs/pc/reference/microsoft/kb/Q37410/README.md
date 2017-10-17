---
layout: page
title: "Q37410: Sample BASIC 6.00/7.00 Program to CALL OS/2 Mouse Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q37410/
---

## Q37410: Sample BASIC 6.00/7.00 Program to CALL OS/2 Mouse Functions

	Article: Q37410
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | O_OS2API O_OS2SDK
	Last Modified: 26-MAR-1990
	
	Below is a sample program that calls the following MS OS/2 API
	function calls for accessing the mouse in MS OS/2 protected mode:
	
	   MouReadEventQue
	   MouSetEventMask
	   MouOpen
	   MouRemovePtr
	   MouDrawPtr
	
	This program can be compiled in MS OS/2 protected mode in Microsoft
	BASIC Compiler Version 6.00 or 6.00b for MS OS/2 and in Microsoft
	BASIC Professional Development System (PDS) Version 7.00 for MS OS/2.
	
	Code Example
	------------
	
	' Summary of Program:
	'
	' The following program loops until any key is pressed.
	' As the mouse is moved, a "smiley" face is displayed.
	' Pressing the left mouse button causes the face to
	' change colors. The colors are random.
	' Pressing the right mouse button causes the screen to
	' clear and be the same color as the last face.
	'
	' The following is taken from BSESUBMO.BI
	' OS/2 Subroutine Include File - Mouse Support
	' Copyright (c) 1987,1988 Microsoft Corporation
	
	TYPE MOUEVENTINFO
	      fs        AS INTEGER
	      Time      AS LONG
	      row       AS INTEGER
	      col       AS INTEGER
	END TYPE
	
	TYPE NOPTRRECT
	      row       AS INTEGER
	      col       AS INTEGER
	      cRow      AS INTEGER
	      cCol      AS INTEGER
	END TYPE
	
	TYPE PTRSHAPE
	      cb        AS INTEGER
	      col       AS INTEGER
	      row       AS INTEGER
	      colHot    AS INTEGER
	      rowHot    AS INTEGER
	END TYPE
	
	DECLARE FUNCTION MouReadEventQue%( _
	      SEG   P1 AS MOUEVENTINFO,_
	      SEG   P2 AS INTEGER,_
	      BYVAL P3 AS INTEGER)
	
	DECLARE FUNCTION MouSetEventMask%( _
	      SEG   P1 AS INTEGER,_
	      BYVAL P2 AS INTEGER)
	
	DECLARE FUNCTION MouOpen%( _
	      BYVAL P1s AS INTEGER,_
	      BYVAL P1o AS INTEGER,_
	      SEG   P2 AS INTEGER)
	
	DECLARE FUNCTION MouClose%( _
	      BYVAL P1 AS INTEGER)
	
	DECLARE FUNCTION MouRemovePtr%( _
	      SEG   P1 AS NOPTRRECT,_
	      BYVAL P2 AS INTEGER)
	
	DECLARE FUNCTION MouDrawPtr%( _
	      BYVAL P1 AS INTEGER)
	
	DEFINT a-z
	DIM MouEvent as MOUEVENTINFO
	DIM Pointer as PTRSHAPE
	CLS
	 x=MouOpen(0,0,hMouse) 'OPEN MOUSE DRIVER
	 IF x THEN
	    PRINT "*** Unable to load Mouse Driver ***"
	    END
	 ELSE
	    x=MouDrawPtr(hMouse)  'Draw the mouse
	    mask=&h001F '(2 buttons 1F)
	    x=MouSetEventMask(mask,hMouse)
	    ReadType=0
	    while inkey$=""
	       x=MouReadEventQue(MouEvent,ReadType,hMouse)
	       'Structure is all zeros if no event
	       IF (MouEvent.time<>0) THEN
	          IF (MouEvent.fs AND &h0004) THEN  'left button
	             y=INT(16 * RND)
	             color ,y
	          END IF
	
	          IF (MouEvent.fs AND &h0010) THEN  'right button
	             CLS
	          END IF
	             CALL HideMouse(MouEvent.Row,MouEvent.Row,MouEvent.Col,_
	                            MouEvent.col,hMouse)
	             locate MouEvent.row+1,MouEvent.col+1 : print chr$(1);
	       END IF
	    WEND
	 END IF
	
	SUB HideMouse(a,b,c,d,driver) STATIC
	DIM NoMouse  as NoPtrRect
	   NoMouse.row=a
	   NoMouse.cRow=b
	   NoMouse.col=c
	   NoMouse.cCol=d
	   x=MouRemovePtr(NoMouse,driver)
	END SUB
