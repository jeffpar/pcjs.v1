---
layout: page
title: "Q29705: MREADME.DOC: Using the Default Expert Mouse Menu"
permalink: /pubs/pc/reference/microsoft/kb/Q29705/
---

	Article: Q29705
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 5-JUN-1988
	
	The default Expert Mouse menu allows you to use a mouse to emulate
	keys, such as the ESCAPE, ENTER, and cursor keys, with applications
	that normally do not support mice.
	
	   To use this menu, load it into memory before you start your
	application.
	   To load the default menu, type the following after the prompt of
	the drive or directory where the DEFAULT.COM file resides:
	
	   default
	
	   Once the default menu is loaded, you can perform the mouse actions
	described in the following tables to emulate certain keys in your
	application:
	
	                 Press                     To Emulate
	
	                 The left mouse button     The F3 key
	                 The right mouse button    A carriage return (the ENTER key)
	                 Both mouse buttons        The ESCAPE key
	
	                 Move                      To emulate
	
	                 The mouse to the left     The LEFT ARROW key
	                 The mouse to the right    The RIGHT ARROW key
	                 The mouse up              The UP ARROW key
	                 The mouse down            The DOWN ARROW key
	
	   To remove the default menu from memory, type the following after
	the prompt of the drive or directory where the DEFAULT.COM file
	resides:
	
	                 default off
