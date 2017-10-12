---
layout: page
title: "Q38266: Error C1015 Cannot Open Include File 'filename'"
permalink: /pubs/pc/reference/microsoft/kb/Q38266/
---

	Article: Q38266
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 30-NOV-1988
	
	The error below is from "Fatal-Error Messages" in the "Microsoft
	QuickC Compiler Programmer's Guide," Section D.1.1, Page 315, and in
	the file ERRMSG.DOC found on the Compiler Disk 1 for Microsoft C
	Optimizing Compiler Version 5.10 and on the Setup Disk for Version
	5.00. It is not in the "Microsoft C Optimizing Compiler User's Guide."
	
	The following is the error:
	
	C1015       cannot open include file 'filename'
	
	            The given file either did not exist, could not be opened,
	            or was not found. Make sure your environment settings are
	            valid and that you have given the correct path name for
	            the file.
	
	The compiler cannot recover from a fatal error; it terminates after
	printing the error message.
	
	Some causes of this error include the following:
	
	1. Incorrectly set environment variables, especially TMP and INCLUDE.
	   This error can occur if the INCLUDE environment variable has not
	   been set correctly for your include file directory, or if spaces or
	   other syntax errors are in the setting.
	
	2. Improper file handles setting. If the files= line in CONFIG.SYS is
	   not high enough, this error will occur. If not set at all, the
	   default is usually 8, which is too few. If it is set to greater
	   than 20 and the DOS version cannot support that number, it will
	   default to 8. File handles will typically be used during
	   compilation and linkage by the CL driver, the compiler passes, the
	   C source code file, the include files, the linker, libraries, and
	   temporary files created by the compiler or linker.
