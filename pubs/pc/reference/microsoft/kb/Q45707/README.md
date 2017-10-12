---
layout: page
title: "Q45707: Problem Debugging StartSession from a Child Process"
permalink: /pubs/pc/reference/microsoft/kb/Q45707/
---

	Article: Q45707
	Product: Microsoft C
	Version(s): 2.30
	Operating System: OS/2
	Flags: ENDUSER | buglist2.30
	Last Modified: 9-AUG-1989
	
	When a program spawns another program that starts a new session,
	CodeView has difficulty stepping into that new session. This process
	is shown graphically in the following diagram:
	
	       --------------        -------------------
	   A --| DosExecPgm |--> B --| DosStartSession |--> C
	       --------------        -------------------
	
	The following describes how to duplicate this process and re-create
	the problem:
	
	1. Invoke CodeView on Program A with offspring debugging enabled, as
	   follows:
	
	      CVP /O A
	
	2. Program A calls DosExecPgm to spawn Program B. Trace into Program B
	   by pressing F8 on the DosExecPgm function. You will be informed
	   that a new process has begun and you will be asked if you wish to
	   debug it. Answer yes and switch to the newly created CodeView
	   session.
	
	3. Program B calls DosStartSession to begin a new session. The program
	   that will execute in that session is Program C. Attempt to trace
	   into the new session by pressing F8 on the DosStartSession function.
	
	The problem is demonstrated in Step 3. CodeView does not give you the
	opportunity to debug Program C as it should. Further, when Program B
	has completed execution and CodeView returns back to Program A, the
	first single step will inform you that a new process has been started.
	This message should have been presented on the call to
	DosStartSession.
	
	CodeView has no difficulty stepping into a new session when the
	initial program being debugged is Program B. To work around this
	problem, invoke CodeView on Program B with the /O switch.
	
	Microsoft has confirmed this to be a problem with CodeView Version
	2.30. We are researching this problem and will post new information
	as it becomes available.
	
	The following three modules demonstrate this problem:
	
	//***********************************************************
	// A.C - spawn a child from here.
	
	#define INCL_BASE
	#include <os2.h>
	
	void main (void)
	{
	  char        failbuf[80];
	  RESULTCODES ExecCode;
	
	  DosExecPgm (failbuf, 40, EXEC_ASYNC, NULL, NULL, &ExecCode, "B.EXE");
	  VioWrtTTY ("End of A.\r\n", 11, 0);
	}
	
	//***********************************************************
	// B.C - start a new session from here.
	
	#define INCL_BASE
	#include <os2.h>
	#include <string.h>
	
	void main (void)
	{
	  USHORT    Disk;
	  ULONG     Drives;
	  BYTE      SessionProg [80];
	  USHORT    MaxLen = sizeof(SessionProg)-14;
	  STARTDATA StartData;
	  USHORT    Session;
	  USHORT    Process;
	
	  // Build program name to run in new session.
	  DosQCurDisk (&Disk, &Drives);
	  strcpy (SessionProg, "*:\\");
	  SessionProg[0] = (char) ('A' + Disk - 1);
	  DosQCurDir (0, SessionProg + strlen(SessionProg), &MaxLen);
	  strcat (SessionProg, "\\C.EXE");
	
	  StartData.Length      = sizeof(STARTDATA);
	  StartData.Related     = 1;
	  StartData.FgBg        = 0;
	  StartData.TraceOpt    = 0;
	  StartData.PgmTitle    = "Test Session";
	  StartData.PgmName     = SessionProg;
	  StartData.PgmInputs   = "sample param";
	  StartData.TermQ       = NULL;
	  StartData.Environment = NULL;
	  StartData.InheritOpt  = 0;
	  StartData.SessionType = 1;
	  StartData.IconFile    = NULL;
	  StartData.PgmHandle   = 0;
	
	  DosStartSession (&StartData, &Session, &Process);
	  VioWrtTTY ("End of B.\r\n", 11, 0);
	}
	
	//***********************************************************
	// C.C - the test session.
	
	#define INCL_VIO
	#include <os2.h>
	
	void main (void)
	{
	  VioWrtTTY ("In test session", 15, 0);
	}
