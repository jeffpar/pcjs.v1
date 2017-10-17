---
layout: page
title: "Q67862: Running MSETUP from Drive B"
permalink: /pubs/pc/reference/microsoft/kb/Q67862/
---

## Q67862: Running MSETUP from Drive B

	Article: Q67862
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | driver mouse install b: msetup
	Last Modified: 10-FEB-1991
	
	When you run the Setup program from drive B, the message "please
	insert disk into drive A" may occur. You can temporarily force drive B
	to emulate drive A. Using the DOS ASSIGN command, type
	
	   ASSIGN A=B
	
	at the C:\DOS> prompt. Then, run MSETUP from drive B. After rebooting
	the system, the drives will return to their normal configuration.
