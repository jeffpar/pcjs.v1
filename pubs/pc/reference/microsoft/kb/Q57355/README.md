---
layout: page
title: "Q57355: Colored Buttons/Scroll Bars in BASIC 7.00 UI Toolbox"
permalink: /pubs/pc/reference/microsoft/kb/Q57355/
---

## Q57355: Colored Buttons/Scroll Bars in BASIC 7.00 UI Toolbox

	Article: Q57355
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S891207-109
	Last Modified: 14-JAN-1990
	
	The User Interface (UI) Toolbox supplied with Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 allows you to display scroll bars in windows. However, it has no
	facility for specifying foreground and background colors for them and
	always uses white and black, respectively. This limitation can be
	removed by modifying two COLOR statements in the ButtonShow procedure
	of the WINDOW.BAS toolbox file and adding a COMMON SHARED statement to
	the module-level code of that same file.
	
	The ButtonShow procedure of the WINDOW.BAS toolbox file is called when
	a button (which includes scroll bars) is to be displayed in a window.
	As written, the ButtonShow procedure does not allow regular buttons to
	have a different color than the window text and scroll bars are
	limited to a white foreground and black background.
	
	The colors of regular buttons can be specified through the use of the
	WindowColor procedure, which changes the colors used for window text.
	The colors used for window text are the same as those used for
	buttons.
	
	The COLOR statement used to color scroll bars is as follows:
	
	   COLOR 0,7
	
	There are two of these COLOR statements in the ButtonShow procedure,
	one for horizontal scroll bars and one for vertical scroll bars. Both
	of them need to be changed to the following statement:
	
	   COLOR ScrollBarForeground%, ScrollBarBackground%
	
	Here ScrollBarForeground and ScrollBarBackground are sample names for
	integer variables and may be differently named. However, they must be
	unique throughout the entire program because they will be COMMON
	SHARED between the module opening a button and the WINDOW.BAS module.
	Therefore, at the module-level code of both of those modules, insert
	the following statements:
	
	   COMMON SHARED /ScrollBarColors/ ScrollBarForeground%
	   COMMON SHARED /ScrollBarColors/ ScrollBarBackground%
	
	Here ScrollBarColors is an sample name for a named COMMON block and
	may be different. However, the name of the COMMON block must be the
	same in both modules and the data types of the variables must be
	integer. To prevent confusion, the same names used in the COLOR
	statements should be used in the COMMON SHARED statements.
	
	After the above changes have been made, you can specify what the
	foreground and background colors of each scroll bar will be by
	assigning color numbers to the variables in the named COMMON block.
	The variables do not need to be passed to the ButtonShow procedure
	because they are COMMON SHARED with the WINDOW.BAS module. The COLOR
	statement will always have access to them.
	
	Code Example
	------------
	
	The following code fragment is an example of specifying colors for a
	scroll bar:
	
	'The following COMMON SHARED statements would also appear in the
	'module-level code of the WINDOW.BAS module.
	
	COMMON SHARED /ScrollBarColors/ ScrollBarForeground%
	COMMON SHARED /ScrollBarColors/ ScrollBarBackground%
	
	ScrollBarForeground% = 14   'yellow foreground.
	ScrollBarBackground% = 1    'blue background.
	
	'The ButtonOpen procedure will call the ButtonShow procedure,
	'which will use the values in ScrollBarForeground% and
	'ScrollBarBackground% to COLOR the scroll bar.
	
	CALL ButtonOpen (1, 1, "", 10, 30, 20, 30, 6)
