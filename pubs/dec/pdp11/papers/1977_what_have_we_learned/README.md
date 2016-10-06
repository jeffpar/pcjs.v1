---
layout: page
title: What Have We Learned From The PDP-11? (1977)
permalink: /pubs/dec/pdp11/papers/1977_what_have_we_learned/
---

What Have We Learned From The PDP-11?
---

By C. Gordon Bell  
1977

In the six years that the PDP-11 has been on the market, more than 20,000 units in 10 different models have been
sold. Although one of the original system design goals was a broad range of models, the actual range of 500 to 1
(in cost and memory size) has exceeded the design goals.

The PDP-11 was designed to be a small computer, yet its design has been successfully extended to high-performance
models. This paper recollects the experience of designing the PDP-11, commenting on its success from the point of
view of its goals, its use of technology, and on the people who designed, built and marketed it.

1. INTRODUCTION
---

A computer is not solely determined by its architecture; it reflects the technological, economic, and human aspects
of the environment in which it was designed and built. Most of the non-architectural design factors lie outside the
control of the designer: the availability and price of the basic electronic technology, the various government and
industry rules and standards, the current and future market conditions. The finished computer is a product of the
total design environment.

In this chapter, we reflect on the PDP-11: its goals, its architecture, its various implementations, and the people
who designed it. We examine the design, beginning with the architectural specifications, and observe how it was
affected by technology, by the development organization, the sales, application, and manufacturing organizations, and
the nature of the final users. Figure 1 shows the various factors affecting the design of a computer. The lines
indicate the primary flow of information for product behavior and specifications. The physical flow of materials is
along nearly the same lines, but more direct: beginning with the applied technology manufacturers, material moves
through computer manufacturing and then to service personnel before delivery to the end user.

2. BACKGROUND: THOUGHTS BEHIND THE DESIGN
---

It is the nature of computer engineering to be goal-oriented, with pressure to produce deliverable products.
It is therefore difficult to plan for an extensive lifetime. Nevertheless, the PDP-11 evolved rapidly, and over
a much wider range than we expected. This rapid evolution would have placed unusual stress even on a carefully
planned system. The PDP-11 was not extremely well planned or controlled; rather it evolved under pressure from
implementation and marketing groups.

Because of the many pressures on the design, the planning was asynchronous and diffuse; development was distributed
throughout the company. This sort of decentralized design organization provides a system of checks and balances,
but often at the expense of perfect hardware compatibility. This compatibility can hopefully be provided in the
software, and at lower cost to the user.

Despite its evolutionary planning, the PDP-11 has been quite successful in the marketplace: over 20,000 have been
sold in the six years that it has been on the market (1970-1975). It is not clear how rigorous a test (aside from
the marketplace) we have given the design, since a large and aggressive marketing organization, armed with software
to correct architectural inconsistencies and omissions, can save almost any design.

It has been interesting to watch as ideas from the PDP-11 migrate to other computers in newer designs. Although
some of the features of the PDP-11 are patented, machines have been made with similar bus and ISP structures.
One company has manufactured a machine said to be "plug compatible" with a PDP-11/40. Many designers have adopted
the UNIBUS as their fundamental architectural component. Many microprocessor designs incorporate the UNIBUS notion
of mapping I/O and control registers into the memory address space, eliminating the need for I/O instructions without
complicating the I/O control logic. When the LSI-11 was being designed, no alternative to the UNIBUS-style architecture
was even considered.

