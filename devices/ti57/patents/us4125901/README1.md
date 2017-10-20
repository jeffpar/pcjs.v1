BACKGROUND OF THE INVENTION
---------------------------

Electronic calculator systems of the type wherein all of the main electronic functions are integrated in a single
large cell integrated semiconductor chip or in a small number of such chips, are described in the following U.S. Patents,
which are assigned the assignee of this invention:

- U.S. Pat. No. 3,919,532 issued to Michael J. Cochran and Charles P. Grant on Nov. 11, 1975 and entitled "CALCULATOR SYSTEM HAVING AN EXCHANGE DATA MEMORY REGISTER".
- U.S. Pat. No. 3,934,233 issued to Roger J. Fisher and Gerald D. Rogers on Jan. 20, 1976 and entitled "READ-ONLY-MEMORY FOR ELECTRONIC CALCULATOR".
- U.S. Pat. No. 3,931,507 issued Jan. 6, 1976 to George L. Brantingham entitled "POWER-UP CLEAR IN AN ELECTRONIC DIGITAL CALCULATOR".

The concepts of these prior applications have made possible vast reductions in the cost of small personal-size
calculators.  Continuing efforts to reduce the cost of these products include the design of a single chip calculator
system for use in large capacity calculators, such as scientific or business calculators.  The chip disclosed herein
may be utilized in scientific or business calculators for instance, because this chip has provisions for a number
of storage registers, in addition to operational registers, as well as sufficient capacity to solve the more
complicated mathematical expressions and functions used in scientific and business calculators including, for example,
trigonometric and logarithmic relationships.

The present invention relates to an arithmetic unit and memory system for an electronic calculator or microprocessor.
An entire electronic calculator system including the arithmetic unit and memory system of this invention is disclosed.
The electronic calculator disclosed is a serial, word organized calculator; however, the invention disclosed is not
limited to that type of calculator.  In the prior art, such as that exemplified by the calculator disclosed in U.S.
Pat. No. 3,919,532, a plurality of AND and OR logic gates have been utilized for transferring data between the
operational registers and the arithmetic unit of a calculator.  Further the logic gates were arranged such that only
particular pairs of the operational registers could be inputted to the arithmetic unit at the same time.

It was one object of this invention therefore to provide register selector gates interconnecting the calculator memory,
i.e., the calculators operational registers, with the inputs of the arithmetic unit.  It was another object of this
invention to permit this data stored in any two of the operational registers to be inputted to the arithmetic unit at
the same time.

It is yet another object of this invention to permit the data outputted from the arithmetic unit to be inputted to a
selected one of either of the two registers providing inputs to the arithmetic unit.  It is still another object of this
invention to simplify the register selector gates by using MOS transfer gates for interconnecting the operational
registers with the inputs of the adder as opposed to using the more complex AND and OR logic gates of the prior art.

The foregoing objects are achieved according to the present invention as is now described.  In a preferred embodiment
of the invention, an arithmetic unit and memory system including a plurality of selector gates are implemented on a
semiconductor chip.  The memory preferably comprises a plurality of operational registers and the arithmetic unit
preferably has two inputs and an output and performs arithmetic operations on data received at the inputs and
communicates the results thereof to the output.  The operational registers and the inputs of the arithmetic unit are
interconnected by a plurality of operational register selector gates arranged to permit any selected two of the plurality
of operational registers to be connected to the input of the arithmetic unit.  Further, additional selector gates are
preferably provided for interconnecting the output of the arithmetic unit with a selected one of the operational
registers connected to the inputs of the arithmetic unit.  Still further, in a preferred embodiment of the invention,
the aforementioned selector gates comprised simple MOS transfer gates as opposed to more complex AND/or OR logic gates.

BRIEF DESCRIPTION OD THE DRAWINGS
---------------------------------

The novel features believed characteristic of the invention are set forth in the appended claims.  The invention itself,
however, as well as a preferred mode of use, further objects and advantages thereof, will be best understood by reference
to the following detailed description of an illustrative embodiment when read in conjunction with the accompanying drawings,
wherein:

FIG. 1 is a pictorial view of a portable, electronic, hand-held calculator of the type which may embody the present
invention;

FIG. 2 is a functional schematic diagram of a single chip calculator system of the type which may embody the present
invention;

FIG. 3 depicts a functional block diagram of the single chip calculator system embodying the present invention;

