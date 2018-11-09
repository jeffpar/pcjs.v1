---
layout: page
title: PCjs DOS INT 21h Documentation
permalink: /pubs/pc/software/dos/pcjs/int21/
---

PCjs DOS INT 21h Documentation
------------------------------

## INT 21h Functions by Group

### Character Input

- 01H: Character Input with Echo
- 03H: Auxiliary Input
- 06H: Direct Console I/O
- 07H: Unfiltered Character Input Without Echo
- 08H: Character Input Without Echo
- 0AH: Buffered Keyboard Input
- 0BH: Check Keyboard Status
- 0CH: Flush Buffer, Read Keyboard

### Character Output

- 02H: Character Output
- 04H: Auxiliary Output
- 05H: Print Character
- 06H: Direct Console I/O
- 09H: Display String

### Disk Management

- 0DH: Disk Reset
- 0EH: Select Disk
- 19H: Get Current Disk
- 1BH: Get Default Drive Data
- 1CH: Get Drive Data
- 2EH: Set/Reset Verify Flag
- 36H: Get Disk Free Space
- 54H: Get Verify Flag

### File Management

- 0FH: [Open File with FCB](#function-0fh-open-file-with-fcb)
- 10H: Close File with FCB
- 11H: Find First File
- 12H: Find Next File
- 13H: Delete File
- 16H: Create File with FCB
- 17H: Rename File
- 1AH: Set DTA Address
- 23H: Get File Size
- 2FH: Get DTA Address
- 3CH: Create File with Handle
- 3DH: Open File with Handle
- 3EH: Close File
- 41H: Delete File
- 43H: Get/Set File Attributes
- 45H: Duplicate File Handle
- 46H: Force Duplicate File Handle
- 4EH: Find First File
- 4FH: Find Next File
- 56H: Rename File
- 57H: Get/Set Date/Time of File
- 5AH: Create Temporary File
- 5BH: Create New File
- 5CH: Lock/Unlock File Region

### Information Management

- 14H: Sequential Read
- 15H: Sequential Write
- 21H: Random Read
- 22H: Random Write
- 24H: Set Relative Record
- 27H: [Random Block Read](#function-27h-random-block-read)
- 28H: Random Block Write
- 3FH: Read File or Device
- 40H: Write File or Device
- 42H: Move File Pointer

### Directory Management

- 39H: Create Directory
- 3AH: Remove Directory
- 3BH: Change Current Directory
- 47H: Get Current Directory

### Process Management

- 00H: Terminate Process
- 31H: Terminate and Stay Resident
- 4BH: Load and Execute Program (EXEC)
- 4CH: Terminate Process with Return Code
- 4DH: Get Return Code of Child Process
- 59H: Get Extended Error Information

### Memory Management

- 48H: Allocate Memory Block
- 49H: Free Memory Block
- 4AH: Resize Memory Block
- 58H: Get/Set Allocation Strategy

### Miscellaneous System Management

- 25H: Set Interrupt Vector
- 26H: Create New Program Segment Prefix
- 29H: [Parse Filename](#function-29h-parse-filename)
- 2AH: Get Date
- 2BH: Set Date
- 2CH: Get Time
- 2DH: Set Time
- 30H: Get MS-DOS Version Number
- 33H: Get/Set Control-C Check Flag
- 34H: Return Address of InDOS Flag
- 35H: Get Interrupt Vector
- 38H: Get/Set Current Country
- 44H: IOCTL
- 5EH: Network Machine Name/Printer Setup
- 5FH: Get/Make Assign List Entry
- 62H: Get Program Segment Prefix Address
- 63H: Get Lead Byte Table (version 2.25 only)

## Data Structures

### File Control Block (FCB)

| Maintained by | Offset (bytes) | Size (bytes) | Description
| ------------- | -------------- | ------------ | -----------
| Program       |      00H       |       1      | [Drive identifier](#fcb-drive-identifier)
| Program       |      01H       |       8      | [Filename](#fcb-filename)
| Program       |      09H       |       3      | [File extension](#fcb-file-extension)
| MS-DOS        |      0CH       |       2      | [Current block number](#fcb-current-block-number)
| Program       |      0EH       |       2      | [Record size (bytes)](#fcb-recordsize)
| MS-DOS        |      10H       |       4      | [File size (bytes)](#fcb-file-size)
| MS-DOS        |      14H       |       2      | [Date stamp](#fcb-date-stamp)
| MS-DOS        |      16H       |       2      | [Time stamp](#fcb-time-stamp)
| MS-DOS        |      18H       |       8      | Reserved
| MS-DOS        |      20H       |       1      | [Current record number](#fcb-current-record-number)
| Program       |      21H       |       4      | [Random record number](#fcb-random-record-number)

#### FCB Drive identifier

Initialized by the application to designate the
drive on which the file to be opened or created resides. 0 = default
drive, 1 = drive A, 2 = drive B, and so on. If the application
supplies a zero in this byte (to use the default drive), MS-DOS alters
the byte during the open or create operation to reflect the actual
drive used; that is, after an open or create operation, this drive
will always contain a value of 1 or greater.

#### FCB Filename

Standard eight-character filename; initialized by the
application; must be left justified and padded with blanks if the name
has fewer than eight characters. A device name (for example, PRN) can
be used; note that there is no colon after a device name.

#### FCB File extension

Three-character file extension; initialized by the
application; must be left justified and padded with blanks if the
extension has fewer than three characters.

#### FCB Current block number

Initialized to zero by MS-DOS when the file is
opened. The block number and the record number together make up the
record pointer during sequential file access.

#### FCB Record size

The size of a record (in bytes) as used by the program.
MS-DOS sets this field to 128 when the file is opened or created; the
program can modify the field afterward to any desired record size. If
the record size is larger than 128 bytes, the default DTA in the PSP
cannot be used because it will collide with the program's own code or
data.

#### FCB File size

The size of the file in bytes. MS-DOS initializes this
field from the file's directory entry when the file is opened. The
first 2 bytes of this 4-byte field are the least significant bytes of
the file size.

#### FCB Date Stamp

The date of the last write operation on the file. MS-DOS
initializes this field from the file's directory entry when the file
is opened. This field uses the same format used by file handle
Function 57H (Get/Set/Date/Time of File):

| Bit     | 15 | 14 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0
|---------|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----
| Content |  Y |  Y |  Y |  Y |  Y |  Y |  Y |  M |  M |  M |  M |  D |  D |  D |  D |  D


| Bits    | Contents
|---------|---------
|    0-4  | Day of month (1-31)
|    5-8  | Month (1-12)
|   9-15  | Year (relative to 1980)

#### FCB Time stamp

The time of the last write operation on the file. MS-DOS
initializes this field from the file's directory entry when the file
is opened. This field uses the same format used by file handle
Function 57H (Get/Set/Date/Time of File):

| Bit     | 15 | 14 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0
|---------|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----
| Content |  H |  H |  H |  H |  H |  M |  M |  M |  M |  M |  M |  S |  S |  S |  S |  S

| Bits    | Contents
|---------|---------
|    0-4  | Number of 2-second increments (0-29)
|   5-10  | Minutes (0-59)
|  11-15  | Hours (0-23)

#### FCB Current record number

Together with the block number, constitutes the
record pointer used during sequential read and write operations. MS-
DOS does not initialize this field when a file is opened. The record
number is limited to the range 0 through 127; thus, there are 128
records per block. The beginning of a file is record 0 of block 0.

#### FCB Random record pointer

A 4-byte field that identifies the record to be
transferred by the random record functions 21H, 22H, 27H, and 28H. If
the record size is 64 bytes or larger, only the first 3 bytes of this
field are used. MS-DOS updates this field after random block reads and
writes (Functions 27H and 28H) but not after random record reads and
writes (Functions 21H and 22H).

### Extended File Control Block (FCB)

An extended FCB, which is 7 bytes longer than a normal FCB, can be
used to access files with special attributes such as hidden, system,
and read-only. The extra 7 bytes of an extended FCB are simply
prefixed to the normal FCB format (Table 7-4). The first byte of an
extended FCB always contains 0FFH, which could never be a legal drive
code and therefore serves as a signal to MS-DOS that the extended
format is being used. The next 5 bytes are reserved and must be zero,
and the last byte of the prefix specifies the attributes of the file
being manipulated. The remainder of an extended FCB has exactly the
same layout as a normal FCB. In general, an extended FCB can be used
with any MS-DOS function call that accepts a normal FCB.

### Function 0FH: Open File with FCB

    1.0 and later

        Function 0FH opens the file named in the file control block (FCB)
        pointed to by DS:DX.

    To Call

        AH      = 0FH
        DS:DX   = segment:offset of an unopened FCB

    Returns

        If function is successful:

        AL      = 00H

        If function is not successful:

        AL      = FFH

    Programmer's Notes

        ■  MS-DOS provides several types of file services: FCB file services,
           which are relatively compatible with the CP/M methods of file
           handling; extended FCB file services, which take advantage of both
           CP/M compatibility and MS-DOS extensions; and handle, or "stream-
           oriented," file services, which are more compatible with UNIX/XENIX
           and support pathnames (MS-DOS versions 2.0 and later).

        ■  Function 0FH does not support pathnames and so is capable of
           opening files only in the current directory of the specified
           drive.

        ■  Function 0FH does not create a new file if the specified file does
           not already exist. Function 16H (Create File with FCB) is used to
           create new files with FCBs.

        ■  Function 0FH must use an unopened FCB--that is, one in which all
           but the drive-designator, filename, and extension fields are zero.
           If the call is successful, the function fills in the file size and
           date fields from the file's directory entry. In MS-DOS versions 2.0
           and later, the function also fills in the time field.

        ■  If the file is opened on the default drive (the drive number in the
           FCB is set to 0), MS-DOS fills in the actual drive code. Thus, at
           some later point in processing, the default drive can be changed
           and MS-DOS will still have the drive number in the FCB for use in
           accessing the file. It will therefore continue to use the correct
           drive.

        ■  If Function 0FH is successful, MS-DOS sets the current-block field
           to 0; that is, the file pointer is at the beginning of the file. It
           also sets the record size to 128 bytes (the system default).

        ■  If a record size other than 128 is needed, the record size field of
           the FCB should be changed after the file is successfully opened and
           before attempting any I/O.

        ■  In a network running under MS-DOS version 3.1 or later, files are
           opened by Function 0FH with the share code set to compatibility
           mode and the access code set to read/write.

        ■  If Function 0FH returns an error code (0FFH) in the AL register,
           the attempt to open the file was not successful. Possible causes
           for the failure are

            - File was not found.

            - File has the hidden or system attribute and a properly formatted
            extended FCB was not used.

            - Filename was improperly specified in the FCB.

            - SHARE is loaded and the file is already open by another process
            in a mode other than compatibility mode.

        ■  With MS-DOS versions 3.0 and later, Function 59H (Get Extended
           Error Information) can be used to determine why the attempt to open
           the file failed.

        ■  MS-DOS passes the first two command-tail parameters into default
           FCBs located at offsets 5CH and 6CH in the program segment prefix
           (PSP). Many applications designed to run as .COM files take
           advantage of one or both of these default FCBs.

        ■  With MS-DOS versions 2.0 and later, Function 3DH (Open File with
           Handle) should be used in preference to Function 0FH.

    Related Functions

        10H (Close File with FCB)
        16H (Create File with FCB)
        3CH (Create File with Handle)
        3DH (Open File with Handle)
        3EH (Close File)
        59H (Get Extended Error Information)
        5AH (Create Temporary File)
        5BH (Create New File)

    Example

            ;************************************************************;
            ;                                                            ;
            ;        Function 0FH: Open File, FCB-based                  ;
            ;                                                            ;
            ;        int FCB_open(uXFCB,recsize)                         ;
            ;            char *uXFCB;                                    ;
            ;            int recsize;                                    ;
            ;                                                            ;
            ;        Returns 0 if file opened OK, otherwise returns -1.  ;
            ;                                                            ;
            ;        Note: uXFCB must have the drive and filename        ;
            ;        fields (bytes 07H through 12H) and the extension    ;
            ;        flag (byte 00H) set before the call to FCB_open     ;
            ;        (see Function 29H).                                 ;
            ;                                                            ;
            ;************************************************************;

    cProc   FCB_open,PUBLIC,ds
    parmDP  puXFCB
    parmW   recsize
    cBegin
            loadDP  ds,dx,puXFCB    ; Pointer to unopened extended FCB.
            mov     ah,0fh          ; Ask MS-DOS to open an existing file.
            int     21h
            add     dx,7            ; Advance pointer to start of regular
                                    ; FCB.
            mov     bx,dx           ; BX = FCB pointer.
            mov     dx,recsize      ; Get record size parameter.
            mov     [bx+0eh],dx     ; Store record size in FCB.
            xor     dx,dx
            mov     [bx+20h],dl     ; Set current-record
            mov     [bx+21h],dx     ; and relative-record
            mov     [bx+23h],dx     ; fields to 0.
            cbw                     ; Set return value to 0 or -1.
    cEnd

### Function 27H: Random Block Read

    1.0 and later

        Function 27H reads one or more records into memory, placing the
        records in the current disk transfer area (DTA).

    To Call

        AH      = 27H
        CX      = number of records to read
        DS:DX   = segment:offset of previously opened file control block (FCB)

    Returns

        AL      = 00H  read successful
                = 01H  end of file; no record read
                = 02H  DTA too small (segment wrap error); no record read
                = 03H  end of file; partial record read

        If AL is 00H or 03H:

        CX      = number of records read

        DTA contains data read from file.

    Programmer's Notes

        ■  The DTA address should be set with Function 1AH (Set DTA Address)
           before Function 27H is called. If the DTA address has not been set,
           MS-DOS uses a default 128-byte DTA at offset 80H in the program
           segment prefix (PSP).

        ■  Function 27H reads the number of records specified in CX
           sequentially, starting at the file location indicated by the
           relative-record and record size fields in the FCB. If CX = 0, no
           records are read.

        ■  The record length used by Function 27H is the value in the record
           size field of the FCB. Unless a new value is placed in this field
           after a file is opened or created, MS-DOS uses a default record
           length of 128 bytes.

        ■  Function 27H is similar to Function 21H (Random Read); however,
           Function 27H can read more than one record at a time and updates
           the relative-record field of the FCB after each call. Successive
           calls to this function thus read sequential groups of records from
           a file, whereas successive calls to Function 21H repeatedly read
           the same record.

        ■  Possible alternative causes for end-of-file (01H) errors include:

            - Disk removed from drive since file was opened.

            - Previous open failed.

            With MS-DOS versions 3.0 and later, more detailed information on
            the error can be obtained by calling Function 59H (Get Extended
            Error Information).

        ■  On networks running under MS-DOS version 3.1 or later, the user
           must have Read access rights to the directory containing the file
           to be read.

        ■  With MS-DOS versions 2.0 and later, Function 3FH (Read File or
           Device) should be used in preference to Function 27H.

    Related Functions

        14H (Sequential Read)
        1AH (Set DTA Address)
        21H (Random Read)
        24H (Set Relative Record)
        28H (Random Block Write)
        3FH (Read File or Device)

    Example

            ;************************************************************;
            ;                                                            ;
            ;      Function 27H: Random File Block Read, FCB-based       ;
            ;                                                            ;
            ;      int FCB_rblock(oXFCB,nrequest,nactual,start)          ;
            ;          char *oXFCB;                                      ;
            ;          int   nrequest;                                   ;
            ;          int  *nactual;                                    ;
            ;          long  start;                                      ;
            ;                                                            ;
            ;      Returns read status 0, 1, 2, or 3 and sets            ;
            ;      nactual to number of records actually read.           ;
            ;                                                            ;
            ;      If start is -1, the relative-record field is          ;
            ;      not changed, causing the block to be read starting    ;
            ;      at the current record.                                ;
            ;                                                            ;
            ;************************************************************;

    cProc   FCB_rblock,PUBLIC,<ds,di>
    parmDP  poXFCB
    parmW   nrequest
    parmDP  pnactual
    parmD   start
    cBegin
            loadDP  ds,dx,poXFCB    ; Pointer to opened extended FCB.
            mov     di,dx           ; DI points at FCB, too.
            mov     ax,word ptr (start) ; Get long value of start.
            mov     bx,word ptr (start+2)
            mov     cx,ax           ; Is start = -1?
            and     cx,bx
            inc     cx
            jcxz    rb_skip         ; If so, don't change relative-record
                                    ; field.
            mov     [di+28h],ax     ; Otherwise, seek to start record.
            mov     [di+2ah],bx
    rb_skip:
            mov     cx,nrequest     ; CX = number of records to read.
            mov     ah,27h          ; Get MS-DOS to read CX records,
            int     21h             ; placing them at DTA.
            loadDP  ds,bx,pnactual  ; DS:BX = address of nactual.
            mov     [bx],cx         ; Return number of records read.
            cbw                     ; Clear high byte.
    cEnd

### Function 29H: Parse Filename

    1.0 and later

        Function 29H examines a string for a valid filename in the form
        drive:filename.ext. If the string represents a valid filename,
        the function creates an unopened file control block (FCB) for it.

    To Call

        AH      = 29H
        AL      = code to control parsing, as follows (bits 0-3 only):

            Bit    Value  Meaning
            ──────────────────────────────────────────────────────────────────
            0      0      Stop parsing if file separator is found.

                   1      Ignore leading separators (parse off white space).

            1      0      Set drive number field in FCB to 0 (current drive) if
                          string does not include a drive identifier.

                   1      Set drive as specified in the string; leave unaltered
                          if string does not include a drive identifier.

            2      0      Set filename field in the FCB to blanks (20H) if
                          string does not include a filename.

                   1      Leave filename field unaltered if string does not
                          include a filename.

            3      0      Set extension field in FCB to blanks (20H) if string
                          does not include a filename extension.

                   1      Leave extension field unaltered if string does not
                          include a filename extension.

        DS:SI   = segment:offset of string to parse
        ES:DI   = segment:offset of buffer for unopened FCB

    Returns

        AL      = 00H  string does not contain wildcard characters
                = 01H  string contains wildcard characters
                = FFH  drive specifier invalid
        DS:SI   = segment:offset of first byte following the parsed string
        ES:DI   = segment:offset of unopened FCB

    Programmer's Notes

        ■  Bits 0 through 3 of the byte in the AL register control the way the
           text string is parsed; bits 4 through 7 are not used and must be 0.

        ■  After MS-DOS parses the string, DS:SI points to the first byte
           following the parsed string. If DS:SI points to an earlier byte,
           MS-DOS did not parse the entire string.

        ■  If Function 29H encounters the MS-DOS wildcard character * (match
           all remaining characters) in a filename or extension, the remaining
           bytes in the corresponding FCB field are set to the wildcard
           character ? (match one character). For example, the string DOS*.D*
           would be converted to DOS????? in the filename field and D?? in the
           extension field of the FCB.

        ■  With MS-DOS versions 1.x, the following characters are filename
           separators:

            : . ; , = + space tab / " [ ]

           With MS-DOS versions 2.0 and later, the following characters are
           filename separators:

            : . ; , = + space tab

        ■  The following characters are filename terminators:

            / " [ ] < > |
            All filename separators
            Any control character

        ■  If the string does not contain a valid filename, ES:DI+1 points to
           an ASCII blank character (20H).

        ■  Function 29H cannot parse pathnames.

    Related Functions

        None

    Example

            ;************************************************************;
            ;                                                            ;
            ;            Function 29H: Parse Filename into FCB           ;
            ;                                                            ;
            ;            int FCB_parse(uXFCB,name,ctrl)                  ;
            ;                char *uXFCB;                                ;
            ;                char *name;                                 ;
            ;                int ctrl;                                   ;
            ;                                                            ;
            ;            Returns -1 if error,                            ;
            ;                     0 if no wildcards found,               ;
            ;                     1 if wildcards found.                  ;
            ;                                                            ;
            ;************************************************************;

    cProc   FCB_parse,PUBLIC,<ds,si,di>
    parmDP  puXFCB
    parmDP  pname
    parmB   ctrl
    cBegin
            loadDP  es,di,puXFCB    ; Pointer to unopened extended FCB.
            push    di              ; Save DI.
            xor     ax,ax           ; Fill all 22 (decimal) words of the
                                    ; extended FCB with zeros.
            cld                     ; Make sure direction flag says UP.
            mov     cx,22d
            rep     stosw
            pop     di              ; Recover DI.
            mov     byte ptr [di],0ffh ; Set flag byte to mark this as an
                                    ; extended FCB.
            add     di,7            ; Advance pointer to start of regular
                                    ; FCB.
            loadDP  ds,si,pname     ; Get pointer to filename into DS:SI.
            mov     al,ctrl         ; Get parse control byte.
            mov     ah,29h          ; Parse filename, please.
            int     21h
            cbw                     ; Set return parameter.
    cEnd
