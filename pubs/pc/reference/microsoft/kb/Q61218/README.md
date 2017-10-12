---
layout: page
title: "Q61218: C 6.00 README: PWB: OS/2 Long Filename Support"
permalink: /pubs/pc/reference/microsoft/kb/Q61218/
---

	Article: Q61218
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | file name
	Last Modified: 15-AUG-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	OS/2 1.20 LONG FILENAME SUPPORT
	-------------------------------
	
	OS/2 1.20 long filenames are supported in all PWB file-handling
	functions, with a couple of exceptions. This section defines long
	filenames, summarizes restrictions, and enumerates special cases.
	
	For additional information on support of long filenames, query on the
	following:
	
	   long and filenames
	
	Long Filenames
	--------------
	
	To PWB, a "long filename" is any filename containing the characters
	
	   +=[];^,
	
	Also included is any filename containing a space, or any filename
	whose base name is longer than eight characters. Long filenames can
	contain more than one period (.) and can have more than three letters
	following the final period.
	
	However, files that are intended to be used as part of the build
	process have more severe naming restrictions. To be used as part of a
	build, the filename cannot contain spaces or any of the special
	characters listed above.
	
	In addition, existing rules for specifying an extension apply: the
	extension consists of a period (.) followed by one to three
	alphanumeric characters. To avoid conflict with NMAKE, filename
	extensions should not contain any dollar signs ($).
	
	Quoted Filenames
	-----------------
	
	Any filename may be quoted anywhere. Quoting involves ONLY the
	addition of the double-quote character (") at the beginning and end of
	the complete filename, including the path. There is no escape
	character, as quotes themselves are not valid filename characters.
	Some situations may require quoting of long filenames containing
	characters that were previously illegal.
	
	Filename Length
	---------------
	
	Under OS/2 1.20, each portion of a filename is restricted in length to
	256 characters. In PWB and other utilities, the ENTIRE filename length
	is restricted to 200 characters.
	
	Extensions
	----------
	
	For build purposes, filename extensions are recognized as such ONLY if
	they are three characters or fewer in length. Thus "WAIT.C" is
	recognized as having an extension of ".C", while "WAIT.C PROGRAM" is
	treated as if it has no extension.
	
	Case Preservation
	-----------------
	
	OS/2 1.20 is case insensitive and case preserving. Thus, "File" "FILE"
	both refer to the same file, but OS/2 will not perform any case
	changes on the filenames created or copied. PWB operates similarly:
	case in filenames is preserved as typed by the user, but matches are
	made without regard to case.
	
	Exceptions
	----------
	
	Help files may not have long filenames. The Helpfiles switch,
	therefore, does not support long filenames.
	
	What to Quote
	-------------
	
	You must explicitly quote long filenames in the following situations:
	
	- Filenames inserted in a "%s" format field that could be filenames.
	  For example, if long filenames could be used, the Readonly switch,
	  under OS/2, could be set to:
	
	     readonly: attrib -r "%s"
	
	- Commands to be executed that happen to be long filenames. For
	  example, for a program named "Change Attribute", the readonly
	  command above might instead be:
	
	     readonly: "Change Attribute" -r "%s"
