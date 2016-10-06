---
layout: page
title: What Have We Learned From The PDP-11? (1975)
permalink: /pubs/dec/pdp11/papers/1975_what_have_we_learned/
---

Computer Structures: What Have We Learned From The PDP-11?
---

By Gordon Bell, William D. Strecker  
November 8, 1975

Over the PDP-11's six year life about 20,000 specimens have been built based on 10 species (models).  Although
range was a design goal, it was unquantified; the actual range has exceeded expectations (500:1 in memory size and
system price).  The range has stressed the basic mini(mal) computer architecture along all dimensions.  The main
PMS structure, i.e. the UNIBUS, has been adopted as a de facto standard of interconnection for many micro and
minicomputer systems.  The architectural experience gained in the design and use of the PDP-11 will be described
in terms of its environment (initial goals and constraints, technology, and the organization that designs, builds
and distributes the machine).

1.0  INTRODUCTION
---

Although one might think that computer architecture is the sole determinant of a machine, it is merely the focal point
for a specification.  A computer is a product of its total environment.  Thus to fully understand the PDP-11, it is
necessary to understand the environment.

Figure Org. shows the various groups (factors) affecting a computer.  The lines indicate the primary flow of
information for product functional behavior and for product specifications.  The physical flow of goods is nearly
along the same lines, but more direct: starting with applied technology (e.g., semiconductor manufacturers), going
through computer manufacturing, and finally to the service personnel before being turned over to the final user.
 
The relevant parts, as they affect the design are:

1. The basic technology--it is important to understand the components that are available to build from, as they
directly affect the resultant designs.
2. The development organization--what is the fundamental nature of the organization that makes it behave in a
particular way?  Where does it get inputs?  How does it formulate and solve problems?
3. The rest of the DEC organization--this includes applications groups associated with market groups, sales, service
and manufacturing.
4. The user, who receives the final output.

Note, that if we assume that a product is done sequentially, and each stage has a gestation time of about two years,
it takes roughly eight years for an idea from basic research to finally appear at the user's site.  Other organizations
also affect the design: competitors (they establish a design level and determine the product life); and government(s)
and standards.

There are an ever increasing number of groups who feel compelled to control all products bringing them all to a common
norm: the government(s), testing groups such as Underwriters Laboratory, and the voluntary standards groups such as
ANSI and CBEMA.  Nearly all these groups affect the design in some way or another (e.g. by requiring time).

2.0  BACKGROUND
---

It is the nature of engineering projects to be goal-oriented--the 11 is no exception, with much pressure on
deliverable products.  Hence, it is difficult to plan for a long and extensive lifetime.  Nevertheless, the 11
evolved more rapidly and over a wider range than we expected, placing unusual stress on even a carefully planned
system.  The 11 family has evolved under market and implementation group pressure to build new machines.  In this way
the planning has been asynchronous and diffuse, with distributed development.  A decentralized organization provide
checks and balances since it is not all under a single control point, often at the expense of compatibility.
Usually, the hardware has been designed, and the software is modified to provide compatibility.

Independent of the planning, the machine has been very successful in the marketplace, and with the systems programs
written for it.  In the paper (Bell et al, 1970) we are first concerned with market acceptance and use.  Features
carried to other designs are also a measure of how it contributes to computer structures and are of secondary
importance.

The PDP-11 has been successful in the marketplace with over 20,0000 computers in use (1970-1975).  It is unclear how
rigid a test (aside from the marketplace) we have given the design since a large and aggressive marketing and sales
organization, coupled with software to cover the architectural inconsistencies and omissions, can save almost any
design.  There was difficulty in teaching the machine to new users; this required a large sales effort.  On the
other hand, various machine and operating systems capabilities still are to be used.

2.1  GOALS AND CONSTRAINTS - 1970
---

The paper (Bell et al, 1970) described the design, beginning with weaknesses of minicomputers to remedy other goals
and constraints.  These will be described briefly in this section, to provide a framework, but most discussion of
the individual aspects of the machine will be described later.

