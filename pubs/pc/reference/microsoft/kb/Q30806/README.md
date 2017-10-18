---
layout: page
title: "Q30806: MASM 5.10 OS2.DOC: OS/2 Call Summary - File Management"
permalink: /pubs/pc/reference/microsoft/kb/Q30806/
---

## Q30806: MASM 5.10 OS2.DOC: OS/2 Call Summary - File Management

	Article: Q30806
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	File management constant - INCL_DOSFILEMGR
	
	   @DosOpen - Opens a file (creating it if necessary)
	   Parameters - FileName:PZ, Handle:PW, ActionTaken:PW, Size:D,
	                FileAttribute:W, OpenFlag:W, OpenMode:@, Reserved:D
	
	   @DosClose - Closes a file handle
	   Parameters - FileHandle:W
	
	   @DosRead - Reads bytes from a file to a buffer
	   Parameters - FileHandle:W, BufferArea:PB, BufferLength:W, ByteRead:PW
	
	   @DosWrite - Writes bytes synchronously from a buffer to a file
	   Parameters - FileHandle:W, BufferAddress:PB, BufferLength:W,
	                BytesWritten:PW
	
	   @DosDelete - Deletes a file
	   Parameters - FileName:PZ, Reserved:D
	
	   @DosDupHandle - Returns a new duplicate file handle for an open file
	   Parameters - OldFileHandle:W, NewFileHandle:PW
	
	   @DosQFHandState - Gets the state of the specified file
	   Parameters - FileHandle:W, FileHandleState:PW
	
	   @DosSetFHandState - Sets the state of a file
	   Parameters - FileHandle:W, FileHandleState:W
	
	   @DosQHandType - Determines whether a handle references a file or a device
	   Parameters - FileHandle:W, HandType:PW, FlagWord:PW
	
	   @DosReadAsync - Reads bytes from a file to a buffer asynchronously
	   Parameters - FileHandle:W, RamSemaphore:PD, ReturnCode:PW, BufferArea:PB,
	                BufferLength:W, BytesRead:PW
	
	   @DosWriteAsync - Writes bytes asynchronously from a buffer to a file
	   Parameters - FileHandle:W, RamSemaphore:PD, ReturnCode:PW,
	                BufferAddress:PB, BufferLength:W, BytesWritten:PW
	
	   @DosFindFirst - Finds the first directory entry matching a file
	                   specification
	   Parameters - FileName:PZ, DirHandle:PW, Attribute:W, ResultBuf:PS
	                ResultBufLen:W, SearchCount:PW, Reserved:D
	   Structure - FILEFINDBUF
	
	   @DosFindNext - Finds the next directory entry matching a file specificatio
	   Parameters - DirHandle:W, ResultBuf:PS, ResultBufLen:W, SerachCount:PW
	   Structure - FILEFINDBUF
	
	   @DosFindClose - Closes a directory search handle
	   Parameters - DirHandle:W
	
	   @DosNewSize - Changes the size of a file
	   Parameters - FileHandle:W, Size:D
	
	   @DosBufReset - Flushes a file buffer and updates directory information
	   Parameters - FileHandle:W
	
	   @DosChgFilePtr - Moves the read/write pointer according to a specified
	                    method
	   Parameters - FileHandle:W, Distance:D, MoveType:W, NewPointer:PD
	
	   @DosFileLocks - Locks or unlocks a range in an open file
	   Parameters - FileHandle:W, UnlockRange:PD, LockRange:PD
	
	   @DosMove - Moves (or renames) a specified file
	   Parameters - OldFilename:PZ, NewFileName:PZ, Reserved:D
	
	   @DosMkdir - Creates a directory
	   Parameters - DirName:PZ, Reserved:D
	
	   @DosRmdir - Removes a subdirectory from a disk
	   Parameters - DirName:PZ, Reserved:D
	
	   @DosSelectDisk - Selects a specified drive as the new default drive
	   Parameters - DriveNumber:W
	
	   @DosQCurDisk - Returns the current drive
	   Parameters - DriveNumber:PW, LogicalDriveMap:PD
	
	   @DosChdir - Changes to a specified directory
	   Parameters - DirName:PZ, Reserved:D
	
	   @DosQCurDir - Retrieves the full path of the current directory
	   Parameters - DriveNumber:W, DirPath:PB, DirPathLen:PW
	
	   @DosQFSInfo - Retrieves information from a file system device
	   Parameters - DriveNumber:W, FSInfoLevel:W, FSInfoBuf:PB, FSInfoBufSize:W
	   Structure - For GDInfoLevel 1, point FSInfoBuf to FSALLOCATE
	
	   @DosSetFSInfo - Sets information for a file system device
	   Parameters - DriveNumber:W, FSInfoLevel:W, FSInfoBuf:PB, FSInfoBufSize:W
	
	   @DosQVerify - Returns the value of the verify flag
	   Parameters - VerifySetting:PW
	
	   @DosSetVerify - Sets the verify flag
	   Parameters - VerifySetting:W
	
	   @DosSetMaxFH - Defines the maximum number of file handles
	   Parameters - NumberHandles:W
	
	   @DosQFileInfo - Returns information about a file
	   Parameters - FileHandle:W, FileInfoLevel:W, FileInfoBuf:PB,
	                FileInfoBufSize:B
	   Structure - At FileInfoLevel 1, can point FileInfoBuf to FILESTATUS
	
	   @DosSetFileInfo - Specifies information for a file
	   Parameters - FileHandle:W, FileInfoLevel:W, FileInfoBuf:PB,
	                FileInfoBufSize:W
	   Structure - At FileInfoLevel 1, can point FileInfoBuf to FILESTATUS
	
	   @DosQFileMode - Retrieves the mode (attribute) of a file
	   Parameters - FileName:PZ, Attribute:PW, Reserved:D
	
	   @DosSetFileMode - Changes the mode (attribute) of a file
	   Parameters - Filename:PZ, Attribute:W, Reserved:D
