---
layout: page
title: "Q60028: Changing Directory Name with rename() May Not Work As Expected"
permalink: /pubs/pc/reference/microsoft/kb/Q60028/
---

	Article: Q60028
	Product: Microsoft C
	Version(s): 5.00 5.10 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 19-APR-1990
	
	If you use the rename() function to change a subdirectory name, you
	will discover that some versions of DOS will not allow you to change
	the directory name on another drive if the directory name you want to
	change is the current working directory for that drive. In addition,
	other versions of DOS may return a success value, but you may find
	that the directory name apparently hasn't changed.
	
	With DOS Versions 3.x without SHARE.EXE, the sample program shown
	below produces the following results:
	
	   C:\>cd olddir
	   C:\OLDDIR>d:
	   D:>test
	   Rename is successful  <--- Output from test program
	   D:>c:
	   C:\OLDDIR>      <--- The old directory is not renamed
	
	With DOS Versions 4.x, DOS Versions 3.x with SHARE.EXE loaded, or the
	DOS box in OS/2, the same program returns the following results:
	
	   C:\>cd olddir
	   C:\OLDDIR>d:
	   D:>test
	   Rename fails with errno = 13  <--- Output from test program
	   D:>c:
	   C:\OLDDIR>            <--- The old directory is not renamed
	
	Note: The errno code indicates an access violation.
	
	The following is the sample program:
	
	#include <io.h>
	#include <stdio.h>
	
	char szOldName[] = "c:\\olddir";
	char szNewName[] = "c:\\newdir";
	
	extern int errno;
	
	void main (void)
	{
	   if (0 != rename(szOldName, szNewName)
	      printf("Rename fails with errno = %d\n", errno);
	   else
	      printf("Rename is successful\n");
	}
	
	There is nothing wrong with the rename() function. It merely maps out
	to the Interrupt 21h, Function 56h (Rename File) call. The problem is
	that the operating system keeps a list in memory of the current
	working directories (CWD) for each drive in its drive table.
	
	In the case of the example under DOS 3.x, the directory name is
	changed. However, because DOS does not recognize the change, it does
	not update the in-memory table to the new CWD. Therefore, when you
	return from the program, you see the invalid prompt with the old
	directory name. If you type "CD\NEWDIR", the directory name will be
	updated in memory also.
	
	In the second example, DOS 4.x, DOS 3.x with SHARE.EXE, and the OS/2
	DOS box can't assume that the directory is not in use by another
	process and hence the access violation error.
	
	The workaround in both cases is to issue a chdir() on the drive where
	the target directory resides to set that drive to the root directory
	[for example, chdir("c:\\");]. In this case, there is no chance of
	getting an access violation (at least not for the above reasons).
	
	A variant of this workaround is to change to the drive in question and
	issue a getcwd() call to see if changing the directory is even
	necessary.
