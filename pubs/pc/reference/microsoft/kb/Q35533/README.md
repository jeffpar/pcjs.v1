---
layout: page
title: "Q35533: &quot;Unable to Open Swapping File c:&#92;temp&#92;m-0029.vm&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q35533/
---

## Q35533: &quot;Unable to Open Swapping File c:&#92;temp&#92;m-0029.vm&quot;

	Article: Q35533
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | appnote
	Last Modified: 6-JAN-1989
	
	The following information is taken from an application note called
	"Microsoft Editor Questions and Answers." The application note also is
	available from Microsoft Product Support Services by calling (206)
	454-2030.
	
	"Unable to Open Swapping File c:\temp\m-0029.vm No Such File or
	Directory" Error
	
	The editor assumes that environment variables are set so that
	important editor information can be loaded from and saved to your
	disk. The following is an example:
	
	   SET INIT=c:\init
	   SET TMP=c:\temp
	
	In this example, c:\temp would be the directory that would hold
	temporary or swapping files, usually named M-0029.VM. This file is
	used to allow the editor to switch to previous files. C:\INIT would
	hold TOOLS.INI and M.TMP. The swapping file also would be stored here
	if the TMP variable was not set. If neither of these variables is
	set, the swapping file would be stored in the root directory and M.TMP
	would be stored in the current directory.
	
	However, if the TMP variable is set to a directory that does not
	exist, or if extra characters were included after the "p" in "c:\temp"
	such as a space or a semicolon, the swapping file will not be created
	and the error above will be generated.
