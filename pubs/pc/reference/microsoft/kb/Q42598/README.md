---
layout: page
title: "Q42598: RDFILE.C And WRFILE.C Are Incorrect in QuickC's On-Line Help"
permalink: /pubs/pc/reference/microsoft/kb/Q42598/
---

## Q42598: RDFILE.C And WRFILE.C Are Incorrect in QuickC's On-Line Help

	Article: Q42598
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | langdoc docerr
	Last Modified: 2-MAY-1989
	
	The sample programs WRFILE.C, on Page 179, and RDFILE.C, on Page 181,
	in the "C for Yourself" manual that comes with Microsoft QuickC
	Version 2.00 are correct. However, when you pull up those examples
	from the on-line help, you will notice that the fopen() function calls
	are incorrect. The single backslash ("\") should be replaced by a
	double backslash ("\\").
	
	To access the on-line examples, do the following:
	
	1. Enter the QuickC environment.
	
	2. Choose the Help menu.
	
	3. Choose Contents.
	
	4. Choose C for Yourself Programs.
	
	You should see quite a few files listed. To bring up the file WRFILE.C
	or RDFILE.C, move the cursor to that file and press ENTER, or double
	click the right mouse button. In both files, you need to change the
	line containing the fopen() function. Change the first parameter in
	the function call from
	
	   c:\testfile.asc
	
	to
	
	   c:\\testfile.asc
	
	Now the file will compile, link, and run correctly.
