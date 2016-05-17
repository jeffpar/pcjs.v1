---
layout: page
title: PC-DOS 1.00 Documentation
permalink: /pubs/pc/software/dos/PCDOS100/
---

PC-DOS 1.00 Documentation
---

Below is a copy of the IBM PC-DOS 1.00 manual.  The original [PC-DOS 1.00](/disks/pcx86/dos/ibm/1.00/) diskette is also available.

[<img src="http://archive.pcjs.org/pubs/pc/software/dos/PCDOS100/thumbs/PCDOS100.jpg" width="200" height="260" alt="IBM PC Disk Operating System v1.00"/>](http://bitsavers.trailing-edge.com/pdf/ibm/pc/dos/6172220_DOS_1.0_Jan82.pdf)

Summary of internal commands:

* COPY
	* Copies one or more files to another diskette and optionally, gives the copy a different name if you specify it in the COPY command.
* DIR
	* Either lists all the directory entries, or only lists those for specified files. The information provided in the display for each file includes its size in decimal bytes and the date the file was last written to.
* ERASE
	* Deletes the file with the specified filename from the designated drive, or deletes the file from the default drive if no drive was specified.
* PAUSE
	* Suspends system processing and issues the message **Strike·a key when ready...**.
* REM
	* Displays remarks from within a batch file.
* RENAME
	* Changes the name of the file specified in the first parameter to the name and extension given in the second parameter. If a valid drive is specified in the second parameter, the drive is ignored.
* TYPE
	* Displays the contents of the specified file on the screen.

Summary of external commands:

* BASIC
	* Also known as Disk BASIC, this program requires an IBM PC with Cassette BASIC and at least 32Kb of RAM.
* BASICA
	* Also known as Advanced BASIC, this program requires an IBM PC with Cassette BASIC and at least 48Kb of RAM.  It includes all Disk BASIC features, along with event trapping, advanced graphics, and advanced music support.
* CHKDSK
	* Analyzes the directory and the File Allocation Table on the designated or default drive and produces a diskette and memory status report.
* COMP
	* Compares the contents of one file to the contents of another file.
* DATE
	* Permits you to enter a date or change the date known to the system. The date is recorded in the directory entry for any files you create or alter.
* DISKCOMP
	* Compares the contents of the diskette in the first drive to the contents of the diskette in the second drive. Usually, you would run DISKCOMP after a DISKCOPY operation to ensure that the two diskettes are identical.
* DISKCOPY
	* Copies the contents of the diskette in the source drive to the diskette in the target drive.
* FORMAT
	* Initializes the diskette in the designated or default drive to a recording format acceptable to DOS; analyzes the entire diskette for any defective tracks; and prepares the diskette to accept DOS files by initializing the directory, File Allocation Table, and system loader.
* MODE
	* Sets the mode of operation on a printer or on a display connected to the Color/Graphics Monitor Adapter.
* SYS
	* Transfers the operating system files from the default drive to the specified drive, in the following order: IBMBIO.COM, IBMDOS.COM.
* TIME
	* Permits you to enter or change the time known to the system. You can change the time from the console or from a batch file.

Additional utilities:

* EDLIN is a line text editor which can be used to:
	+ Create new source files and save them.
	+ Update existing files and save both the updated and original files.
	+ Delete, edit, insert, and display lines.
	+ Search for, delete, or replace text within one or more lines.
* LINK is a program that:
	+ Combines separately produced object modules.
	+ Searches library files for definitions of unresolved external references.
	+ Resolves external cross-references.
	+ Produces a printable listing that shows the resolution of external references and error messages.
	+ Produces a relocatable load module.
* DEBUG is a program that can be used to:
	+ Provide a controlled test environment so you can monitor and control the execution of a program to be debugged. You can fix problems in your program directly and then execute the program immediately to determine if the problems have been resolved, You do not need to reassemble a program to find out if your changes worked.
	+ Load, alter, or display any file.
	+ Execute *object files*. Object files are executable programs in machine language format.

Notes:

* Directory entries for system files IBMBIO.COM, IBMDOS.COM, and BADTRACK are not listed, even if present.
