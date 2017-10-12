---
layout: page
title: "Q47692: errno Values Not Used under MS-DOS Indicate Other Problem"
permalink: /pubs/pc/reference/microsoft/kb/Q47692/
---

	Article: Q47692
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC
	Last Modified: 9-AUG-1989
	
	When an error occurs in some library routines, the errno variable is
	set to a value that can be used to indicate the nature of the error.
	These error codes are defined in the file errno.h. The codes
	originally were set up for use with UNIX to conform to errors
	occurring under that operating system. Because of this, and the
	differences between MS-DOS and UNIX, many of the codes have no
	relevance to the MS-DOS environment.
	
	In order to maintain compatibility with UNIX and XENIX, all the codes,
	whether meaningful in MS-DOS or not, are defined in errno.h. Appendix
	A of the "Microsoft C 5.1 Optimizing Compiler Run-Time Library
	Reference" lists only those codes that have meaning under MS-DOS along
	with their description and causes. These specific codes have
	corresponding error messages that can be printed out with the perror
	function.
	
	If you are working under MS-DOS and you obtain an errno value that is
	not one of the listed codes, then you can assume that the code was
	generated incorrectly and it is not indicative of the true problem.
	The documentation for the specific function you are using says which
	errno values, if any, may be set by an error in that function.
	
	The following is a listing of all the errno values defined in errno.h
	along with brief descriptions of their meanings. Only the values that
	are marked with "*" may be considered valid under DOS. For more
	information on these, see Appendix A of the "Microsoft C 5.1
	Optimizing Compiler Run-Time Library Reference." For more information
	on the others that are not marked with an asterisk (*), see a UNIX or
	XENIX system manual.
	
	* Used under MS-DOS
	
	Value     Define      Description
	-----     ------      -----------
	
	EPERM         1       Not owner
	ENOENT        2      *No such file or directory
	ESRCH         3       No such process
	EINTR         4       Interrupted system call
	EIO           5       I/O error
	ENXIO         6       No such device or address
	E2BIG         7      *Arg list too long
	ENOEXEC       8      *Exec format error
	EBADF         9      *Bad file number
	ECHILD       10       No child processes
	EAGAIN       11       No more processes
	ENOMEM       12      *Not enough space
	EACCES       13      *Permission denied
	EFAULT       14       Bad address
	ENOTBLK      15       Block device required
	EBUSY        16       Mount device busy
	EEXIST       17      *File exists
	EXDEV        18      *Cross-device link
	ENODEV       19       No such device
	ENOTDIR      20       Not a directory
	EISDIR       21       Is a directory
	EINVAL       22      *Invalid argument
	ENFILE       23       File table overflow
	EMFILE       24      *Too many open files
	ENOTTY       25       Not a teletype
	ETXTBSY      26       Text file busy
	EFBIG        27       File too large
	ENOSPC       28      *No space left on device
	ESPIPE       29       Illegal seek
	EROFS        30       Read-only file system
	EMLINK       31       Too many links
	EPIPE        32       Broken pipe
	EDOM         33      *Math argument
	ERANGE       34      *Result too large
	EUCLEAN      35       File system needs cleaning
	EDEADLOCK    36      *Would deadlock
