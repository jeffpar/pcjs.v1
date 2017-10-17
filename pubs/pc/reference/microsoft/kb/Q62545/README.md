---
layout: page
title: "Q62545: Information on RAMDRIVE.SYS and Error Messages"
permalink: /pubs/pc/reference/microsoft/kb/Q62545/
---

## Q62545: Information on RAMDRIVE.SYS and Error Messages

	Article: Q62545
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | err msg
	Last Modified: 15-AUG-1990
	
	The following information is taken from the Windows/286 and /386
	version 2.11 RAMDRIVE.TXT document:
	
	Using RAMDrive with Windows
	---------------------------
	
	First, follow the installation instructions provided by your extended
	memory board manufacturer. Next, copy the file RAMDRIVE.SYS from the
	Utilities 2 disk to your fixed disk. Then, add the following command
	line to your CONFIG.SYS file:
	
	   device=[drive:][path]RAMDRIVE.SYS [bbbb] [ssss] [dddd] [/E or /U]
	
	Note that either /E or /U may be specified, but not both. If you do
	not specify one of these two, then RAMDrive will use system memory for
	RAMDrives. It is almost always a bad idea to use conventional memory
	for a RAMDrive, as it will significantly reduce the performance of
	Windows. Running RAMDrive in extended (/E) memory, or on an AT&T 6300
	Plus (/U), is much preferred. The following is an explanation of the
	parameters:
	
	Note: Information in a RAMDrive is lost when you reboot or restart
	your computer.
	
	   [bbbb]  The first numeric argument, if present, is the amount of
	           memory in kilobytes to be used as your RAMDrive. If no
	           numeric arguments are specified, then the default value is
	           64K. The minimum amount of memory needed is 16K; the
	           maximum amount of memory possible is 4096K.
	
	   [ssss]  The second numeric argument, if present, is the sector size
	           in bytes. If a second numeric argument is not specified,
	           the default is 512 bytes. The four possible values are 128,
	           256, 512, and 1024 bytes.
	
	           Note: With IBM PC-DOS or Olivetti DOS the maximum value
	           allowed is 512 bytes. With MS-DOS 1024 bytes is the maximum
	           value.
	
	           Values are rounded up to the nearest sector size boundary.
	
	   [dddd]  The third numeric argument, if present, is the number of
	           root directory entries. If no third numeric argument is
	           specified, then the default is 64. The minimum number of
	           entries needed is 2; the maximum number allowed is 1024.
	
	           Note: If there is too little memory to create the number of
	           root directory entries specified, then RAMDrive attempts to
	           create a RAMDrive with fewer root directory entries.
	
	   /E      Specifies that extended memory is to be used for the
	           RAMDrive.
	
	   /U      Specifies that some or all of the 384K of upper extended
	           memory on the AT&T 6300 PLUS motherboard is to be used as
	           an extra RAMDrive. You may only specify this parameter with
	           an AT&T 6300 PLUS.
	
	           Note: There is 1K of RAMDrive overhead. Only 383K is
	           available for RAMDrives. This overhead is constant; it does
	           not depend on the number of RAMDrives installed.
	
	Error Messages
	--------------
	
	    Message:  RAMDrive: Computer must be PC-AT, or PC-AT compatible
	
	Explanation:  There is no extended memory available on your PC-AT or
	              compatible for RAMDrives.
	
	     Result:  RAMDRIVE.SYS was not installed.
	
	   Solution:  Remove the /E parameter. Try installing RAMDrive in
	              system memory.
	
	---------------------------------------------------------------------
	
	    Message:  RAMDrive: No extended memory available
	
	Explanation:  Your computer has no memory available for RAMDrives.
	
	     Result:  RAMDRIVE.SYS was not installed.
	
	   Solution:  Free some extended memory or obtain more memory.
	
	---------------------------------------------------------------------
	
	    Message:  RAMDrive: Insufficient memory
	
	Explanation:  Your computer has some memory available, but not enough
	              to set up a RAMDrive.
	
	     Result:  RAMDRIVE.SYS was not installed.
	
	   Solution:  Free some extended memory or obtain more memory.
	
	---------------------------------------------------------------------
	
	    Message:  RAMDrive: Invalid parameter
	
	Explanation:  The parameters you specified in your CONFIG.SYS entry
	              for RAMDRIVE.SYS are not correct.
	
	     Result:  RAMDRIVE.SYS was not installed.
	
	   Solution:  Check to see if you specified too many parameters if one
	              of your numeric parameters is not valid, if you
	              specified conflicting switches (i.e., only one of /E or
	              /U may be specified), or if you specified too many
	              switches. Change the RAMDRIVE.SYS command line in your
	              CONFIG.SYS file to conform to the usage described above.
	
	---------------------------------------------------------------------
	
	    Message:  RAMDrive: Incorrect DOS version
	
	Explanation:  RAMDrive requires DOS 2.x or DOS 3.x. Windows 2.10
	              requires DOS 3.00 or higher.
	
	     Result:  RAMDRIVE.SYS was not installed.
	
	   Solution:  Upgrade to DOS 3.0 or higher.
	
	---------------------------------------------------------------------
	
	    Message:  RAMDrive: I/O error accessing drive memory
	
	Explanation:  During the set up of the RAMDrive, an error was detected
	              in the memory being accessed for RAMDrive.
	
	     Result:  RAMDRIVE.SYS was not installed.
	
	   Solution:  Run the memory test for the memory on which you were
	              attempting to install a RAMDrive.
	
	---------------------------------------------------------------------
	
	Other Messages
	--------------
	
	    Message:  Microsoft RAMDrive version Y.YY virtual disk [drive:]
	
	Explanation:  RAMDrive Header message. Y.YY is the version of
	              RAMDrive; [drive:] is the DOS drive letter assigned to
	              this RAMDrive.
	
	              Note: On DOS 2.x the "virtual disk d:" part of this
	              message will not be printed.
	
	---------------------------------------------------------------------
	
	    Message:  Disk size: x k
	              Sector size: x bytes
	              Allocation unit: x sectors
	              Directory entries: x
	
	Explanation:  This message tells how many kilobytes of memory were
	              assigned to the RAMDrive, how many bytes there are in a
	              sector, how many sectors there are in an allocation
	              unit, and how many root directory entries there are
	              (including the volume label).
