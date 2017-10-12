---
layout: page
title: "Q60050: Using the Features of PWB to Build a Program with Overlays"
permalink: /pubs/pc/reference/microsoft/kb/Q60050/
---

	Article: Q60050
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 18-APR-1990
	
	A MAKE file built with PWB can be modified (within reason) with the
	user supplied information section. This section, coded as
	
	   # << User_supplied_information >>
	
	can contain other instructions that PWB (actually NMAKE or NMK) is
	supposed to carry out during the MAKE cycle. All instructions that
	follow this "fence" are not changed by PWB.
	
	The following instructions detail two implementations of that "fence"
	to allow PWB to build a program that uses overlays.
	
	While the following steps appear tedious, they are simple in practice.
	
	Once the changes are made, the only time you need to edit the MAKE
	file directly is to change your overlay structure, or to add or delete
	modules. When adding or deleting modules, you must both edit the
	program list with Make.Edit Program List and modify the commands in
	the user section. If you are only modifying the overlay structure, you
	change just the user section.
	
	The overlay structure in the example is as follows:
	
	   HELLO.OBJ  (root)
	       |
	       +----A.OBJ (first  overlay)
	       |
	       +----B.OBJ (second overlay)
	
	All of the .OBJs are built from .C files with the same base name.
	
	1. Use PWB to build the program list in the normal way. This step is
	   the same for any new program list.
	
	   a. Start PWB.
	
	   b. Choose Make.Set Program List and specify a new name -- HELLO.MAK
	      in this example.
	
	   c. Add HELLO.C, A.C, and B.C to the list. (If you have additional
	      .C or .OBJ files, you would add them as well.) When all the
	      files are listed, select Set Dependencies.
	
	   d. Choose Options.Build Options and click on the Set Initial
	      Build Options button and select DOS EXE.
	
	   e. From Options.Compile Options, select the proper memory model.
	
	   f. From Options.Link Options.Set Debug Options, turn off
	      Incremental Link.
	
	   g. From the Options.Browse Options dialog box, turn Generate Browse
	      Information on.
	
	   h. Choose Make.Rebuild All to make sure that the program builds
	      properly without overlays. If it doesn't, review your work in
	      previous steps.
	
	2. Now that you have a working program list, add the non-PWB
	   information to the end.
	
	   a. Choose Make.Clear Program List so that you can edit the MAKE
	      file. Attempting to edit the current program list results in the
	      message "No-edit file may not be modified."
	
	   b. Choose File.Open to open the MAKE file so you can modify it.
	
	   c. Go to the end of the file and start a blank line.
	
	      Starting in column 1, add the following line:
	
	         # << User_supplied_information >>
	
	      Be sure to enter the line exactly as shown -- spacing is
	      significant. This line is a "fence". Everything below the fence
	      is yours and is not modified by PWB. Conversely, you should not
	      modify anything above the fence because that section belongs to PWB.
	
	   d. Below the fence starting in column one, add the pseudo-target:
	
	         OVERLAID : $(OBJS)
	
	      Be sure it starts column 1. Do not put a blank line after this line.
	
	   e. Copy the command section from the $(PROJ).EXE description block
	      to immediately follow the pseudo-target. The command section begins
	      on the line following the line that reads
	
	         $(PROJ).exe : $(OBJS)
	
	      and ends at the next blank line. Do not copy the $(PROJ).EXE
	      line, and do not leave a blank after the target. After you have
	      copied the commands, your file should appear as follows:
	
	         ... PWB section here, unmodified ...
	
	         # << User_supplied_information >>
	
	         OVERLAID : $(OBJS)
	         !IF $(DEBUG)                    # copy of commands...
	                 $(LRF) @<<$(PROJ).lrf
	         $(RT_OBJS: = +^
	         ) $(OBJS: = +^
	         )
	         $@
	         ...
	
	   f. Use the following procedure to modify the commands to link an
	      overlaid EXE instead of a normal EXE.
	
	      Note: There are two subsections in this section: a debug section
	      that starts at the first "!IF $(DEBUG)" and ends at "!ELSE", and
	      a release section that starts after the "!ELSE" and ends at the
	      first "!ENDIF".
	
	      You need to make the following modifications to both
	      subsections.
	
	      i. Delete the line that reads as follows:
	
	            ) $(OBJS: = +^
	
	         After the right parenthesis on the line that moved up, put
	         your list of .OBJ files with parentheses to indicate which
	         ones go in which overlays. If you need to use more than one
	         line for all of your objects, be sure to put a plus sign (+)
	         at the end of each line except the last.
	
	     ii. Replace "$@" on the next line with "$(PROJ).EXE".
	
	         In our example,
	
	                $(LRF) @<<$(PROJ).lrf
	            $(RT_OBJS: = +^
	            ) $(OBJS: = +^     # delete this line
	            )                  # append OBJ list here ...
	            $@                 # replace this line with $(PROJ).EXE
	
	         becomes:
	
	                $(LRF) @<<$(PROJ).lrf
	            $(RT_OBJS: = +^
	            ) hello.obj +
	            (a.obj) +
	            (b.obj)
	            $(PROJ).exe
	
	         Remember to make the changes in both branches of the !IF
	         $(DEBUG).
	
	   g. The last step is to modify the browser database build commands.
	      These are the two lines at the very end of the file that begin
	      with "$(NMAKEBSC...". PWB adds and deletes these lines in the
	      PWB section as you turn browser information on and off.
	
	      Since PWB won't delete and add these lines in the user section,
	      enclose them in !IF $(BROWSE)...!ENDIF so they'll be executed
	      only when you ask for browse information. You also need to
	      delete the "$(NMFLAGS)" macro from the second line to prevent
	      infinite NMAKE recursion.
	
	      The following lines
	
	         $(NMAKEBSC1) MAKEFLAGS=
	         $(NMAKEBSC2) $(NMFLAGS) -f $(PROJFILE) $(PROJ).bsc
	
	      become:
	
	         !IF $(BROWSE)
	             $(NMAKEBSC1) MAKEFLAGS=
	             $(NMAKEBSC2) -f $(PROJFILE) $(PROJ).bsc
	         !ENDIF
	
	      If you need special NMAKE options for building the browser
	      database, just add them where you removed $(NMFLAGS).
	
	3. Reactivate the MAKE file by selecting Make.Set Program List.
	
	4. With these changes, if you select Make.Rebuild All, you will still
	   get a non-overlaid program because PWB normally builds the first
	   target in the MAKE file. To build the overlaid program, modify the
	   command line passed to NMAKE so that NMAKE builds your overlay
	   target rather than the regular EXE. Select Options.NMAKE Options
	   and specify "OVERLAID" as the target by putting it in the NMAKE
	   options box, or use Make.Build Target.
	
	5. With "OVERLAID" in Options.NMAKE Options you can build your program
	   by either selecting Make.Rebuild All or Make.Build *.EXE, as usual.
	   If you want to build a non-overlaid program, delete "OVERLAID" from
	   the NMAKE options box.
	
	   Note that if you use debug options with overlays you will get a
	   linker warning L4047. This warning, and the dialog box that says
	   that CRT0DAT.ASM can't be found, are normal when building overlaid
	   programs for debugging and can be ignored. You can debug the overlaid
	   program normally, with full debugging information available.
	
	   This MAKE file behaves almost identically to a regular PWB MAKE
	   file. The only differences are that NMAKE options are NOT  passed
	   to the browser build unless you add them to the browser build line,
	   and that you must edit the user supplied section if you add or
	   delete modules from the project.
