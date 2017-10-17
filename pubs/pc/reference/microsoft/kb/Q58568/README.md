---
layout: page
title: "Q58568: How to Use Customize Menu Command of Utility Menu in QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q58568/
---

## Q58568: How to Use Customize Menu Command of Utility Menu in QBX.EXE

	Article: Q58568
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900118-14
	Last Modified: 26-FEB-1990
	
	This article explains how to use the Customize Menu command in the
	Utility menu in the QBX.EXE (QuickBASIC Extended) environment. The
	Customize Menu command allows you to add your own DOS commands
	(internal, external, or batch files) to the Utility menu. This
	provides easy access to these commands rather than having to shell out
	to DOS and type them in at the command line prompt.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	The following is a brief summary of the features of the Customize Menu
	dialog box:
	
	Applications List - A list of the DOS commands already included in the
	                    Utility menu.
	
	Add button        - Adds a new command to the Applications List. For
	                    details, see farther below.
	
	Edit button       - Edits the information associated with a command
	                    already in the Applications List.
	
	Delete button     - Deletes a command from the Applications List.
	
	To Begin button   - Puts the currently selected command at the top of
	                    the Applications List.
	
	To End button     - Puts the currently selected command at the bottom
	                    of the Applications List.
	
	Save button       - Saves all the changes made to the Applications
	                    List and closes the Customize Menu dialog box.
	
	Cancel button     - Cancels all the changes made to the Applications
	                    List and closes the Customize Menu dialog box.
	
	Help button       - Provides online help for using the Customize
	                    Menu command.
	
	The Customize Menu command in the Utility menu is a handy way to
	execute DOS-level commands from inside the QBX.EXE environment. It
	allows you to execute internal commands, external commands, and batch
	files by selecting a menu item with the keyboard or mouse. There is no
	need to shell out to DOS. When the command or batch file is finished,
	you can be prompted to "press any key to continue" or you can specify
	for QBX to reappear automatically.
	
	Adding, deleting, editing, and ordering commands in the Utility menu
	is very simple, and the discussion above should be adequate enough for
	every feature except the Add button, which is discussed below in
	detail.
	
	Add Button
	----------
	
	When selected, the Add button brings up another dialog box containing
	edit fields that are used to enter information about the command to be
	added. The following is a list of the edit fields and buttons of this
	dialog box and information about each one:
	
	Menu Text (20 chars) - Enter the name you want displayed in the
	                       Utility menu. This name will also appear in the
	                       Applications List. This may or may not be the
	                       name of the actual command.
	
	Pathname             - Enter the name of the command if it is internal
	                       or the full path to the file if it is external
	                       or a batch file. For example, "DIR" or
	                       "C:\CHKDSK".
	
	Arguments            - Enter the arguments passed to the command. For
	                       example, this may be "a:" if the command is
	                       "FORMAT" or "/w" if the command is "DIR", etc.
	
	Initial Directory    - Enter the name of the directory you want the
	                       command to operate in.
	
	Prompt Before        - Select this option if you want to be prompted
	Returning              with "press any key to continue" before control
	                       is returned to QBX.
	
	Accelerator Key      - Select the None button if you do not want to
	                       use an accelerator key or select the ALT+F
	                       button if you do. The values that may be
	                       entered into the box following ALT+F range from
	                       2 to 10, specifying the function keys F2
	                       through F10.
	
	OK button            - Select this button when you are satisfied with
	                       the information in the dialog box. The Add
	                       dialog box closes and the name of the new
	                       command is added to the Applications List.
	                       However, none of the changes to the Utility
	                       menu are saved unless the Save button is
	                       selected.
	
	Cancel button        - This button cancels the information entered in
	                       the edit fields and closes the Add dialog box.
	
	Help button          - This button displays more online help.
	
	Below is a step-by-step example illustrating how to use the Customize
	Menu command. This example shows how to add the DOS command "DIR" to
	the Utility menu. This DIR command operates on the current directory
	and uses the "/w" parameter to display the listing in many columns
	rather than one. Also, an accelerator key (ALT+F5) is linked to the
	command for easy keyboard access and the user is prompted to "press
	any key to continue" after the DIR command is finished.
	
	 1. Choose Customize Menu from the Utility menu. This can be done by
	    holding down the ALT and U keys together, followed by the C key
	    alone.
	
	 2. The Customize Menu dialog box appears. Press the TAB key once to
	    highlight the Add button and then press ENTER.
	
	 3. Another dialog box appears, containing edit fields used to enter
	    information about the command. The cursor is placed in the top
	    edit field, "Menu Text (20 chars)." Type in "DIR" for this field
	    and press TAB.
	
	 4. The cursor advances to the next edit field, "Pathname". Since DIR
	    is an internal command, it has no path, so you only need to enter
	    the name of the command by itself, "DIR". Do this and press TAB
	    again.
	
	 5. The next edit field is "Arguments". A common argument to pass to
	    the DIR command is "/w".  The "/w" argument (called a switch)
	    breaks the directory listing into columns rather than listing them
	    in one long column, which frequently scrolls off the screen. Type
	    "/w" and press TAB.
	
	 6. For the "Initial Directory" edit field, you can enter any valid
	    pathname. Leaving this field blank causes the command to use the
	    current pathname. Press TAB to leave it blank.
	
	 7. The cursor is now placed inside the button titled "Prompt Before
	    Returning." You can press SPACEBAR to toggle this button on or
	    off. Toggle it on and press TAB.
	
	 8. The cursor advances to the button titled "None". By default it is
	    also selected, specifying that no accelerator key is to be defined
	    for accessing the DOS command from the Utility menu. To enter an
	    accelerator key, press the RIGHT ARROW. This toggles the None
	    button off and the ALT+F button on. Press TAB to advance the
	    cursor to the edit field following the ALT+F button and enter a 5
	    (specifying F5). Press ENTER to continue.
	
	 9. The current dialog box closes and the main Customize Menu dialog
	    box reappears. You will see that "DIR" has been added to the
	    Applications List. Press TAB until the Save button is highlighted,
	    then press ENTER.
	
	10. The Customize Menu dialog box closes. You can now choose the DIR
	    command from the Utility menu either by pulling down the menu and
	    then choosing DIR or you can use the accelerator key sequence,
	    ALT+F5. After displaying the contents of the current directory, you
	    will be prompted with "press any key to continue" before control is
	    returned to QBX.
