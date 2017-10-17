---
layout: page
title: "Q61592: Mouse Command-Line Switches for Mouse Driver Version 7.04"
permalink: /pubs/pc/reference/microsoft/kb/Q61592/
---

## Q61592: Mouse Command-Line Switches for Mouse Driver Version 7.04

	Article: Q61592
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | Video 7 Video-7
	Last Modified: 29-AUG-1990
	
	The following are the current command-line options (switches) for
	Microsoft Mouse Driver version 7.04:
	
	   Option  Description
	   ------  -----------
	
	   /B      Using bus mouse
	
	   /Cn     Using serial mouse on port COMn
	           (where:  0 <= n <= 1)
	
	   /Dn     Enabling double-speed threshold
	           (where:  0 <= n <= 100)
	
	           0 => No threshold speed (always double speed)
	           100 => Maximum threshold speed (rarely double speed)
	
	   /Hn     Setting horizontal sensitivity
	           (where:  0 <= n <= 100)
	
	           0 => 0 horizontal mickeys per pixel scaling factor
	              (i.e., no horizontal movement returned)
	           100 => 100 horizontal mickeys per pixel scaling factor
	
	   /In     Using Microsoft InPort Mouse on primary or secondary InPort
	           (where:  n = 1  or  n = 2)
	
	   /L(c)   Selecting language c
	           Languages are defined as follows:
	
	              c         Language             Ordinal Value
	              -         --------             -------------
	
	          (default)     English                    0
	              F         French                     1
	              NL        Netherlands (Dutch)        2
	              D         German                     3
	              S         Swedish                    4
	              SF        Finnish                    5
	              E         Spanish                    6
	              P         Portuguese                 7
	              I         Italian                    8
	              K         Korean                     9
	              J         Japanese                   10
	
	   /Mn     Cursor mask override
	           (where:  0 <= n <= 255, n = 0 => mask off)
	
	           0 => Mask off
	           Not 0 => Mask on
	
	           (If software cursor is specified in function 10, then set
	           cursor to default software cursor. It tells the mouse
	           driver to determine which bit pattern to use to make
	           the cursor visible.)
	
	   /Nn     Using dampened cursor motion to fix LCD laptop display
	           problems
	           (where:  0 <= n <= 255)
	           (This slows down the screen update rate.)
	
	           0 =>    Skip 0 interrupts (this is, same as normal mouse)
	           255 =>  Skip 255 mouse hardware interrupts before
	                   processing data
	
	   /Pn     Selecting ballistic curve number n
	           (where:  1 <= n <= 4)
	
	           (Note that this may change if the specification changes.)
	
	   /R(n)   Setting interrupt rate
	           (where:  1 <= n <= 4, default n = 1)
	
	           1 => 30Hz
	           2 => 50Hz
	           3 => 100Hz
	           4 => 200Hz
	
	   /Sn     Setting both horizontal and vertical sensitivity
	           (where:  0 <= n <= 100)
	
	           0 => 0 mickeys per pixel scaling factor
	                (that is, no movement returned)
	           100 => 100 mickeys per pixel scaling factor
	
	   /Vn     Setting vertical sensitivity
	           (where:  0 <= n <= 100)
	
	           0 => 0 vertical mickeys per pixel scaling factor
	                (that is, no vertical movement returned)
	           100 => 100 vertical mickeys per pixel scaling factor
	
	   /Y      Disabling sprite and Video Seven code
	
	           (To disable mouse driver hardware cursor support on
	           certain Video Seven and C&T VGA controllers.)
	
	   /Z      Using PS/2 mouse
	
	           (This is added for PS/2 only. It directs the driver to look
	           for the mouse at the mouse port.)
