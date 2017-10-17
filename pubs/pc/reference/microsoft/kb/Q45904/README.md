---
layout: page
title: "Q45904: Using DosExecPgm() After Changing PATH Environment Variable"
permalink: /pubs/pc/reference/microsoft/kb/Q45904/
---

## Q45904: Using DosExecPgm() After Changing PATH Environment Variable

	Article: Q45904
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1989
	
	Question:
	
	I use the C 5.10 run-time putenv() function to change my PATH
	environment variable. I then use the OS/2 DosExecPgm() API call to
	start an executable that lies on that path. DosExecPgm() fails to
	execute the process, giving me a return code indicating that the file
	could not be found. I try the run-time spawnlp() function and it works
	correctly. What is the problem? How can I get DosExecPgm() to work?
	
	Response:
	
	The C run-time startup code copies the environment table into DGROUP.
	The putenv() run-time function modifies this copy of the environment.
	Other C run-time functions, including spawnlp(), will use this copy of
	the environment. So, when you alter your path variable
	
	   putenv( "PATH=d:\\whack" );
	
	and look at it
	
	    Path = getenv( "PATH" );
	
	you see that Path does indeed point to the new path. However, then
	using an OS/2 API call to check the path variable
	
	   DosScanEnv( "PATH", &Path );
	
	reveals that the path is unchanged. This is because the API functions
	deal with the original environment table, not the copy in DGROUP.
	DosExecPgm() is no exception, meaning that the original PATH
	environment variable will be used rather than the altered copy.
	
	In order to perform a DosExecPgm() of a process that is not on the
	original search path but is known to be on another search path, you
	may wish to use the DosSearchPath() function in conjunction with
	DosExecPgm(), in the following manner:
	
	#define INCL_DOS
	
	#include <os2.h>
	#include <stdio.h>
	
	void main( void );
	
	void main()
	{
	    RESULTCODES    ResCodes;
	    char           Fail[256];
	    USHORT         ret;
	    char           Pgm[256];
	
	    DosSearchPath( SEARCH_CUR_DIRECTORY,    // Start with cur dir
	                   "d:\\;c:\\;b:\\whack",   // Search this path
	                   "off.exe",               // For off.exe
	                   Pgm,                     // Put result path here
	                   256 );                   // It's 256 bytes long
	
	    printf( "Pgm path: %s\n", Pgm );
	
	    ret = DosExecPgm( Fail,
	                      256,
	                      0,
	                      NULL,
	                      0,
	                      &ResCodes,
	                      Pgm );
	
	    printf( "DosExecPgm says: %u\n", ret );
	    printf( "Fail: %s\n", Fail );
	}
	
	This program uses DosSearchPath() to generate a full path to
	"off.exe". Each directory in the path passed to DosSearchPath() will
	be searched. In this case the current directory will be searched
	first, because of the SEARCH_CUR_DIRECTORY flag.