An earlier paper [Bell et al. 701 described the design goals and constraints for the PDP-11, beginning with a
discussion of the weaknesses frequently found in minicomputers. The designers of the PDP-11 faced each of these
known minicomputer weaknesses, and our goals included a solution to each one. In this section we shall review the
original design goals and constraints, commenting on the success or failure of the PDP-11 at meeting each of them.

The first weakness of minicomputers was their limited addressing capability. The biggest (and most common) mistake
that can be made in a computer design is that of not providing enough address bits for memory addressing and management.
The PDP-11 followed this hallowed tradition of skimping on address bits, but it was saved by the principle that a good
design can evolve through at least one major change.

For the PDP-11, the limited-address problem was solved for the short run, but not with enough finesse to support a
large family of minicomputers. That was indeed a costly oversight, resulting in both redundant development and lost
sales. It is extremely embarrassing that the PDP-11 had to be redesigned with memory management only two years after
writing the paper that outlined the goal of providing increased address space. All predecessor DEC designs have suffered
the same problem, and only the PDP-10 evolved over a long period (ten years) before a change was needed to increase its
address space. In retrospect, it is clear that since memory prices decline 26 to 41% yearly, and users tend to buy
"constant-dollar" systems, then every two or three years another address bit will be required.

A second weakness of minicomputers was their tendency not to have enough registers. This was corrected for the PDP-11
by providing eight 16-bit registers. Later, six 32-bit registers were added for floating-point arithmetic. This number
seems to be adequate: there are enough registers to allocate two or three (beyond those already dedicated to program
counter and stack pointer) for program global purposes and still have registers for local statement computation. More
registers would increase the multiprogramming context switch time and confuse the user.

A third weakness of minicomputers was their lack of hardware stack capability. In the PDP-11, this was solved with the
autoincrement/autodecrement addressing mechanism. This solution is unique to the PDP-11 and has proven to be
exceptionally useful. (In fact, it has been copied by other designers.)

A fourth weakness, limited interrupt capability and slow context switching, was essentially solved with the device of
UNIBUS interrupt vectors, which direct device interrupts. Implementations could go further by providing automatic
context saving in memory or in special registers. This detail was not specified in the architecture, nor has it evolved
from any of the implementations to date. The basic mechanism is very fast, requiring only four memory cycles from the
time an interrupt request is issued until the first instruction of the interrupt routine begins execution.

A fifth weakness of prior minicomputers, inadequate character-handling capability, was met in the PDP-11 by providing
direct byte addressing capability. Although string instructions are not yet provided in the hardware, the common string
operations (move, compare, concatenate) can be programmed with very short loops. Benchmarks have shown that systems
which depend on this string-handling mechanism do not suffer for it.

A sixth weakness, the inability to use read-only memories, was avoided in the PDP-11. Most code written for the PDP-11
tends to be pure and reentrant without special effort by the programmer, allowing a read-only memory (ROM) to be used
directly. ROMs are used extensively for bootstrap loaders, program debuggers, and for normal simple functions. Because
large ROMs were not available at the time of the original design, there are no architectural components designed
specifically with large ROMs in mind.

A seventh weakness, one common to many minicomputers, was primitive I/O capabilities. The PDP-11 answers this to a
certain extent with its improved interrupt structure, but the more general solution of I/O processors has not yet been
implemented. The I/O-processor concept is used extensively in the GT4X display series, and for signal processing. Having
a single machine instruction that would transmit a block of data at the interrupt level would decrease the CPU overhead
per character by a factor of three, and perhaps should have been added to the PDP-11 instruction set.

Another common minicomputer weakness was the lack of system range. If a user had a system running on a minicomputer and
wanted to expand it or produce a cheaper turnkey version, he frequently had no recourse, since there were often no
larger and smaller models with the same architecture. The problem of range and how it is handled in the PDP-11 is
discussed extensively in a later section.

A ninth weakness of minicomputers was the high cost of programming them. Many users program in assembly language,
without the comfortable environment of editors, file systems, and debuggers available on bigger systems. The PDP-11
does not seem to have overcome this weakness, although it appears that more complex systems are being built successfully
with the PDP-11 than with its predecessors, the PDP-8 and PDP-15. Some systems programming is done using higher-level
languages; the optimizing compiler for BLISS-11, however, runs only on the PDP-10.

One design constraint that turned out to be expensive, but probably worth it in the long run, was that the word length
had to be a multiple of eight bits. Previous DEC designs were oriented toward 6-bit characters, and DEC has a large
investment in 12-, 18-, and 36-bit systems. The notion of word length is somewhat meaningless in machines like the
PDP-11 and the IBM System/360, because data types are of varying length, and instructions tend to be multiples of 16
bits.

Microprogrammability was not an explicit design goal, partially since the large ROMs which make it feasible were not
available at the time of the original Model 20 implementation. All subsequent machines have been microprogrammed, but
with some difficulty and expense.

Understandability as a design goal seems to have been minimized. The PDP-11 was initially a hard machine to understand,
and was marketable only to those who really understood computers. Most of the first machines were sold to knowledgeable
users in universities and research laboratories. The first programmers' handbook was not very helpful, and the second,
arriving in 1972, helped only to a limited extent. It is still not clear whether a user with no previous computer
experience can figure out how to use the machine from the information in the handbooks. Fortunately, several computer
science textbooks [Gear 74, Eckhouse 75, and Stone and Siewiorek 75] have been written based on the PDP-11; their
existence should assist the learning process.

We do not have a very good understanding of the style of programming our users have adopted. Since the machine can be
used so many ways, there have been many programming styles. Former PDP-8 users adopt a one-accumulator convention;
novices use the two-address form; some compilers use it as a stack machine; probably most of the time it is used as
a memory-to-register machine with a stack for procedure calling.

Structural flexibility (modularity) was an important goal. This succeeded beyond expectations, and is discussed
extensively in the UNIBUS section.

...
