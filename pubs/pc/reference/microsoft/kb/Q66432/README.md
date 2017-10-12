---
layout: page
title: "Q66432: "QC Is Already Running" Message Appears"
permalink: /pubs/pc/reference/microsoft/kb/Q66432/
---

	Article: Q66432
	Product: Microsoft C
	Version(s): 2.50 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKASM
	Last Modified: 9-NOV-1990
	
	Question:
	
	When I invoke the QuickC integrated environment, a dialog box comes up
	with the following message:
	
	   QC is already running
	           Exit?
	
	The online help states that this message indicates another instance of
	QuickC running on my system. However, I am sure that I do not have
	another instance of QuickC running. I have rebooted and the message
	still appears. How can I eliminate this dialog box?
	
	Response:
	
	This message is caused by the presence of the file QC.LCK, which is
	created when the QuickC environment is invoked. If you shell out to
	DOS during a QuickC session by choosing DOS Shell from the File menu,
	and then attempt to start another QuickC session by typing "qc" at the
	DOS prompt, you will receive this message. The file QC.LCK is
	automatically deleted when you exit the QuickC environment.
	
	However, if your system has crashed for some reason during a QuickC
	editing session, or during the execution of a program from within the
	QuickC environment, the file is not deleted, and when you reboot and
	attempt to start QuickC, the presence of QC.LCK causes this message
	box to appear.
	
	The solution to this problem is to delete the QC.LCK file; it is
	placed in the BIN subdirectory.
