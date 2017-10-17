---
layout: page
title: "Q67860: The Microsoft Mouse with Lotus 1-2-3 Release 3.1"
permalink: /pubs/pc/reference/microsoft/kb/Q67860/
---

## Q67860: The Microsoft Mouse with Lotus 1-2-3 Release 3.1

	Article: Q67860
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 10-FEB-1991
	
	You can use the Microsoft Mouse with Lotus 1-2-3 version 3.1. The
	mouse will work correctly with both the COM and SYS versions of the
	drivers. Correct mouse use in 1.2.3 release 3.1 depends on whether or
	not the memory resident formatting and printing utility WYSIWYG is
	properly installed and loaded into memory. Without installation and
	loading of WYSIWYG, no mouse cursor will appear on the normal Lotus
	1-2-3 screen. If you try use a previous Lotus 1-2-3 Microsoft Mouse
	menu or the generic MSMENU, Lotus will not work correctly (for
	example, you will get erratic highlights and no cursor).
	
	It appears that in some instances there is a problem with earlier
	versions of the mouse driver even when WYSIWYG is correctly installed
	and loaded. A possible solution is to update the mouse driver to
	MOUSE.COM version 7.04. Another possible solution is to load MOUSE.SYS
	version 7.04 with the CONFIG.SYS file.
	
	Correct use of the mouse in Lotus 1-2-3 version 3.1 depends on proper
	installation of WYSIWYG, correct hardware configuration, and the right
	operating environment.
	
	Installation
	------------
	
	The following steps are necessary to ensure that the Microsoft Mouse
	will work with Lotus 1-2-3 version 3.1:
	
	 1. Complete installation of the mouse hardware and software. Be sure
	    the mouse driver is loaded into memory.
	
	 2. Complete the first-time installation of Lotus 1-2-3 3.1. If you did
	    not choose to have the WYSIWYG files transferred to the hard disk
	    the first time, you must rerun the installation program from the
	    hard disk and choose the option to transfer the WYSIWYG files to
	    the hard disk.
	
	 3. After completing the first installation of Lotus 3.1, put the
	    Add-In Support Disk into drive A and type "install" (without the
	    quotation marks) at the A:> prompt. The installation program will
	    place the WYSIWYG files into the default directory C:\123R3\ADDINS.
	
	 4. When this second "install" is complete, go to the C:\123R3
	    subdirectory and type "123". This takes you into the normal Lotus
	    screen.
	
	 5. Press the ALT+F10 key combination. You will see the Addin menu in
	    the Lotus menu bar area.
	
	 6. From the Addin menu, choose Load.
	
	 7. Specify WYSIWYG.PLC as the add-in to read into memory.
	
	 8. Select No-Key.
	
	 9. WYSIWYG is now in memory, and you have a mouse cursor.
	
	10. You can get the regular Lotus menus by selecting Quit or using the
	    key combination CTRL+BREAK. You also may toggle between the Addin
	    menu and the main Lotus menu by clicking the right mouse button.
	
	Hardware
	--------
	
	You must have a mouse and mouse driver as well as a graphics
	display monitor and a graphics display card. Lotus 1-2-3 3.1
	also requires at least a 286 microprocessor.
	
	Operating Environment
	---------------------
	
	Lotus 1-2-3 3.1 requires MS-DOS version 3.00 or later. It will not run
	in the DOS compatibility box of OS/2; however, it will run after you
	choose the DOS dual-boot option from OS/2. Lotus 1-2-3 3.1 will run
	under the DOS option of Windows 3.00 or it can be installed as a
	Windows 3.00 application.
	
	Additional Tips
	---------------
	
	Microsoft Mouse Driver versions 7.03 and 7.05 will return a white
	arrow graphics cursor in Lotus 1-2-3 3.11 while all other mouse driver
	versions will return a blue graphics cursor.
	
	To select an item from a menu you must point to the menu item desired
	and hold the left mouse button down. Then move the highlight to the
	sub-menu choice. When you release the mouse button, the item will be
	selected.
	
	In addition to normal mouse cursor movement, you may also move the
	mouse cursor by selecting the arrow icons on the right hand side of
	the 1-2-3 screen.
