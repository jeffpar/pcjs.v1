---
layout: page
title: "Microsoft OS/2 Programmer's Learning Guide: Input and Output"
permalink: /pubs/pc/software/os2/microsoft/ptk10/plguide/chapter3/
---

[Microsoft OS/2 Programmer's Learning Guide](../)
---

Input and Output
---

### 3.1 Introduction

Input and output are two of the most important tasks that any program carries out. This chapter explains how
to read from and write to files on disks and other input and output devices, such as printers, modems, and the
system console.

### 3.2 Opening Files

Before carrying out any input or output operation, you need a file handle. A file handle is a 16-bit value
that identifies the file or device that you want to read from or write to. You can create a file handle by using
the **DosOpen** function, which opens the specified file and returns a file handle for it. For example, in the
following statements, **DosOpen** opens the existing file *simple.txt* for reading and copies the file handle to the
*hf* variable:

	HFILE hf;
	USHORT usResult;
	
	DosOpen("simple.txt",   /* filename                     */     
	    &hf,                /* file handle                  */
	    &usResult,          /* action taken                 */
	    0,                  /* size                         */
	    0,                  /* file attribute               */
	    0x0001,             /* open method                  */
	    0x0040,             /* access and sharing method    */
	    0);                 /* reserved                     */

If the **DosOpen** function opens the file, it copies the file handle to the *hf* variable and copies a value to
the *usResult* variable to indicate what action was taken (for example, 0x0001 for "existing file opened"). To open
an existing file, a size and file attribute are not needed, so the fourth and fifth arguments are set to zero.
The sixth argument, 0x0001, directs **DosOpen** to open the file if it exists or to return an error if it does not
exist. The next argument, 0x0040, directs **DosOpen** to open the file for reading only and let other programs open
the file even while the current program has it open. The final argument is reserved and should always be zero.

The **DosOpen** function indicates that it successfully opened the file by returning zero. You can then use the file
handle returned in the *hf* variable in subsequent functions to read data from the file or to check the status or
other characteristics of the file. If **DosOpen** fails to open the file, it returns an error value. For example,
if the file cannot be found in the current directory, the function returns the value 0x0002.

When you open a file, you must specify whether you want to read from the file, write to it, or both read and write.
You must also specify whether you want other processes to have access to the file while you have it open. You do this
by combining two values. These values specify the access and sharing methods and are described in the following list:

**Value**          | **Meaning**
:----------------- | :-------------
0x0000             | Open a file for reading.
0x0001             | Open a file for writing.
0x0002             | Open a file for reading and writing.
0x0010             | Open a file for exclusive use, denying read and write access by other processes.
0x0020             | Deny write access to a file by other processes.
0x0030             | Deny read access to a file by other processes.
0x0040             | Open a file with no sharing restrictions, granting read and write access to all processes.
                   |

In general, you may combine any access method (read, write, or read and write) with any sharing method
(deny reading, deny writing, deny reading and writing, or grant any access). Some combinations have to be
handled carefully, however, such as opening a file for writing without denying access to it by other processes.

### 3.3 Reading and Writing to Files

Once you have opened a file and have a file handle, you can read from or write to the file by using the
**DosRead** or **DosWrite** function. The **DosRead** function copies a specified number of bytes (up to the
end of the file) from the file to the buffer you specify. The **DosWrite** function copies bytes from a buffer
to the file.

To read from a file, you must open it for reading, or reading and writing. The following example shows how to
open the file named *sample.txt* and read the first 512 bytes from it:

	HFILE hf;
	USHORT usResult;
	BYTE abBuffer[512];
	USHORT cbRead;
	
	if (!DosOpen("sample.txt", &hf, &usResult, 0, 0,
	        0x0001, 0x0040, 0)) {
	    DosRead(hf, abBuffer, 512, &cbRead);
	    DosClose(hf);
	}

If the file does not have 512 bytes, **DosRead** reads up to the end of the file and copies the number of bytes
read to the *cbRead* variable. If the function has already read to the end of the file and there are no more bytes
to read, it copies zero to the *cbRead* variable.

To write to a file, you must open it first for writing, or for reading and writing. The following example shows
how to open the file *sample.txt* again and write 512 bytes to it:

	HFILE hf;
	USHORT usResult;
	BYTE abBuffer[512);
	USHORT cbWritten;
	
	if (!DosOpen("sample.txt", &hf, &usResult, 0, 0,
	        0x0011, 0x0041, 0)) {
  	    DosWrite(hf, abBuffer, 512, &cbWritten);
	    DosClose(hf);
	}

The **DosWrite** function writes the contents of the buffer to the file. If it fails to write 512 bytes
(for example, if the disk is full), the function copies the number of bytes written to the *cbWritten* variable.

### 3.4 Creating a File

You can also create new files by using the **DosOpen** function. Once you have created a new file, you may read
from or write to it just as you would with an existing file.

To create a new file, set the sixth parameter to the value 0x0010. The **DosOpen** function then creates the file
if it does not already exist. In the following example, the **DosOpen** function creates the file *newfile.txt*:

	HFILE hf;
	USHORT usResult;
	
	DosOpen("newfile.txt",   /* filename                              */
	    &hf,                 /* file handle                           */
	    &usResult,           /* action taken                          */
	    0,                   /* size                                  */
	    0x0000,              /* normal file attribute                 */
	    0x0010,              /* Creates the file if it does not exist */
	    0x0011,              /* write access, share with none         */
	    0);

In this example, **DosOpen** creates the file and opens it for writing. Note that the sharing method denies
any access to all processes, so no other process can open the file while it remains open. The new file is empty
(it contains no data).

When a new file is created, the attribute argument (fifth) specifies the file attribute. In the preceding example,
the attribute argument is 0x0000, so the file is created as a normal file. Other possible file attributes are
read­only and hidden, which correspond to the values 0x0001 or 0x0002, respectively.

The file attribute affects how other processes access the file. For example, if the file is read-only, no process
may open the file for writing. The one exception to this rule is that the process that creates the read-only file
may write to it immediately after creating it. After closing the file, however, the process may not open it for
writing again.

When a file is created, the size argument (fourth) specifies the original size of the new file. For example,
if 256 is specified, the new file is 256 bytes long. These 256 bytes, however, are undefined. It is up to the
program to write valid data to the file. In any case, no matter what size you specify, subsequent calls to the
**DosWrite** function copy data to the beginning of the file.
