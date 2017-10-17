---
layout: page
title: "Q51605: Example of Gaussian Elimination; Matrix Math in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q51605/
---

## Q51605: Example of Gaussian Elimination; Matrix Math in BASIC 7.00

	Article: Q51605
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 13-DEC-1989
	
	This article explains the purpose of Gaussian elimination and gives
	a code example.
	
	In Microsoft BASIC PDS (Professional Development System) Version 7.00
	for MS-DOS and MS OS/2, the following FUNCTION procedures perform
	Gaussian elimination:
	
	   MatSEqnS% (for single-precision)
	   MatSEqnD% (for double-precision)
	   MatSEqnC% (for currency data type)
	
	The source code of all of these functions is provided in the MATB.BAS
	source file on one of the release disks. To use these functions in the
	QuickBASIC Extended editor, load the MATBEFR.QLB Quick library as
	follows:
	
	   QBX /L MATBEFR.QLB
	
	MATFEFR.QLB and the related .LIB files are mentioned in the $INCLUDE
	file MATB.BI. MATB.BI contains DECLARE FUNCTION statements necessary
	for the matrix math routines.
	
	Definitions
	-----------
	
	1. A matrix is a two-dimensional array in BASIC.
	
	2. A vector is a one-dimensional array in BASIC.
	
	3. An identity matrix is a square array composed of 1's along the
	   diagonal from upper left to lower right, with all else 0's (zeros).
	
	Gaussian Elimination
	--------------------
	
	A linear equation of n variables (unknowns) has the following form:
	
	   a1*x1 + a2*x2 + an*xn = b
	
	where:
	
	   a1 through an and b are known constants, and x1 through xn are
	   variables with unknown values.
	
	Linear equations do not involve any products or roots of variables.
	All variables are to the first power, and don't appear as arguments
	of trigonometric, logarithmic, or exponential functions.
	
	A solution of a linear equation is a sequence of n numbers (s1 through
	sn) such that the equation is satisfied when we substitute x1=s1,
	x2=s2, ..., xn=sn.
	
	A set of multiple linear equations in the variables x1 through xn is
	called a system of linear equations. The set (vector) of constants s1
	through sn is called a solution of the system if it provides a
	solution for every equation in the system. Every system of linear
	equations has either no solutions, exactly one solution, or infinitely
	many solutions.
	
	A system of m linear equations in n unknowns can be written as follows
	in BASIC:
	
	   a(1,1)*x1 + a(1,2)*x2 + ... + a(1,n)*xn = b(1)
	
	   a(2,1)*x1 + a(2,2)*x2 + ... + a(2,n)*xn = b(2)
	
	      ...                  ...
	
	   a(m,1)*x1 + a(m,2)*x2 + ... + a(m,n)*xn = b(m)
	
	If you mentally keep track of the location of the +'s, the x's, and
	the ='s, the arrays a(m,n) and b(m) provide a shorthand notation for
	the system of linear equations. In elementary linear algebra texts,
	a(m,n) and b(m) together make what is called the "augmented matrix."
	
	Again, our goal is to discover the unknown values s1 through sn that,
	when assigned to variables x1 through xn, solve every equation.
	
	Gaussian elimination reduces the augmented matrix [the combination of
	a(m,n) and b(m)] to a matrix of reduced row-echelon form, which looks
	like a square identity matrix attached to a 1 by m vector [ b() ]. The
	vector b() contains the solution set (s1 through sn) of the system of
	linear equations.
	
	The Gaussian elimination functions MatSEqnS%, MatSEqnD%, and MatSEqnC%
	accept a square matrix a() and a vector b() as input arguments
	(together composing the input-augmented matrix), and give the solution
	in the one-dimensional array b(). After you invoke the function, a()
	is replaced with the identity matrix, and the solution values
	overwrite the input arguments that you had placed in b(). The n
	solution values in b(), when assigned to variables x1 through xn,
	satisfy every equation in the system.
	
	For more information about linear algebra, the following is an
	excellent text:
	
	   "Elementary Linear Algebra, Second Edition", by Howard Anton,
	    published by John Wiley & Sons, 1977
	
	Code Example
	------------
	
	' This program demonstrates Gaussian elimination to solve a set of
	' linear equations using double-precision variables.
	' The MATSEQND, MATSEQNS, and MATSEQNC matrix math routines are
	' provided in the Matrix Math Toolbox in Microsoft BASIC 7.00 for
	' MS-DOS and MS OS/2.
	'
	' To run this program in the QuickBASIC Extended editor, load the
	' MATBEFR.QLB Quick library as follows:
	'
	'     QBX /L MATBEFR.QLB
	'
	' MATFEFR.QLB and the related .LIB files are documented in the INCLUDE
	' file 'MATB.BI' but NOT in "Microsoft BASIC 7.0: Language Reference."
	
	DECLARE FUNCTION MatSEqnD% (A() AS DOUBLE, b() AS DOUBLE)
	
	' The above DECLARE statement is all that is needed from the following
	' include file:   REM $INCLUDE: 'matb.bi'
	DEFDBL A-Z
	OPTION BASE 1    ' Use OPTION BASE 1 for easier reference.
	DIM A(3, 3), b(3)
	
	' The following system of linear equations:
	PRINT "       x +   y + 2*z = 9"
	PRINT "     2*x + 4*y - 3*z = 1"
	PRINT "     3*x + 6*y - 5*z = 0"
	' ...can be represented in the following matrix:
	'     1  1  2  9
	'     2  4 -3  1
	'     3  6 -5  0
	' ...which can be placed in arrays a() and b() respectively as follows:
	'     a(1,1)  a(1,2)  a(1,3)  b(1)
	'     a(2,1)  a(2,2)  a(2,3)  b(2)
	'     a(3,1)  a(3,2)  a(3,3)  b(3)
	A(1, 1) = 1
	A(1, 2) = 1
	A(1, 3) = 2
	A(2, 1) = 2
	A(2, 2) = 4
	A(2, 3) = -3
	A(3, 1) = 3
	A(3, 2) = 6
	A(3, 3) = -5
	b(1) = 9
	b(2) = 1
	b(3) = 0
	errcode% = MatSEqnD%(A(), b())
	PRINT "The following values for x, y, and z solve all three equations:"
	PRINT "x="; b(1)
	PRINT "y="; b(2)
	PRINT "z="; b(3)
	
	' Here is the output, accurate to within double-precision limits:
	'    x= 1.00000000000001
	'    y= 2
	'    z= 3
