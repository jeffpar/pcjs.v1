---
layout: page
title: "Q47501: Libraries Only Found When Linking in Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q47501/
---

	Article: Q47501
	Product: Microsoft C
	Version(s): 1.01 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 10-OCT-1989
	
	Question :
	
	When I use the QuickC environment, my programs compile and link
	properly, but when I compile and link from the command line, I get the
	error "Cannot find library." I tried running the NMAKE file that was
	produced by QuickC and that method did not work either. What is the
	difference when I am in the QuickC environment?
	
	Response :
	
	The only reason this situation might occur is if your LIB environment
	variable string was not typed in correctly. If the string contains any
	spaces, then, although it may point to the correct directories, it is
	not interpreted correctly.
	
	Everything works correctly inside the QuickC environment because the
	QuickC environment actually parses the environment strings, and passes
	on the correct values without the spaces to the compiler and linker.
	This parsing does not occur when you work outside the environment with
	command line compiling and linking, or when using NMAKE.
	
	Another reason a badly set environment string may not be noticed inside
	the QuickC environment is because of the QuickC initialization file
	QC.INI. This file is created the first time you run QuickC, and it is
	updated on each subsequent usage. It is used to store environment
	information such as compiler and linker flags, menu options, completed
	Learn QuickC lessons, etc.
	
	If you select the Environment option under the Options menu, you can
	see the current LIB setting. If you modify this string, then the
	modified string is used in place of the LIB environment variable, and
	it is saved for future use in the QC.INI file. If, at a later time,
	the LIB environment variable is set incorrectly, it will go unnoticed
	inside of the QuickC environment as the string in QC.INI always
	overrides it.
	
	Environment variables are used by various programs as a source of
	global configuration information. With Microsoft's C products, PATH,
	LIB, INCLUDE, and TMP are the environment variables used. These values
	must be set each time the computer is booted up or rebooted from the
	keyboard. Therefore, a batch file is normally used to make these
	settings -- usually AUTOEXEC.BAT. The SET command is used to set an
	environment variable to a value. For example,
	
	   SET LIB=C:\MSC\INCLUDE
	
	sets LIB to the C:\MSC\INCLUDE directory and any program may use this
	information if needed. No spaces may be entered anywhere in the string
	and, if they are, then the programs utilizing this variable will not
	find the correct information. It is especially important that no
	spaces are entered at the end of the string because these are very
	hard to detect. All of the following examples are incorrect:
	
	   SET LIB = C:\MSC\LIB
	   /* illegal spaces around equal sign - this will even cause a
	      failure inside the QuickC environment */
	
	   SET LIB=C:\MSC\LIB; C:\QC2\LIB
	   /* illegal space after the semicolon - the first directory would
	      be found, but not the second */
	
	   SET LIB=C:\MSC\LIB<space>
	   /* the space character at the end can cause problems */
	
	You may find situations where some of these examples do not cause any
	problems, but if you are experiencing problems that seem to involve
	environment variables, it is best to delete the lines that SET them in
	your batch files, and then completely retype them.
