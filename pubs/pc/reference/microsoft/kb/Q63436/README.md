---
layout: page
title: "Q63436: &quot;Statement Label Not Allowed Between SELECT CASE&quot; Help Hangs"
permalink: /pubs/pc/reference/microsoft/kb/Q63436/
---

## Q63436: &quot;Statement Label Not Allowed Between SELECT CASE&quot; Help Hangs

	Article: Q63436
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900608-162 buglist4.50
	Last Modified: 29-JUN-1990
	
	In Microsoft QuickBASIC, line labels are not allowed between a SELECT
	CASE statement and the following CASE statement. The QB.EXE
	environment will detect the error and will display a dialog box
	informing you of the error. Choosing Help from the dialog box, and
	then either pressing the ESC key or choosing OK to get back to your
	program will cause your machine to hang.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of QuickBASIC version 4.50. We are researching this problem and will
	post new information here as it becomes available.
	
	This problem does NOT occur in the QuickBASIC Extended environment
	(QBX.EXE) of Microsoft BASIC Professional Development System (PDS)
	version 7.00.
	
	The following code example demonstrates the problem. When run inside
	the QuickBASIC environment, the syntax error is detected. If the Help
	option is selected for the error message, anything else done to exit
	Help and get back to the program results in the machine hanging.
	
	Code Example
	------------
	
	X = 1
	   SELECT CASE X         'You will get an error message telling you
	30   CASE 1              'that it is illegal to have a line label here
	          PRINT "You will hang if you choose help on the error!"
	   END SELECT