Weakness 1, that of limited address capability, was solved for its immediate future, but not with the finesse it might
have been.  Indeed, this has been a costly oversight in redundant development and sales.

There is only one mistake that can be made in a computer design that is difficult to recover from--not providing enough
address bits for memory addressing and memory management.  The PDP-11 followed the unbroken tradition of nearly every
known computer.  Of course, there is a fundamental rule of computer (and perhaps other) designs which helps to alleviate
this problem: any well-designed machine can be evolved through at least one major change.  It is extremely embarrassing
that the 11 had to be evolved with memory management only two years after the paper was written outlining the goal of
providing increased address space.  All predecessor DEC designs have suffered the same problem, and only the PDP-10
evolved over a ten year period before a change was made to increase its address space.  In retrospect, it is clear
that since memory prices decline at 26% to 41% per year, and many users tend to buy constant dollar systems, then every
two or three years another bit is required for the physical address space.

Weakness 2 of not enough registers was solved by providing eight 16-bit registers; subsequently six more 32-bit
registers were added for floating point arithmetic.  The number of registers has proven adequate.  More registers
would just increase the context switching time, and also perhaps the programming time by posing the allocation dilemma
for a compiler or a programmer.

Lack of stacks (weakness 3) has been solved, uniquely, with the auto-increment/auto-decrement addressing mechanism.
Stacks are used extensively in some languages, and generally by most programs.

Weakness 4, limited interrupts and slow context switching has been generally solved by the 11 UNIBUS vectors which
direct interrupts when a request occurs from a given I/O device.

Byte handling (weakness 5) was provided by direct byte addressing.

Read-only memory (weakness 6) can be used directly without special programming since all procedures tend to be pure
(and reentrant) and can be programmed to be recursive (or multiply reentrant).  Read-only memories are used extensively
for bootstrap loaders, debugging programs, and now provide normal console functions (in program) using a standard
terminal.

Very elementary I/O processing (weakness 7) is partially provided by a better interrupt structure, but so far, I/O
processors per se have not been implemented.

Weakness 8 suggested that we must have a family.  Users would like to move about over a range of models.

High programming costs (weakness 9) should be addressed because users program in machine language.  Here we have no
data to suggest improvement.  A reasonable comparison would be programming costs on an 11 versus other machines.  We
built more complex systems (e.g., operating systems, computers) with the 11 than with simpler structures (e.g. PDP-8
or 15).  Also, some systems programming is done using higher level languages.

Another constraint was the word length had to be in multiples of eight bits.  While this has been expensive within DEC
because of our investment in 12, 18 and 36 bit systems, the net effect has probably been worthwhile.  The notion of
word length is quite meaningless in machines like the 11 and the IBM 360 because data-types are of varying lengths,
and instructions tend to be in multiples of 16 bits.  However, the addressing of memory for floating point is
inconsistent.

Structural flexibility (modularity) was an important goal.  This succeeded beyond expectations, and is discussed
extensively in the part on PMS, in particular the UNIBUS section.

There was not an explicit goal of microprogrammed implementation.  Since large read-only memories were not available
at the time of the Model 20 implementation, microprogramming was not used.  Unfortunately, all subsequent machines
have been microprogrammed but with some additional difficulty and expense because the initial design had poorly
allocated opcodes, but more important the condition codes behavior was over specified.

Understandability was also stated to be a goal, that seems to have been missed.  The initial handbook was terse and as
such the machine was only saleable to those really understood computers.  It is not clear what the distribution of
first users was, but probably all had previous computing experience.  A large number of machines were sold to
extremely knowledgeable users in the universities and laboratories.  The second handbook came out in 1972 and helped
the learning problem somewhat, but it is still not clear whether a user with no previous computer experience can
determine how to use a machine from the information in the handbooks.  Fortunately, two computer science textbooks
(Eckhouse, 75; and Stone and Siewiorek, 75) have been written based on the 11 to assist in the learning problem.

...
