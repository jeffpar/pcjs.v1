---
layout: page
title: "Q44000: The Editor Can Be Very Slow When MEP Memory Limit Is Pushed"
permalink: /pubs/pc/reference/microsoft/kb/Q44000/
---

	Article: Q44000
	Product: Microsoft C
	Version(s): 1.00 1.02
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 17-MAY-1989
	
	Problem:
	
	I have a file FOO, which is 21733 bytes long and contains 850 lines.
	When I perform the following steps the compiler appears to hang. In
	fact, however, the compiler is being forced to go to disk for its own
	memory management.
	
	When performing the steps described below with the README.DOC from C
	Version 5.10 (which is 64964 bytes) and running on a 16mHz machine,
	after Arg Refresh, it took almost 30 seconds for MEP to return
	control.
	
	This problem is due to the fact that MEP does its own memory
	management. When you do Arg Refresh, MEP must reread the buffer
	containing the modified file from disk. In addition, MEP must store
	back to disk the buffer containing the last block of text pasted to
	the file. This swapping of two large files is what causes the delay.
	
	Microsoft has confirmed this lack of speed to be a limitation with
	Version 1.00 and 1.02 of the Microsoft Editor. We are researching this
	problem  and will post new information as it becomes available.
	
	To duplicate this problem, perform the following steps:
	
	1. Invoke the following to run the editor:
	
	      [C:\]m foo
	
	2. Make some changes to modify the buffer.
	
	3. Issue the following command to the editor:
	
	      arg "bar" setfile
	
	   The editor responds "File c:\bar does not exist, create?"
	
	4. Respond "y" for yes. You are now in bar's buffer.
	
	5. Issue the following command to read in the original contents of the
	   file:
	
	      arg arg "foo" paste
	
	   This process should work correctly.
	
	6. If you now want to get rid of the new buffer, issue the following
	   command:
	
	      arg refresh
	
	   The editor responds with something similar to the following:
	
	      "Do you really want to delete the buffer?"
	
	7. Respond "y" for yes.
	
	   The editor appears to hang.
