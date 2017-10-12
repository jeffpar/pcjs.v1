---
layout: page
title: "Q58783: Backing Up QuickC Files in the Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q58783/
---

	Article: Q58783
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-FEB-1990
	
	Question:
	
	Is it possible to configure QuickC 2.00 or 2.01 to automatically back
	up my source file, or must I use the Save As command whenever I want
	to save a .BAK file?
	
	Response:
	
	QuickC does not offer a built-in automatic backup feature. However,
	there are several ways to make a backup file from inside the
	environment.
	
	1. Use the Save As command. This allows you to save the current file
	   under a different name.
	
	2. Select the Run DOS Command option under the Utility menu to access
	   the DOS COPY command.
	
	3. Take advantage of QuickC's ability to customize the Utility menu. A
	   backup program option can be installed on the utility menu.
	
	Below is one way to add a backup option to the Utility menu:
	
	1. Create a batch file called BACK.BAT in the QC2\BIN subdirectory.
	   The file should contain one line, as follows:
	
	      COPY %1 *.BAK
	
	2. Bring up QuickC and select the Utility.Customize Menu option.
	
	3. Select <Add> to add a menu option.
	
	4. Fill in the screen as shown below:
	
	      Menu Text: [Backup Routine            ]
	      Path Name: [C:\QC2\BIN\BACK.BAT       ]
	      Arguments: [$FILE                     ]
	      Initial Directory: [                  ]
	      [ ] Prompt Before Returning
	      Accelerator Key: ( ) None  (*) Key F[10]
	
	   Modify the pathname and accelerator key as needed for your setup.
	
	5. Select <Ok> and <Save> to get back to the main screen.
	
	From now on, whenever you press the accelerator key or select the
	Utility.Backup Routine menu option, the file in the current screen
	group will be saved with an extension of BAK. You can modify this
	behavior by changing the BACK.BAT batch file to fit your needs.