FIGS. 4(a) and 4(b) depict the timing signals generated by a clock implemented in the calculator system, the timing
signals being shown in representative form;

FIGS. 5(a) and 5(b) depict a segmented display and a manner in which a calculator system may be interconnected therewith;

FIGS. 6(a) and 6(b) depict the format of the data word stored in the operational and storage registers of the calculator
system, the MASK codes which are used in the instruction words implemented in the read-only-memory and how these various
masks relate to the data words;

FIGS. 7(a)-7(c) form a logic diagram of the program counter, the branch logic, the test circuitry, the subroutine stack
and the read-only-memory of the calculator system;

FIGS. 8(a)-8(i) form a logic diagram of the instruction word decoder logic; the operational registers, the storage
registers, the register address buffer, and the 45 counter associated with the storage registers;

FIG. 9 is a logic diagram of the operational register selector gates;

FIGS. 10(a)-10(d) form a logic diagram of the arithmetic unit and the R5 register;

FIGS. 11(a)-11(f) form a logic diagram of segment/keyboard scan and scan generator counter, keyboard logic, display
decoder, output register and state time generator;

FIGS. 12(a)-12(g) depict the format of various instruction words described in Table I;

FIG. 13 is a logic diagram of circuits used to interconnect the test circuitry of FIG. 7 with the K1-K4 keyboard line
pins of FIG. 11; and

FIG. 14 depicts alternate embodiments of register architecture for the operational and storage registers of the system.

DETAIL DESCRIPTION OF SPECIFIC EMBODIMENT
-----------------------------------------

Referring to FIG. 1, an electronic portable calculator the type which may employ features of this invention is shown
in pictorial form.  The calculator [1-1] comprises the keyboard [1-2] and the display [1-3].  The display [1-3], in one
embodiment, consists of twelve digits or characters, each provided by an array of light-emitting diodes, a vacuum
fluorescent tube, liquid crystal devices or other display means.

![FIG. 1](us4125901-fig1.png)

The display is preferably implemented having eight mantissa digits, two exponent digits, and two annotator places for
signs, et cetera (one place for the mantissa and one place for the exponent), thereby permitting outputting of data in
scientific notation.  Ordinarily, the display would be of the seven segment or eight segment variety, with provision
for indicating a decimal point for each digit.

The keyboard [1-2] or other such input means preferably includes a set of number keys (0-9), a decimal point key, a
plurality of function command keys including, for example, exponential, logarithm and trigonometrical functions.  The
exponential and logarithmic function command keys include, for example, X^2, the square root of X, the reciprocal of 
X, e^X, the common log of X, and the natural log of X.  The trigonometrical functions include for instance the sine,
cosine, tangent and their inverses, the hyperbolic sine, hyperbolic cosine, and hyperbolic tangent of X and inverse
hyperbolic functions.

Other function command keys include store (STO), and recall (RCL), keys for respectively storing and recalling a number
stored in one of the memory or storage registers implemented on the chip.  The enter exponent key (EE) allows exponent
entry of the number displayed in scientific notation.  A plus/minus key is provided for changing the sign of the display
number.  An exchange key (X:Y) is provided for exchanging operator and operand of an arithmetic function.  More
conventional function command keys are supplied, including the clear key (C), the clear entry key (CE), and the plus (+),
minus (-), multiply (&times;), divide (&divide;), and equal (=) keys.

Referring now to FIG. 2 there is shown a functional schematic diagram of the signal chip calculator system.  A single
chip [2-10] is shown here in a standard twenty-eight pin dual-in-line package; however, it is to be understood that how
the chip [2-10] is shown as being interconnected with a twelve-character display [2-11] utilizing a segment scan
technique.  Each of the 7 segments of the character plus the decimal point for each character position are individually
connected in common to the segment scan conductors [2-14].  An individual common lead for each character position is
connected by bus [2-15] to chip [2-10].  The details of segment scanning are explained with reference to FIGS. 3 and 5
and it should be evident to one trained in the art that the number of segments selected and the number of characters
selected is a design choice.

![FIG. 2](us4125901-fig2.png)

