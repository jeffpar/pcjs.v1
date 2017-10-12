---
layout: page
title: "Q50793: Why After Edit, fopen with Mode "a" Doesn't Appear to Append"
permalink: /pubs/pc/reference/microsoft/kb/Q50793/
---

	Article: Q50793
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickASM
	Last Modified: 30-NOV-1989
	
	Problem:
	
	If I use edlin or Wordstar to edit a file, then call the fopen
	routine with the "a" option and append to the file, the appended
	text doesn't show up when I type the file.
	
	Response:
	
	Edlin and Wordstar are examples of editors that place a CTRL+Z
	character at the end of the file. Opening a file with the "a" option
	writes to the file beginning after the last character in the file (in
	this case, the CTRL+Z). If you then edit the file again with the same
	editor, the editor ignores all characters after the CTRL+Z.
	
	The DOS TYPE command will display all characters up to the first EOF.
	However, if you bring the file up in the M editor or Word, which
	display the CTRL+Z character as a normal character, you can see the
	appended text and, if you want, delete the CTRL+Z character.
	
	If you fopen a file with the "a+" mode, the CTRL+Z character is
	deleted at the end of the file, and appended text can be seen in any
	editor or by using the DOS TYPE command.
	
	The following code demonstrates this behavior:
	
	#include <stdio.h>
	#include <time.h>
	
	void main(void)
	{
	     FILE *fp;
	     int num;
	     time_t system_time;
	
	     fp = fopen("out.dat","a");          /* change to "a+" to fix */
	     time(&system_time);                 /* to demonstrate last append */
	     num = fprintf(fp, "Writing to file at %s\n",
	                         ctime(&system_time));
	     num = fclose(fp);
	}
	
	Run this program once to write the current system time to the output
	file. Then edlin "out.dat". You do not need to add any lines, just
	open the file and then end the session. Then run the program again.
	Type "out.dat", and notice that you still see only the first output
	time.
	
	Changing the fopen "a" to "a+" and rebuilding the program will
	demonstrate the solution.
