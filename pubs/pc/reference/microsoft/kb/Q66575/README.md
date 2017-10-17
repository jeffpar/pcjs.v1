---
layout: page
title: "Q66575: Multithreaded Version of strtok() in C 6.00 Can Cause GP Fault"
permalink: /pubs/pc/reference/microsoft/kb/Q66575/
---

## Q66575: Multithreaded Version of strtok() in C 6.00 Can Cause GP Fault

	Article: Q66575
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00a
	Last Modified: 21-JAN-1991
	
	In certain cases, using the multithreaded version of the strtok()
	function from Microsoft C version 6.00 can cause a General Protection
	fault. This problem has been identified and corrected in the C version
	6.00a maintenance release.
	
	Sample Code
	-----------
	
	#define INCL_DOS
	#include <os2.h>
	#include <conio.h>
	#include <process.h>
	#include <stddef.h>
	#include <stdio.h>
	#include <stdlib.h>
	#include <string.h>
	
	void StartThread(char *pszFileName);
	void ThreadProc(char *pszFileName);
	
	void main(void)
	 {
	  StartThread("THREAD01.TXT");
	  StartThread("THREAD02.TXT");
	  StartThread("THREAD03.TXT");
	  StartThread("THREAD04.TXT");
	  StartThread("THREAD05.TXT");
	  while(!kbhit());
	 }
	
	void StartThread(char *pszFileName)
	 {
	  int ThreadID;
	
	  ThreadID = _beginthread(ThreadProc,
	                           NULL,
	                           8192,
	                           pszFileName);
	  if(ThreadID == -1)
	             printf("Couldn't Start Thread for '%s'\n", pszFileName);
	 }
	
	void ThreadProc(char *pszFileName)
	{
	   FILE *Input, *Output;
	   char Line[256], *t, OutFileName[16];
	
	   Input = fopen(pszFileName, "rt");
	   if(Input == NULL)
	   {
	      printf("%.3d: Error Opening Input File - '%s'\n",
	                 *_threadid, pszFileName);
	      _endthread();
	   }
	   sprintf(OutFileName, "THREAD%.2d.OUT", atoi(&pszFileName[6]));
	
	   Output = fopen(OutFileName, "w");
	   if(Output == NULL)
	   {
	      printf("%.3d: Error Opening Output File - '%s'\n",
	                *_threadid, OutFileName);
	      fclose(Input);
	      _endthread();
	   }
	   while(fgets(Line, sizeof(Line), Input))
	   {
	      Line[strlen(Line)-1] = '\0';
	
	      fprintf(Output, "%.3d: Input Line: '%s'\n", *_threadid, Line);
	
	      for(t = strtok(Line, " \n\r");
	           t != NULL; t = strtok(NULL, " \n\r"))
	         fprintf(Output, "%.3d:  Token: '%s'\n", *_threadid, t);
	
	      fprintf(Output, "\n");
	   }
	   fclose(Input);
	   fprintf(Output, "\n%.3d: Going to sleep\n", *_threadid);
	   fclose(Output);
	   DosSleep(10000L);
	   _endthread();
	}
