---
layout: page
title: "Q69216: How to Change Attributes of Subdirectories in a C Program"
permalink: /pubs/pc/reference/microsoft/kb/Q69216/
---

	Article: Q69216
	Product: Microsoft C
	Version(s): 3.x 4.x 5.x 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                 | OS/2
	Flags: ENDUSER |
	Last Modified: 25-FEB-1991
	
	The C run-time functions _dos_setfileattr() and _dos_getfileattr(), or
	the OS/2 API calls DosSetFileMode() and DosQFileMode(), respectively,
	allow you to set and check the attributes of files. When using the
	same functions on subdirectories, the operating system does not allow
	attributes to be set, and no error codes are returned. However,
	because a subdirectory is a special instance of a file, the system can
	be fooled into thinking that a subdirectory is a file, which will
	allow you to set the attributes of a subdirectory.
	
	Below is a listing of available attribute settings:
	
	   C Run-Time   OS/2            Description                  Value
	   ----------   ----            -----------                  -----
	
	   _A_NORMAL    FILE_NORMAL     A file with no attributes    0x00
	   _A_RDONLY    FILE_READONLY   A read-only file             0x01
	   _A_HIDDEN    FILE_HIDDEN     A hidden file                0x02
	   _A_SYSTEM    FILE_SYSTEM     A system file                0x04
	   _A_VOLID     *               Volume label (special case)  0x08
	   _A_SUBDIR    FILE_DIRECTORY  Subdirectory (special case)  0x10
	   _A_ARCH      FILE_ARCHIVED   An archived file             0x20
	
	 * A drive's volume label is another special-case file; there is only
	   one per (logical) drive, and it is only in the root directory.
	   Under OS/2, volume labels can be changed with DosSetFSInfo. Under
	   DOS, there are no C run-time functions to change drive volumes. For
	   more information, query on the following words:
	
	      volume and attribute and 5.10
	
	From the list above, the only attributes that can be dynamically set
	are FILE_READONLY, FILE_HIDDEN, and FILE_SYSTEM (all files,
	subdirectories, and volumes entail FILE_NORMAL), and this process
	cannot be done on a directory entry that is flagged as a subdirectory
	or volume label. To change the attributes of a subdirectory, the
	attribute flag _A_SUBDIR (or FILE_DIRECTORY) should not be included.
	The code below demonstrates how to do this using either C run-time
	calls (DOS only) or OS/2 API functions (DOS and OS/2 if bound).
	
	Sample Code
	-----------
	
	#define INCL_DOSFILEMGR
	#include <os2.h>
	
	#include <dos.h>
	#include <stdlib.h>
	
	unsigned attr, newattr;
	
	void main(void)
	{
	   if (DOS_MODE == _osmode)
	      {
	      // First get the current attribute of subdirectory '\foo'
	      // If successful, 'attr' will contain at least the
	      // _A_SUBDIR bit mask
	
	      _dos_getfileattr( "\\foo", &attr );
	
	      // Mask in new attributes and remove _A_SUBDIR from the old
	      // attribute
	
	      newattr = (attr | _A_HIDDEN | _A_SYSTEM | _A_RDONLY)
	                  & ~_A_SUBDIR;
	
	      // Set new attribute for 'foo'
	
	      _dos_setfileattr( "\\foo", newattr );
	      }
	   else     // Here is the same using OS/2 APIs
	      {
	      DosQFileMode( "\\foo", &attr, 0L );
	
	      newattr = (attr | FILE_HIDDEN | FILE_SYSTEM | FILE_READONLY)
	                  & ~FILE_DIRECTORY;
	
	      DosSetFileMode( "\\foo", newattr, 0L );
	      }
	}
