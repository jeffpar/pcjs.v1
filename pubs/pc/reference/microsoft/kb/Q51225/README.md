---
layout: page
title: "Q51225: How to Define, Display Graphics Mouse Cursor in FORTRAN 5.00"
permalink: /pubs/pc/reference/microsoft/kb/Q51225/
---

## Q51225: How to Define, Display Graphics Mouse Cursor in FORTRAN 5.00

	Article: Q51225
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | H_fortran
	Last Modified: 10-JUL-1990
	
	The following code shows how to define and display a graphics mouse
	cursor in Microsoft FORTRAN version 5.00:
	
	c This program displays mouse cursor in a shape of a cross.
	c The program terminates when the user presses the ENTER
	c key.
	
	      include 'fgraph.fi'
	      include 'fgraph.fd'
	      integer*2 m1,m2,m3,m4
	      integer*2 mcursor(32)
	      integer*2 arrloc(2)
	      integer*4 arradds
	      equivalence (arrloc(1),arradds)
	
	      do 50 i=1,16                   !define the screen mask
	 50      mcursor(i) = #ffff
	         mcursor(17) = #0000         !define the cursor mask
	         mcursor(18) = #0180
	         mcursor(19) = #0180
	         mcursor(20) = #0180
	         mcursor(21) = #7ffe
	         mcursor(22) = #0180
	         mcursor(23) = #0180
	         mcursor(24) = #0180
	         mcursor(25) = #0000
	         mcursor(26) = #0000
	         mcursor(27) = #0000
	         mcursor(28) = #0000
	         mcursor(29) = #0000
	         mcursor(30) = #0000
	         mcursor(31) = #0000
	         mcursor(32) = #0000
	
	      m1 = 0
	      call mousel(m1,m2,m3,m4)         !reset mouse driver
	      dummy = setvideomode($erescolor) !set video mode (EGA)
	      m1 = 9
	      m2 = 1
	      m3 = 1
	      arradds = locfar(mcursor) !get address of cursor array
	      call mousel(m1,m2,m3,arrloc(1))  !set graphics cursor
	      m1 = 1
	      call mousel(m1,m2,m3,m4)         !show cursor
	      read(*,*)                        !press enter to quit
	      m1 = 2
	      call  mousel(m1,m2,m3,m4)        !hide cursor
	      dummy = setvideomode($defaultmode) !set video mode
	      end
