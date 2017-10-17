---
layout: page
title: "Q51326: tmpfile() Creates Temporary File in the Root Directory"
permalink: /pubs/pc/reference/microsoft/kb/Q51326/
---

## Q51326: tmpfile() Creates Temporary File in the Root Directory

	Article: Q51326
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC Novell docsup
	Last Modified: 30-NOV-1989
	
	The Microsoft C Version 5.10 run-time library function tmpfile()
	creates a temporary file in the root directory of the current drive.
	This file has read/write access and is automatically deleted when the
	file is closed.
	
	The documentation for this function implies that the file will be
	created in the current working directory. This is not the case; the
	file will exist only in the root directory. To create a temporary file
	in a different directory, use the functions tmpname() or tempname() in
	conjunction with fopen().
	
	Some obscure side effects can occur on some systems as a result of
	tmpfile() creating a file in the root directory. On a network, you
	must have read/write privileges for the root directory of your current
	drive. Without these rights, tmpfile() will fail to open the temporary
	file, returning a NULL in the process.
	
	Another possible reason tmpfile() might fail is if the root directory
	is full. DOS only allows a limited amount of file entries in the root
	directory depending on the disk format; therefore, if the root is
	full, you must delete some files before you use tmpfile().
