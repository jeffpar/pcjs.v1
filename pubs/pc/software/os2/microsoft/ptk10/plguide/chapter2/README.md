---
layout: page
title: "Microsoft OS/2 Programmer's Learning Guide: Overview"
permalink: /pubs/pc/software/os2/microsoft/ptk10/plguide/chapter2/
---

[Microsoft OS/2 Programmer's Learning Guide](../)
---

Overview
---

### 2.1 Introduction

This chapter explains the basic steps needed to create an MS OS/2
C-language program. In particular, it explains how to do the following:

+ Use the **main** function for your program starting point.
+ Use the *os2.h* header file for function declarations.
+ Use INCL_ constants to selectively enable function groups.
+ Use your program's command line.
+ Use MS OS/2 naming conventions in your program sources.
+ Use structures in MS OS/2 function calls.
+ Use the AND and OR operators to examine and modify bit masks.
+ Use care in programs that access shared resources.

### 2.2 Creating an MS OS/2 Program

Creating an MS OS/2 C-language program is no different than creating any other type of C-language program.
You use the **main** function as your program starting point and create and call as many other functions as
you need to complete the task. The following simple MS OS/2 program copies the line "Hello, world" to the screen:

	#include <os2.h>
	
	main( )
	{
		USHORT cbWritten;
		DosWrite(1, "Hello, world\r\n", 14, &cbWritten);
	}

The MS OS/2 system functions use many structures, data types, and constants that are not part of the standard
C language. For example, the data type **USHORT** is a special MS OS/2 data type that specifies an unsigned short
integer. To access these items, you need to include the MS OS/2 header file *os2.h* at the beginning of your program
source file.

The MS OS/2 system functions are not standard C functions. They use the Pascal calling convention. This means,
for example, that they expect parameters to be passed in right-to-left order instead of the standard left­to-right
order of C functions. Therefore, to use the MS OS/2 functions in a C-language program, you must make sure they are
declared with the **pascal** keyword, which directs the C compiler to generate proper instructions for the function
call. Fortunately, all MS OS/2 functions are declared within the *os2.h* file, so including the file saves you the
trouble of declaring each function individually.

The *os2.h* file also declares the parameter types for each function. This is convenient since many function
parameters would otherwise require type casting to avoid compiler errors. For example, the **DosWrite** function
shown in the previous example requires the second parameter to be a full 32-bit (far) address to the given string.
Since the *os2.h* file declares the second parameter as such, the cast is carried out for you by the compiler.

### 2.3 C-Language Header Files

The MS OS/2 C-language header file *os2.h* contains the definitions you need to use the functions, data types,
structures, and constants described in the *Microsoft Operating System/2 Programmer's Reference*.

When you include the *os2.h* file, the C preprocessor automatically defines many, but not all, of the most commonly
used MS OS/2 functions. The *os2.h* header file is the first file of a set of files that contains the MS OS/2 function
definitions. Each file contains definitions for the functions, data types, structures, and constants associated with
a specific group of MS OS/2 functions. To minimize the time required to process the many header files, each function
group is conditionally processed depending on whether a corresponding constant is defined within the program source file.
The following is a list of these constants with descriptions of the function groups they represent:

**Constant**       | **Meaning**
:----------------- | :-------------
INCL_BASE          | Includes all MS OS/2 1.0 system function definitions.
INCL_DOS           | Includes all MS OS/2 1.0 kernel function definitions (Dos). 
INCL_SUB           | Includes all MS OS/2 1.0 video, keyboard, and mouse functions (Vio, Kbd, and Mou).
INCL_DOSDATETIME   | Includes all date/time and timer functions.
INCL_DOSDEVICES    | Includes the device and IOPL support functions.
INCL_DOSERRORS     | Includes the MS OS/2 error constants.
INCL_DOSFILEMGR    | Includes all file-management functions.
INCL_DOSINFOSEG    | Includes all information-segment functions.
INCL_DOSMEMMGR     | Includes all memory-management functions.
INCL_DOSMODULEMGR  | Includes all module-manager functions.
INCL_DOSMONITORS   | Includes all monitor functions.
INCL_DOSNLS        | Includes national-language-support functions.
INCL_DOSPROCESS    | Includes all process- and thread-support functions.
INCL_DOSQUEUES     | Includes all queue and other miscellaneous functions.
INCL_DOSRESOURCES  | Includes resource-support functions (not available in MS OS/2 1.0).
INCL_DOSSEMAPHORES | Includes all semaphore functions.
INCL_DOSSESMGR     | Includes all session-manager functions.
INCL_DOSSIGNALS    | Includes all signal functions.
INCL_NOCOMMON      | Excludes any function group not explicitly defined.
                   |

To use a function within your program function, you simply define the corresponding constant by using the #define
directive before including the *os2.h* file. For example, the following program includes definitions for the
memory-manager and file-system functions:

	#define INCL_DOSMEMMGR
	#define INCL_DOSFILEMGR
	#include <os2.h>
	
	main( )
	{
		...
	}

Once you have defined a constant, you may use any function, structure, or data type in that function group.

### 2.4 A Simple Program: Echoing the Command Line

In standard C-language programs, you can use the *argc* and *argv* parameters of the main function to retrieve
individual copies of the command­line arguments. You can use these parameters in MS OS/2 programs, but you can also
retrieve the entire command line, exactly as the user typed it, by using the **DosGetEnv** function.

When it starts a program, MS OS/2 prepares an environment segment for the program that contains definitions of all
environment variables, as well as of the command line. The **DosGetEnv** function retrieves the segment selector
for the program's environment segment and the address offset within that segment for the start of the command line.

You can echo the command line on the screen by using the **DosGetEnv** function to get the address of the command
line in the environment segment, as shown in the following sample program:

	#define INCL_DOSQUEUES
	#include <os2.h>
	
	main( )
	{
		SEL selEnvironment;
		USHORT offCommand;
		PSZ pszCommandLine;
		USHORT cbWritten;
		USHORT i, cch;
		
		DosGetEnv(&selEnvironment, &offCommand);
		pszCommandLine = MAKEP(selEnvironment, offCommand);
		
		for (i = 0; pszCommandLine[i]; i++);
		for (i++, cch = 0; pszCommandLine[cch + i]; cch++);
		
		DosWrite(1, &pszCommandLine[i] , cch, &cbWritten);
	}

The command line is in two parts. The first part is the program name, terminated by a zero byte. The second part
is the rest of the command line, terminated by two zero bytes. This sample program echoes the command line by skipping
over the program name, then writing everything up to the next zero byte to the screen. The first **for** statement
skips over the command name; the second for statement computes the length of the string. The **MAKEP** macro creates
the far pointer that is needed to access the command line in the environment segment.

You can also examine your program's environment by using the selector retrieved by the **DosGetEnv** function.
The program's environment consists of the environment variables that have been declared and passed to the program.
Each program has a unique environment that is typically inherited from the program that started it; for example,
from the MS OS/2 command processor **cmd**.

You can use the **DosScanEnv** function to scan for a specific environment variable. This function takes the name
of the environment variable that you are interested in and copies its current value to a buffer that you supply.
The following program uses **DosScanEnv** to display the value of the environment variable specified in the command
line:

	#define INCL_DOSQUEUES
	#include <os2 .h>
	
	main( )
	{
		SEL selEnvironment;
		USHORT offCommand;
		PSZ pszCommandLine;
		PSZ pszValue;
		USHORT cbWritten;
		USHORT i , cch;
		
		DosGetEnv(&selEnvironment, &offCommand);
		pszCommandLine = MAKEP(selEnvironment, offCommand);
		
		for (i = 0 ; pszCommandLine[i); i++);
		for (i++; pszCommandLine[i] == ' '; i++);

		if (!DosScanEnv (&pszCommandLine[i), &pszValue)) {
			for (cch = 0; pszValue[cch); cch++);
			DosWrite(1, pszValue, cch, &cbWritten);
		}
	}

### 2.5 Using the MS OS/2 Naming Conventions

The sample programs in this manual use the MS OS/2 naming conventions for their variables and functions.
These conventions define how to create names that indicate both the purpose and data type of an item used
with the MS OS/2 system functions. When you use the conventions in your source files, you help others
who may read your sources to readily identify the purpose and type of the functions, variables, structures, fields,
and constants.

The following list briefly describes the MS OS/2 naming conventions:

**Item**           | **Convention**
:----------------- | :-------------
Variable           | All names consist of three elements: a prefix, a base type, and a qualifier.
                   | The base type identifies the data type of the item; the prefix specifies additional
                   | information, such as whether the item is a pointer, an array, or a count of
                   | bytes; and the qualifier specifies the purpose of the item. The prefix and base
                   | type are lowercase, and the qualifier is mixed-case.
                   |
Parameter          | Same as a variable.
                   |
Structure Field    | Same as a variable.
                   |
Structure          | All names consist of a word or phrase that specifies the purpose of the structure.
                   | All letters in the name are uppercase.
                   |
Constant           | All names consist of a prefix, derived from the name of the function associated with
                   | the constant, and a word or phrase that specifies the meaning of the constant in terms
                   | of a value, action, color, or condition. All letters in the name are uppercase and an
                   | underscore separates the prefix from the rest of the name.
                   |
Function name      | All names consist of a three-letter system prefix followed by a word or phrase that
                   | describes the action of the function. Each word in the function name starts with an
                   | uppercase letter. Verb-noun combinations, such as **DosGetDateTime**, are recommended.
                   |

The following examples show some of the standard prefix and base types you will see in this manual:

	/* Base Types */
	BOOL fSuccess;      /* f    Boolean flag. TRUE if successful    */
	CHAR chChar;        /* ch   8-bit character                     */
	SHORT sRate;        /* s    16-bit signed integer               */
	LONG lDistance;     /* l    32-bit signed integer               */
	UCHAR uchScan;      /* uch  8-bit unsigned character            */
	USHORT usHeight;    /* us   16-bit unsigned integer             */
	ULONG ulWidth;      /* ul   32-bit unsigned integer             */
	BYTE bAttribute;    /* b    8-bit unsigned integer              */
	CHAR szName[];      /* sz   zero-terminated array of characters */
	BYTE fbMask;        /* fb   array of flags in a byte            */
	USHORT fsMask;      /* fs   array of flags in a short           */
	ULONG flMask;       /* fl   array of flags in a long            */
	SEL selSegment;     /* sel  16-bit segment selector             */
	
	/* Prefixes */
	PCH pchBuffer;      /* p    32-bit far pointer to a given type  */
	NPCH npchBuffer;    /* np   16-bit newr pointer to a given type */
	CHAR achData[1];    /* a    array of a given type               */
	USHORT ichIndex;    /* i    index to an array of a given type   */
	USHORT cb;          /* c    count of items of a given type      */
	HFILE hf;           /* hf   handle identifying a given object   */
	USHORT offSeg;      /* off  offset                              */
	USHORT idSession;   /* id   identifier for a given object       */

When you are naming variables, remember that the prefix and base type are optional for common integer
types such as **SHORT** and **USHORT**.

### 2.6 Using Structures: Getting the Time of Day

Many MS OS/2 functions use structures for input and output parameters. To use a structure in an MS OS/2
function, you  first define the structure in your program, then pass a 32-bit far address to the structure
as a parameter in the function call.

For example, the **DosGetDateTime** function copies the current date and time to a **DATETIME** structure
whose address you supply. The fields of the **DATETIME** structure define the month, day, and year, as well as
the time of day (to hundredths of a second). The **DATETIME** structure, defined in the *os2.h* file, has the
following form:

	typedef struct _DATETIME {  /* date */
	    UCHAR   hours;
	    UCHAR   minutes;
	    UCHAR   seconds;
	    UCHAR   hundredths;
	    UCHAR   day;
	    UCHAR   month;
	    USHORT  year;
	    SHORT   timezone;
	    UCHAR   weekday;
	} DATETIME;

To retrieve the date and time, you call the **DosGetDateTime** function and use the address operator (&) to
specify the address of your **DATETIME** structure in the call. The following example shows how to make the call:

	#include <os2.h>
	
	CHAR szDayName[] = "MonTueWedThuFriSatSun";
	CHAR szMonthName[] = "JanFebMarAprMayJunJulAugSepOctNovDec";
	CHAR szDate[] = "xx:xx:xx xxx xxx xx, xxxx\r\n";
	
	main( )
	{
	    DATETIME date;
	    SHORT offset;
	    SHORT i;
	    USHORT usYear;
	    USHORT cbWritten;
	    
	    DosGetDateTime(&date);  /* Address of the DATETIME structure */
	    
	    szDate[0] = (date.hours/10) + '0';
	    szDate[1] = (date.hours%10) + '0';
	    szDate[3] = (date.minutes/10) + '0';
	    szDate[4] = (date.minutes%10) + '0';
	    szDate[6] = (date.seconds/10) + '0';
	    szDate[7] = (date.seconds/10) + '0';
	    offset = date.weekday * 3;
	    for (i = 0; i < 3; i++)
	        szData[i + 9] = szDayName[i + offset];
	    offset = (date.month - 1) * 3;
	    for (i = 0; i < 3; i++)
	        szDate[i + 13] = szMonthName[i + offset];
	    szDate[17] = (date.day < 10)?' ':(date.day/10 + '0');
	    szDate[18] = (date.day%10) + '0';
	    usYear = date.year;
	    szDate[21] = (usYear/1000) + '0';
	    usYear = usYear % 1000;
	    szDate[22] = (usYear/100) + '0';
	    usYear = usYear % 100;
	    szDate[23] = (usYear/10) + '0';
	    szDate[24] = (usYear%10) + '0';
	    
	    DosWrite(1, szDate, 27, &cbWritten);
	}

One drawback of using MS OS/2 functions exclusively is that there are no formatted output functions,
such as the **printf** function. This sample program, therefore, formats the data itself before displaying it.
The program uses the integer-division operators (/ and %) to convert binary numbers to ASCII characters.
The program then copies the ASCII characters to a string and displays the string by using the **DosWrite** function.

Some MS OS/2 functions require that you fill one or more fields of the structure before making the function call.
For example, there are some structures whose length depends on the version of the operating system being used;
MS OS/2 requires that you supply the expected length so that the function does not copy data beyond the end of your
structure.

### 2.7 Using Bit Masks

In MS OS/2, many functions use bit masks. A bit mask (also called an array of flags) is a combination of two
or more Boolean flags in a single byte, word, or double-word value. In C-language programs, you can use the
bitwise AND, OR, and NOT operators to examine and set the values in a bit mask.

If a function retrieves a bit mask, you can check a specific flag in the bit mask by using the AND operator,
as shown in the following example:

	USHORT fsEvents;
	
	if (fsEvent & 0x0004)
	    /* Is the flag set */

Or you can set a flag in a bit mask by using the OR operator, as shown in the following example:

	ULONG flFunctions;
	
	flFunctions = flFunctions | KR_KBDPEEK;

Finally, you can clear a flag in a bit mask by using the AND and NOT operators, as shown in the following example:

	USHORT fsEvent;
	
	fsEvents = fsEvent & ~0x0004;

### 2.8 Sharing Resources: Playing a Tune

Many MS OS/2 functions let you use the resources of the computer, such as the keyboard, screen, disk, and even
the system speaker. Since MS OS/2 is a multitasking operating system and more than one program can run at a time,
MS OS/2 considers all resources of the computer to be shared resources. As a result, programs must cooperate with
other running programs and must not claim exclusive access to a given resource.

Consider a simple program that plays a short tune by using the **DosBeep** function. This function, when called
by a single program, generates a tone at the system speaker, but if two programs call **DosBeep** at the same time,
the result is chaos. Try running two or more copies of the following program at the same time:

	#include <os2.h>
	
	#define CNOTES 14
	USHORT ausTune[] = {
	    440,1000,
	    480,1000,
	    510,1000,
	    550,1000,
	    590,1000,
	    620,1000,
	    660,1000
	    };
	    
	main( )
	{
	    int i;
	    
	    for (i = 0; i < CNOTES; i+= 2)
	        DosBeep(ausTune[i] , ausTune[i + 1]);
	}

The first argument to the **DosBeep** function specifies the frequency of the note. The second argument specifies
the duration. The array ausTune defines values for the frequency and duration of each note in the tune.

**DosBeep** is intended to be used for signaling the user when an error occurs, such as pressing an incorrect key.
Since the system speaker is a shared resource, a process should use the **DosBeep** function sparingly.
