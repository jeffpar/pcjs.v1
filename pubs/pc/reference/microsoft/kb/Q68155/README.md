---
layout: page
title: "Q68155: Windows DLL Build Options Ignore .RC Files in PWB 1.10"
permalink: /pubs/pc/reference/microsoft/kb/Q68155/
---

	Article: Q68155
	Product: Microsoft C
	Version(s): 1.10   | 1.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.10 S_C P_WINSDK
	Last Modified: 11-JAN-1991
	
	In the Programmer's WorkBench version 1.10, the default build options
	for creating a Windows DLL will ignore any .RC files included in the
	Program List, and therefore, will not build them into the project.
	
	Use the following steps to correct this problem:
	
	 1. If there is a Program List currently set, clear it.
	
	 2. Set the Main Language to C.
	
	 3. Set the Initial Build Options to Windows DLL.
	
	 4. Create a new Program List containing all the files you want in your
	    project.
	
	 5. Save the Program List. At this point, PWB will tell you that your
	    .RC file will be ignored. Choose OK when that dialog box appears.
	
	 6. Choose Editor Settings from the Options menu.
	
	 7. Find the line that starts:
	
	       build: target $(PROJ).dll
	
	 8. Change the word "res_dll" on that line to "rc_dll".
	
	 9. Move the cursor off that line to highlight the change. Press SHIFT+F2
	    to save the new settings.
	
	10. Press F2 to exit the ASSIGN pseudofile.
	
	11. Choose Edit Program List from the Make menu.
	
	12. Choose Save List. The .RC file will now be saved in the Program
	    List and used as expected.
	
	After these steps are taken, the settings will be saved in the .STS
	file for that project, and will remain correct as long as Set Initial
	Build Options is never selected when this Program List is set. In
	order to keep from repeating these steps for future projects, the
	build options should be saved under a descriptive name, such as
	"Corrected Windows DLL Settings." They can then be chosen for any
	future Windows DLLs.
	
	Microsoft has confirmed this to be a problem in the Programmer's
	WorkBench version 1.10. We are researching this problem and will post
	new information here as it becomes available.