Chip [2-10] is interconnected with an X/Y matrix keyboard [2-12] utilizing five column conductors [2-16'] and eight row
conductors [2-14'], the row conductors [2-14'] being individually connected to the segment scan conductors [2-14] and the
column conductors [2-16'] being individually connected via bus [2-16] to chip [2-10].  An X/Y matrix keyboard having five
column conductors [2-16'] and eight row conductors [2-14'] may accommodate up to 40 switches located at the intersections
of the conductors; however, the number of conductors [2-14'] and [2-16'] and consequently the number of switches is a
design choice.  The chip [2-10] is further connected to a source of DC electrical power through a common connection V(ss)
at pin 1, a V(dd) connection at pin 2, and a V(DISP) connection at pin 3 for the display.  Further, a resistor [2-13] is
connected between pins 28 and 1 as a means of controlling the chip's oscillator frequency.  External resistor [2-13] could
of course be implemented on chip [2-10], however, resistor [2-13] is preferably implemented off chip [2-10] in order to
be able to "fine tune" the frequency of the clock oscillator implemented on chip [2-10].

Referring now to FIG. 3 there is shown a functional block diagram of the single chip calculator system of this
invention showing various circuits implemented on chip [2-10].  A detailed description of the individual function blocks
will be discussed subsequently with regard to FIGS. 7, 8, 9, 10 and 11, with only a general functional description of
the basic system here set forth.  It is to be understood that on the block diagram of FIG. 3, a connection represented
by a single line may represent a plurality of actual hardware interconnections, and for ease and simplicity of illustration,
a single line may represent a plurality of different functions.

![FIG. 3](us4125901-fig3.png)

The calculator system of this invention includes on chip [2-10] a main program read-only-memory (ROM) [3-30], preferably
having two sections which may be referred to as ROM A and ROM B.  The reason for denoting that ROM [3-30] has two sections
will be subsequently explained in regard to the instruction words implementable in ROM [3-30].  Main program ROM [3-30]
is responsive to an eleven bit ROM address (A10-A0) stored in program counter [3-32a] and produces, in response thereto,
a thirteen bit instruction word (I12-I0), which is provided to instruction word decoder logic [3-31].  Instruction word
decoder logic [3-31] interprets the instruction word received from ROM [3-30] and produces in response thereto a plurality
of command signals to the other circuits implemented on chip [2-10].  These command signals direct how data is transferred
within chip [2-10], how the data is manipulated by arithmetic unit [3-40] and serves several other functions which will
be explained with reference to the circuits receiving the command signals.

Program counter circuit [3-32a] includes an add-one circuit and is associated with branch logic [3-32b].  The add-one
circuit in program counter [3-32a] increments the ROM address stored in the address register in program counter [3-32a] by
adding the number one to the address stored in the address register during each instruction cycle, thereby causing the
instruction words stored in ROM [3-30] to be read out sequentially.  At times, however, it is advantageous to be able to
execute the same instruction word repetitively and therefore the add-one circuit in program counter [3-32a] is responsive
to a HOLD command which disables the add-one circuit allowing the address stored in program counter [3-32a] to remain
unchanged.  Branch logic [3-32b] is responsive to commands generated by instruction word decoder logic [3-31] for inserting
a new ROM address in program counter [3-32a], thereby permitting the program stored in ROM [3-30] to "branch" to a new
location in ROM [3-30] rather than cycling sequentially through the instruction words stored in ROM [3-30].  As will be seen
with respect to the discussion of the instruction word set and the details of the branch logic [3-32b] and program counter
[3-32a] circuits, a branch instruction received from instruction word decoder logic [3-31] may be either a conditional or
an unconditional branch.  If unconditional, the branch automatically occurs.  If conditional, however, the branch
instruction is executed only if the state of the condition latch [3-41] matches the state of a selected bit in the
conditional branch instruction.  If a match does not occur, program counter [3-32a] merely cycles to the next sequential
ROM address.  Thus, branch logic [3-32b] and program counter [3-32a] circuits are interfaced with conition latch [3-41].

If a branch is to be accomplished, the program counter must be updated with the new ROM address by branch logic [3-32b].
This new ROM address is typically derived from the branch instruction, but as will be seen from the discussion regarding
the instruction word set, the new ROM address may also be derived from an address stored in an auxiliary register called
R5 register [3-34].  Since R5 register [3-34] can be loaded with an address corresponding the depression of a particular
switch or key on keyboard matrix [2-12] (FIG. 2) or with number from an operational register [3-38] supplied via arithmetic
unit [3-40], the new ROM address can be made dependent on the particular keyboard key depressed or can be an "indirect"
address generated in one of the operational registers.

Branch logic and program counter circuit [3-32] is further interconnected with a subroutine stack [3-33].  Subroutine
stack [3-33] is preferably a three level stack having eleven bits per level which receives an incremented ROM address
from program counter [3-32a] in response to an unconditional branch command (CALL) and supplies the most recently received
ROM address back to program counter [3-32a] in response to a RETURN command received from instruction word decoder logic
[3-31].  The ROM address loaded into subroutine stack [3-33] in response to an unconditional branch command is the
incremented address to which program counter [3-32a] would have otherwise cycled.  Therefore, when an unconditional branch
instruction is encountered in ROM [3-30], program counter [3-32a] is caused to branch to the address specified by the
unconditional branch command and then increments that address by one each instruction cycle until another branch or a
return command is received.  When a return command is encountered, the most recently stored address in subroutine
stack [3-33] is loaded back into program counter [3-32a], thus the addressing of the program stored in ROM [3-30] "returns"
to the instruction address following the last unconditional branch instruction word location.  Since subroutine stack
[3-33] is a three level stack, three levels of "subroutining" are possible.  Should a fourth address be loaded into
subroutine stack [3-33], the first stored address is lost and only the second through fourth address will remain in
subroutines stack [3-33].

R5 register [3-34] is an eight bit register which stores the two least significant digits generated by arithmetic
unit [3-40] unless keyboard logic [3-35] in combination with a keyboard scan circuit in the scan generator/counter [3-36]
indicates that one of the calculator keyboard keys has been depressed, in which case, an address associated with the
key depressed is loaded into R5 register [3-34].  The keyboard key address loaded into R5 register [3-34] may then be
loaded into program counter [3-32a] upon a "Branch on R5" instruction command, thereby permitting the keyboard to
address ROM [3-30].  Alternatively, a "branch on R5" instruction command may be utilized to perform indirect addressing
by using the contents of one or two of the operational registers [3-38], as aforementioned.  Since program counter [3-32a]
is an eleven bit counter, the three most significant bits (MSB's) are loaded with zeros when the eight bit address
from R5 register [3-34] is loaded into program counter [3-32a]. 

Referring briefly to FIG. 6a, the format of the data stored in the various operational and storage registers
implemented on chip [2-10] is depicted along with the effect of the various mask codes used in many instruction words.
With respect to the format of the data, it can be seen that there are sixteen digits (D0-D15) in a data word;
preferably, the three most significant digits (MSD's) provide twelve flag bits and the thirteen least significant digits
(LSD's) provide thirteen digits for numeric data.  However, as will be seen, the calculator system disclosed has
sufficient flexibility to permit the three MSD's to be used either partially or totally for data storage in addition
to the thirteen LSD's, if desired during certain operations.  Whether the calculator is operating in hexadecimal or
binary coded decimal (BCD), four binary bits are required to represent each digit.  The data word is serially organized,
so each data word comprises 64 (e.g. 16 X 4) binary bits.

![FIG. 6a](us4125901-fig6a.png)

Referring again to FIG. 3, chip 2-10 is provided with four operational registers (register A-D) 3-38 and sixteen data
storage registers (X0-X7 and Y0-Y7) 3-39.  The operational registers 3-38 and the storage registers 3-39 are each
64 bit shift registers, accommodating the 64 bit format of the data words.  The sixteen data storage registers 3-39 are
separated into X and Y groups, each group comprising eight serially connected registers, thus each group of eight
registers may be viewed as a 512 (e.g. 64 X 8) bit shift register.  Both groups of shift registers are interconnected
with storage register input-output (I/O) circuit 3-42.  The first bit clocked out of a storage register 3-39 is the
least significant bit of digit D0.

The operational registers 3-38 are similarly 64 bit registers, the 3-38a portion having sixty bits of capacity and
the 3-38b portions having four bits of capacity.  The operational registers 3-38, including the point of junction between
3-38a and 3-38b portions, are interconnected with a plurality of register selector gates 3-43 which control the exchange
of data between the operational registers and with arithmetic unit 3-40.  As will be subsequently discussed in greater
detail, the separation of operational registers A-D 3-38 into the aforementioned sixty bit and four bit portions and the
connection therebetween with register selector gates 3-43, facilitates right or left shifting of data, because then it
is desirable for the register selector gates 3-43 to be able to selectively pick off the data word starting with the
D15 digit, which is stored in portion 3-38b or the D0 digit, which is stored in portion 3-38a at the beginning of an
instruction cycle (state S0) for instance.  Storage register I/O circuit 3-42 is interconnected with register A to
permit movement of a data word between a selected storage register 3-39 and operational register A.

A data word may be either outputted from Register A 3-38 and stored in a selected storage register and stored
in Register A.  To effect such movement of a data word between Register A and a selected storage register 3-39, an
appropriate instruction word from ROM 3-30 is received by instruction word decoder logic 3-31 indicating (1) from which
group, X or Y, the particular storage register 3-39 is to be selected and (2) whether the data word is being moved from
Register A to a storage register or from a storage register to Register A.  The contents of an address register,
register address buffer (RAB) 3-44, indicates which one of the eight storage registers in the addressed group is being
selected.

RAB 3-44 is a three bit address register which can be loaded either from R5 register (three least significant bits)
or from three selected bits of an instruction word as directed by appropriate instruction commands.  The data words
stored in the eight storage registers 3-39 in each group normally recirculate, with each 64 bit data word moving to an
adjacent storage register location during each instruction cycle.  Thus, during one instruction cycle the contents of
X0 shifts to X1 while the contents of X1 shifts to X2 and so forth.  This shifting, of course, is responsive to the
outputs from clock 3-45; Storage register I/O circuit 3-42 further includes a three bit counter which is likewise
responsive to clock generator 3-45 for indicating which one of the eight data words stored in the addressed group is
ready to be read out of X7 or Y7.  Thus the three bit counter implemented in storage register I/O circuit 3-42
increments by one each instruction cycle.  When a data word is to be read from or into a selected storage register 3-39,
RAB 3-44 is first loaded with a three bit binary number indicating which one of the eight data word locations in a group
is to be addressed.  Then an instruction word is decoded by instruction word decoder logic 3-31 commanding storage
register I/O circuit 3-42 to select the proper group, X or Y, and to count instruction cycles until the counter contained
therein matches the state of RAB 3-44.  Thus it can be seen that it could require up to seven instruction cycles for the
selected data word in one of the groups, X or Y, to be shifted into a position preparatory to reading out of or into that
group.  Thus storage register I/O circuit 3-42 generates the HOLD command which inhibits incrementing program counter
3-32 until the counter in storage register I/O circuit 3-42 matches the state of RAB 3-44 and the desired data is moved
between the appropriate group and Register A.

Arithmetic unit 3-40 is a serially organized arithmetic unit which includes a binary coded decimal (BCD) corrector.
The BCD corrector may be disabled by an appropriate instruction command thereby permitting arithmetic unit 3-40 to operate
either in hexadecimal base or in binary coded decimal base, as desired.  As aforementioned, the data format preferably
includes twelve flag bits.  These flag bits are used, for instance, during many problems for keeping track of the results
of certain logical operations.  Including the flag bits in the data words stored in the operational registers 3-38A and
3-38B and in the storage registers 3-39 is an important feature of this invention which permits greater programming
flexibility in implementing the instruction words into ROM 3-30 and further simplifies chip 2-10 in that it eliminates
the need for the discrete or dedicated flag registers or latches used in the prior art, and permits the flags to be
processed in arithmetic unit 3-40 rather than in separate flag logic circuitry as done in the prior art.  Arithmetic unit
3-40 is responsive to selected flag bits and selected instruction commands (Table I, Section 7) for setting the condition
latch 3-41.  Thus, in accordance with selected instruction words (Table I, Section 7), the twelve flags may be individually
set, reset, toggled, or tested.  Further, the three MSD's used for flags may be arithmetically operated upon in
hexadecimal using appropriate instruction words (see Table I) with appropriate flag masks (see FIG. 6).

The "set flag" instruction (see Table I, Section 7) loads a binary one into the addressed flag bit, while the "reset
flag" instruction loads a zero; and "toggle" changes a zero flag to one or a one flag to a zero.  The "flag test"
instruction causes the condition latch (COND) to be set only if the tested flag has been previously set, e.g., contains
a binary one.  Thus the flag bits can be advantageously used to determine whether or not a conditional branch instruction
will cause a branch to occur.

Register A and Register B are outputted to display decoder 3-46 in response to a display instruction command.  The
contents of Register A contains the digits to be displayed by the display 2-11 (FIG. 2) and Register B is loaded with
bits which indicate the position of the decimal point and whether or not a particular digit is to be blanked.  By using
Register B to store digit blanking and non-blanking codes along with a decimal point and negative sign codes, which
codes are loaded into Register B in accordance with instruction words contained in ROM 3-30, is another important feature
of this invention eliminating the need for using discrete leading zero blanking circuitry, as used in the prior art.
The display decoder 3-46 is connected to output register 3-47 which provides the digit scan lines to the display 2-11
via lines 2-15.  The scan generator 3-36, display decoder 3-46 and output register 3-47 cooperate to drive display 2-11
(FIG. 2) using the segment scan display technique disclosed by U.S. Pat. application Ser. No. 565,489 filed Apr. 7, 1975,
now U.S. Pat. No. 4,014,012, and assigned to the assignee of this invention.

Referring now to FIGS. 4a and 4b, there is shown, in representative form, the timing signals generated by the
clock generators 3-45 implemented on chip 2-10.  The clock generators 3-45 may be of conventional design, and are
not shown in detail herein.  The clock generators sequentially generate &Phi;1, P1, &Phi;2 and P2 clock pulses, each
pulse having a pulse width time of approximately 0.625 microsecond in this embodiment.  The precise frequency
of the clock generator is typically "fine tuned" using an external resistor 2-13 (FIG. 2).  A full sequence of the four
above-identified clock pulses comprise one state time (S0, S1, S2, etc.), each state time having a duration of
approximately 2.5 microseconds in this embodiment.

![FIG. 4a](us4125901-fig4a.png)

![FIG. 4b](us4125901-fig4b.png)

One state time represents the time needed for two bits of a data word to be clocked out of a register.  Thus, it
requires two state times for a four bit hexadecimal or BCD numeral to be inputted into the arithmetic unit 3-40 from
an operational register 3-28.  Since sixteen digits in all comprise one data word (as is shown in FIG. 6), thirty-two
state times (S0-S31) are required to output all sixteen digits from a register.  Thus, thirty-two state times (S0-S31)
represent one instruction cycle, as is depicted in FIG. 4b, and an instruction cycle has a duration of approximately
80 microseconds in this embodiment. The state times are generated by state time generator 3-48.

As will subsequently be discussed, the clock is responsive to a decoded display instruction for slowing the speed
of the clock during display operations.  During display operation, the period of a state time is ten microseconds and
the period of an instruction cycle is 320 microseconds.

In addition, clock pulses may be provided at every P1 and P2 time which are simply labeled P and other clock pulses
are provided at every &Phi;1 and &Phi;2 time, which are simply labeled &Phi;, as is shown in FIG. 4a.  Further, clock
pulses are provided at selected P or &Phi; times in selected state times (for instance S1.&Phi;2), as is also exemplified
in FIG. 4a.

Referring now to FIGS. 5a and 5b, there is shown diagrammatically in FIG. 5a the ten decimal digits, 0-9,
displayable by a seven segment character display along with an eighth segment used as a decimal point.  With
respect to FIG. 5b, the seven character segments are labeled segments A - G and the decimal point segment is
labeled P.  For each character position there is a common cathode 5-9 provided for the eight segments, as is
shown in FIG. 5b.  The eight segments A-G and P for each character position are respectively connected in
common by segment conductors SA-SG and SP.  Chip 2-10 uses segment scanning according to the method disclosed by
U.S. Pat. No. 4,014,012, which issued Mar. 22, 1977 wherein the segments are scanned sequentially and the digit
cathodes are selectively energized in conjunction with the scanning of the segment electrodes to form the characters
0-9 and a decimal point.  By using the segment scanning method of U.S. Pat. No. 4,014,012, the segment amplifiers
generally used heretofore in the prior art are eliminated.  Thus, chip 2-10 may be directly interconnected
with display 2-11.

![FIG. 5a](us4125901-fig5a.png)

![FIG. 5b](us4125901-fig5b.png)

Referring again to FIG. 3, scan generator counter 3-36 sequentially energizes the SA-SG and SP conductors (FIG. 5b)
via lines 14 and pins SEG A-SEG G and SEG P (FIG. 11).  Output register 3-47 is loaded each time a different segment
is scanned with a twelve bit binary code indicating whether the cathodes 5-9 (FIG. 5b), associated with each of the
twelve character positions, should be energized via lines 2-15 and pins D1-D12 (FIG. 11) permitting the scanned segment
in the corresponding character positions to actuate.

Referring again to FIG. 6a, there is shown the format of the data word stored in operational registers 3-38A and
3-38B and storage registers 3-39 (FIG. 3).  As aforementioned, each data word comprises sixteen digits of serial
data, each digit comprising four serial bits.  Thus, an 25 entire data word comprises 64 (e.g., 16 X 4) bits.  The
three most significant digits of the data word preferably comprise the twelve flag bits and the thirteen remaining
digits comprise numeric data, the first eleven digits thereof preferably being the mantissa and the least significant
two digits being the exponent.

As aforementioned, associating the twelve flag bits with the thirteen digits of numeric data in one data word storage
location is an important feature of this invention which eliminates the need for separate flag registers.

In FIG. 6b there is shown the mask codes which are incorporated in many of the instruction words implemented in ROM
3-30; the set of instruction words rotatable in ROM 3-30 and decodable by instruction word decoder logic 3-31 (FIG. 3)
are described in TABLE I.  The set of introduction words stored in ROM 3-30 in this embodiment are listed in TABLE IV.
As can be seen from TABLE I, a mask field code (MF) is used in many of the possible instruction words.  The mask field
denotes to the register selector gates 3-43 (FIG. 3) which digits of the sixteen digit data words are to be passed to
the arithmetic unit 3-40 (FIG. 3) and which digits are to be recirculated.  The mask codes are needed, because it is
often desirable to perform some arithmetic or flag logic operation on only the mantissa or only the exponent or both the
mantissa and the exponent or on a particular flag bit or perhaps the whole data word.

As can be seen from FIG. 6b, there are twelve masks, having codes 0000 through 1011, which are listed and are associated
with a rectangle beneath a representation of a sixteen-digit data word.  The digits enclosed by the rectangle associated
with a particular mask are permitted (by the mask decoder logic 8-200 (FIG. 8) in instruction word decoder logic 3-31
when the associated mask code is received) to pass through arithmetic unit 3-40 while those digits outside the rectangle
are recirculated via gates 9-316a-d (FIG. 9).  As will be seen with respect to the detailed discussion ofthe mask logic
(FIG. 8), the mask codes cause the register selector gates 3-43 (FIGS. 3 and 9) to operate in timed relation with the data
being outputted from an operational register 3-38 in accordance with the state times indicated by state time generator 3-48
(FIG. 3).  The masks of FIG. 6b operate on complete digits, but certain individual bits may be selected by further mask
arrangements as will be explained henceforth.

Referring now to FIG. 12, TABLE 1, there are shown the set of possible instruction words stored in 5 ROM 30, decoded by instruction word decoder logic 31 and utilized by the remainder of the system. T ABLE 1 refers to FIG. 12 for drawings representative of the various types of instructions. As can be seen, the in- struction word comprises thirteen binary bits (I12-Io). A 10 thirteen bit instruction word length provides for the possibility of having up to 213 or approximately 8,000 different instruction codes; however, it will soon be evident that not all these possible instructions are used. Looking first to the first two instructions, namely the 15 "branch on condition" and the "branch uncondition- ally" instructions, it will be seen that there is a 1 in the
I 12 position. Since all remaining instructions use a 0 in the 112 position, it will be seen that there are approxi- mately 4,000 variations of the first two instructions. The 20 "branch unconditionally" instruction has a zero in the
Iu position following the one in the I12position and an address in the I10-I0positions. Since the "branch uncon- ditionally" address contains 11 bits and since the pro- gram counter 32a contains 11 bits, the "branch uncondi- 25 tionally" instruction can cause the branch anywhere within ROM 30, including branches between ROM A and ROM B. The "branch on condition" instruction" instruction, on the other hand, contains only a ten bit address because the I10 bit is used as a condition bit. If 30 the state of the condition bit (Iw) matches the state of the condition latch, the branch will occur; if there is not match, the branch instruction is ignored. There being only ten bits in the address for the "branch on condi- tion" instruction, when the branch is executed only the 35 ten least significant bits are loaded into the eleven bit address register of program counter 32a. The most significant bit in the program counter remains un- changed. Since a zero in the most significant bit (AIO) in the program counter addresses only those instruction 40 words in that part of ROM 30 denoted as ROM A, and
a one in the most significant bit (Aw) in the program counter addresses only those instruction words located
in that portion of ROM 30 denoted as ROM B, the "branch on condition" instruction only permits branch- 45 ing within the confmes of either ROM A or ROM B. The unconditional branch instruction may be also con- sidered a "CALL" instruction inasmuch as an incre- mented address (the location following the location of the unconditional branch instruction) is stored in the 50 subroutine stock 33 if the branch is accomplished.

![FIG. 6b](us4125901-fig6b.png)

TABLE I
-------

INSTRUCTIONS:

1. Branch on condition: See FIG. 12(a). Program counter branches to location defined by A field (10 bits) only if C bit is the same state as is COND in the condition latch. 
2. Branch Unconditionally (CALL): See FIG. 12(b). Program counter branches to location defined by A field (11 bits). Incremented address being branched from is stored in subroutine stack.
3. Branch to R5: See FIG. 12(c). Program counter branches to location defined by contents of R5 Register. Field Q is ignored.
4. Return: See FIG. 12 (d). Program counter branches to location defmed by the last address to be stored in subroutine stack. Field Q is ignored.
5. Operations under Mask Control: See FIG. 12(e)
	- MF: One of twelve masks. See FIG. 6(b)
	-  J:
		- 00: Operational Register A
		- 01: Operational Register B
		- 10: Operational Register C
		- 11: Operational Register D
	-  K:
		- 000: A is added to or subtracted from contents of register defined by J
		- 001: B is added to or subtracted from contents of register defined by J
		- 010: C is added to or subtracted from contents of register defined by J
		- 011: D is added to or subtracted from contents of register defined by J
		- 100: Decimal one is added to or subtracted from contents of register defined by J
		- 101: Register defined by J is right or left shifted one digit
		- 110: R5 (LSD) is added to, subtracted from, or stored in the Register defined by J
		- 111: R5 (both digits) is added to, subtracted from, or stored in the Register defined by J
	- L:
		- 00: Arithmetic result to register defined by J
		- 01: Arithmetic result to register defined by K (K=000-011 only)
		- 10: Arithmetic result suppressed (K=000-100 only) or shift operation (K=101)
		- 11: See LN field explanation
	- N:
		- 0: Add (Left Shift)
		- 1: Subtract (Right Shift)
	- LN:
		- 110: Register to A Register exchange (J=00 only). Content of Register A is exchanged with contents of an
operational register defined by K (K=000, 001, 010 or 011 only). Any exchange instruction using a mask involving D15
cannot be followed by a register instruction using a mask involving D0.
		- 111: Register to Register Store. Content of register defined by K (K=000, 001, 010, 011, 110 or 111 only)
is stored in register defined by J. If K is 100, decimal one is stored in LSD and zero in all other digits in register
defined by J (mask control digits only affected).
6. Non-Mask Operations (misc): See FIG. 12(1). Unless otherwise specified, instruction is not dependent on content of Q.
	- P 0000: STYA - Contents of one Y group storage register defined by RAB is loaded into register A
	- P 0001: NAB - 3 LSD of Q are stored in RAB
	- P 0010: See "branch to R5" location instruction
	- P 0011: See "return" instruction
	- P 0100: STAX - Content of register A is loaded into the X group storage register defined by RAB
	- P 0101: STXA - Contents of the X group storage register defined by RAB is loaded into Register A
	- P 0110: STAY - Contents of Register A is loaded into the Y group storage register defined by RAB
	- P 0111: DISP - Register A and Register B are outputted to the display decoder and the keyboard is scanned. A closed keyboard switch loads K5 and sets condition latch.
	- P 1000: BCDS - BCD set - enables BCD corrector in arithmetic unit
	- P 1001: BCDR - BCD reset - disables BCD corrector in arithmetic unit which then functions hexadecimal
	- P 1010: RAB - LSD of R5 (3 bits) is stored in RAB
	- P 1011: Not Used
	- P 1100: Not Used
	- P 1101: Not Used
	- P 1110: Not Used
	- P 1111: Not Used
7. Non-Mask Operations (Flag Operations): See FIG. 12(g)
The Flag Operation - Toggle, set, reset and test - are performed by arithmetic unit on flag address in register J,
digit D and bit B. Flag test sets the condition latch if the flag is set; otherwise the condition latch is not affected.
Toggle flag changes 1 to 0 or 0 to 1.
	- J 00: A
	- J 01: B
	- J 10: C
	- J 11: D
	- D 01: D13
	- D 10: D14
	- D 11: D15
	- B 00: LSB
	- B 01: LSB
	- B 10: LSB
	- B 11: MSB
	- F 00: Set Flag
	- F 01: Reset Flag
	- F 10: Test Flag
	- F 11: Toggle Flag
