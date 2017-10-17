---
layout: page
title: "Q40222: CTRL+INS Fails after Initial Use on Some Clones"
permalink: /pubs/pc/reference/microsoft/kb/Q40222/
---

## Q40222: CTRL+INS Fails after Initial Use on Some Clones

	Article: Q40222
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 31-OCT-1989
	
	In the QuickC editor, the CTRL+INS key combination for the PASTE
	function may fail after the first use on some clones. The major
	symptom of this problem is that the CTRL+INS will PASTE once, but will
	fail for all subsequent attempts. This failure will continue until the
	INS key is pressed outside QuickC at the DOS command prompt.
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	The workaround is to use the corresponding PASTE function under the
	Edit menu.
	
	Note: Only the CTRL+INS combination suffers from this problem. The INS
	key alone and SHIFT+INS perform as expected.
	
	The following sequence of events will determine if your machine
	suffers from this problem:
	
	Keystrokes         Comments
	
	 1. QC              a. Enter QuickC.
	
	                    b. Highlight some text and choose "Cut"
	                       under EDIT menu.
	
	 2. CTRL+INS        This should work correctly the first time.
	
	 3. CTRL+INS        This should fail (on all subsequent attempts
	                    as well).
	
	 4. ALT+F, X        Exit QuickC.
	
	 5. QC              a. Reenter QuickC.
	
	                    b. Highlight and Cut some text.
	
	6. CTRL+INS        This should fail (the BIOS bit is still set).
	
	7. ALT+F, X        Exit QuickC.
	
	8. INS             At the DOS prompt, press the INS key.
	                   (This clears the BIOS bit.)
	
	9. QC              a. Reenter QuickC.
	
	                   b. Highlight and Cut some text.
	
	10. CTRL+INS        Insertion should work.
	
	11. CTRL+INS        This should fail.
	
	The problem occurs because the BIOS bit, which indicates that the INS
	key is currently held down, is not being cleared. When this bit is
	set, the BIOS does not put a character in the keyboard queue when it
	sees the INS key go down (so that the INS key does not autorepeat).
