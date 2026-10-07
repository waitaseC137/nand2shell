# 🧮 From Switches to a Computer — ALU Instruction: One Command, Three Answers

> This level opened with a table. The first question was about the outputs: what
> is R, what is j? Then a "why" got stuck: the game says "bit 12", but why 12?
> Right after the answer was found, a wire went to the wrong pin, because "the
> 12th bit", counted from zero, lands on 11. On the first Check, two of three
> test rows passed and one failed. Only later did it turn out that the two
> passing rows had passed by chance.

---

## 📋 Table of Contents

- [What Does This Part Do?](#what-does-this-part-do)
- [R and j](#r-and-j)
- [When a Command Is Spread onto Wires](#when-a-command-is-spread-onto-wires)
- [Y: A or *A?](#y-a-or-a)
- [Why Bit 12?](#why-bit-12)
- ["12th Bit" and "Bit 12"](#12th-bit-and-bit-12)
- [j: Who Answers the Question?](#j-who-answers-the-question)
- [🎮 Now You Build It](#-now-you-build-it)
- [Reading a Command by Hand](#reading-a-command-by-hand)
- [Tests That Passed by Chance](#tests-that-passed-by-chance)
- [One of Three Questions Answered](#one-of-three-questions-answered)

---

## What Does This Part Do?

The second level of the Processor unit. The landscape:

```
inputs:    I (16 bits, the command) · A · D · *A (16 bits each)
outputs:   R (16 bits) · a · d · *a · j (1 bit each)
box:       nand · alu · condition · 16 bit splitter · and 16 · add 16 · select 16 · inv 16 · 0
```

The window that opens:

> *"I is an instruction to the ALU and condition components. The bits direct the
> operation as specified:"*

| bit | group | flag |
|:-:|---|---|
| 10 | ALU | `u` |
| 9 | ALU | `op1` |
| 8 | ALU | `op0` |
| 7 | ALU | `zx` |
| 6 | ALU | `sw` |
| 5 | destination | `a` |
| 4 | destination | `d` |
| 3 | destination | `*a` |
| 2 | condition | `lt` |
| 1 | condition | `eq` |
| 0 | condition | `gt` |

> *"The X input to the ALU should be D, the Y input should be either A or *A
> depending on bit 12 in the instruction. If bit 12 is 0, it is A, if 1, *A.
> The R output is the result of the ALU operation. The j flag indicate if the
> ALU output conforms to the conditions specified in bit 0-2."*

On the screen the inputs sit in two groups: `I` on its own, and `A`, `D` and
`*A` under the **State** heading. Among the outputs, `a`, `d` and `*a` sit under
the **Destination** heading.

In one sentence: *give me a command and three values; I'll do the calculation
the command asks for, and tell you the result, where the result should be
written, and whether the result meets the condition.*

> 🔑 **There is no register in this circuit, and no `cl` either.** `A`, `D` and
> `*A` come in from outside; `a`, `d` and `*a` go out. The circuit writes
> nowhere; it calculates and says where to write.

---

## R and j

When the level opened, the first question was about the outputs: *"R has shown
up, j has shown up, what are these?"*

**R** stands for *result*: the output of the calculation the ALU does with this
command. A 16-bit number.

**j** stands for *jump*. A single bit. The question it answers: *"Does the result
meet the condition the command asks for?"* The last three bits of the command
choose the condition:

| flag | if 1, it asks |
|---|---|
| `lt` | is the result less than zero? |
| `eq` | is the result equal to zero? |
| `gt` | is the result greater than zero? |

Remember from [15](./15_condition.md#lt-eq-gt-are-not-a-number): these three bits
are not a number, they are three separate questions. If more than one is on, the
question becomes "is any of these true?" If all three are off, j is always 0.

There is no jumping in this level. The circuit only produces the answer to "should
we jump?".

The third group is the **destination**: `a`, `d`, `*a`. When asked what they are,
the answer was: *"It decides which register R gets written to: A, D or \*A."*

Right, with one correction: `*A` is not a register, it is the RAM cell A points
at. The rule from [22](./22_combined_memory.md#lowercase-uppercase) holds here
too: lowercase is the write permission, uppercase is the value read.

So the three output groups match three questions:

```
R            →  what is the result?
a · d · *a   →  where should the result be written?
j            →  does the result meet the condition?
```

The destination bits are independent of each other. In one of the game's tests,
`d` and `*a` were 1 at the same time: the result goes to both D and RAM.

---

## When a Command Is Spread onto Wires

`I` is a single 16-bit number. The table, though, wants each bit to go somewhere
else: bit 10 to `u`, bit 5 to `a`, bit 0 to `gt`. The part that splits a number
into its wires is the **16 bit splitter**; it was first used in
[10](./10_bayraklar.md#-now-you-build-it). With `I` on its input, each of its pins
gives out one bit.

[21.5](./21.5_sayi_mi_komut_mu.md#when-a-number-becomes-a-command) said: if a
number's bits are wired to control wires, that number becomes a command. In this
level the wiring itself is done:

```
I  ──►  splitter  ──►  bits 10–6   →  the alu's u, op1, op0, zx, sw
                       bit 12      →  the choice of Y
                       bits 5–3    →  a, d, *a
                       bits 2–0    →  condition's lt, eq, gt
```

Some bits are not in the table: 15, 14, 13 and 11. In this level they go nowhere.
Bit 12 is not in the table either, but it appears in the window's text.

---

## Y: A or *A?

According to the window, sometimes A goes to the ALU's `Y`, sometimes `*A`. Why
is there a choice between them?

The number in A is sometimes needed as the number itself, sometimes as the
address of a cell in RAM. In [22](./22_combined_memory.md#a-is-both-data-and-address)
you saw that A has two jobs: it is both data and address. Bit 12 says which of
the two the command wants. An example: let A = 5, and let RAM cell 5 hold 40.

```
bit 12 = 0   →   Y = A    =  5    the ALU works with 5
bit 12 = 1   →   Y = *A   = 40    the ALU works with 40
```

The need is clear: a single bit will choose one of two 16-bit numbers. The part
was found right away: *"If we're choosing, it's 100% select16 coming onto this
canvas."*

The data inputs were first wired like this:

```
D1  ←  A
D0  ←  *A
```

To test it, `A = 5` and `*A = 40` were entered and `I` was left at 0. With every
bit of `I` at 0, `s` was 0 too. Since bit 12 = 0, the 5 in A should have reached
`Y`. Under `Y` it showed **28**.

> 💡 The small boxes next to the pins show numbers in hexadecimal (hex). Look at
> the `*A` box: hex 28 = decimal 40. So what reached `Y` was 40, that is, `*A`.

The reason was visible in the `select 16` boxes: `s = 0`, `D1 = 5`, `D0 = 28`,
output 28. While `s = 0`, D0 passes, and D0 held `*A`.

![The first wiring: A on D1, *A on D0; 28 reaches Y](./gorseller/23_ters_select.png)
*The first wiring. With `s` at 0, `select 16` passes the 28 on D0, that is, `*A`.*

> ⚠️ **Whatever must pass while the lever is 0 goes on D0.** The trap from
> [13](./13_arithmetic_unit.md#the-trap-d0-and-d1-are-just-socket-names): D0 and
> D1 are just socket names. Since A is wanted while bit 12 = 0, A → D0 and
> `*A` → D1.

After the fix, the same test gave `Y` = 5.

---

## Why Bit 12?

The window says "depending on bit 12" but doesn't say why. That exact question
came up in the level: *"The game says this, but why?"*

The question was answered with another question: *if one of the bits missing from
the table, 11, had been chosen instead of 12, would the circuit work?* The answer:
*"It would work. What matters is where the wire goes."*

Right. Which bit is wired to what is not physics, it is a **contract**. It has one
condition: whoever writes the command and whoever builds the circuit must know the
same contract. If the circuit looks at 11 while the command puts the choice in 12,
the ALU works with the wrong number. And nothing looks broken; only the result
comes out wrong.

> 🔑 **A bit's number is a contract.** The meaning comes from where the wire goes.
> As long as both sides use the same table, which number was picked doesn't
> matter.

In [14](./14_alu.md#same-pair-of-wires-different-contracts) you saw the same pair
of wires tell two units two different things. Here too, the meaning is decided not
by the wire but by where the wire goes.

---

## "12th Bit" and "Bit 12"

Right after the answer was found, the `s` of `select 16` was wired to the
splitter's pin number **11**. The reasoning: *"I wired 11 as the 12th bit,
because it starts from 0."*

The logic holds; the problem is in the words. The game says *bit 12*, meaning
**the bit named 12**. Read as "the 12th bit", it points somewhere else. Remember
from [10](./10_bayraklar.md): bits are numbered from right to left, starting at
bit 0. So the twelfth bit is named 11. The same words can point at two different
pins.

The game showed which one is right. Hex `1000` was typed into `I`'s hex box. In
binary that number is `0001 0000 0000 0000`: only bit 12 is on.

| | splitter pin 12 | splitter pin 11 | `s` | `Y` |
|---|:-:|:-:|:-:|:-:|
| expected | 1 | 0 | 1 | `*A` (40) |
| seen | **1** | 0 | **0** | **A (5)** |

The splitter pin labeled 12 turned 1. Since `s` was wired to 11, it saw 0, and
`select` passed A.

![I = 1000: the splitter pin labeled 12 is 1, s is wired to 11 and is 0](./gorseller/23_bit11.png)
*`I` = hex 1000. The splitter pin labeled 12 is 1, but `s` is wired to 11 and sees 0; the 5 in A reaches `Y`.*

> ⚠️ **The numbers on the splitter are the pins' names.** "Bit 12" is simply the
> pin labeled 12. Counted from zero, it is the thirteenth bit.

The contract idea from a moment ago holds here too: whether counting starts at 0
or at 1 is also a clause of the contract. The wire went to 11, the game's test
looked at 12. Because the two sides counted differently, the result came out
wrong. The common name for this one-step slip is *off-by-one*.

With `s` moved to 12, the same test showed 28 under `Y`: hex 28, that is 40, that
is `*A`.

---

## j: Who Answers the Question?

The need: a number and three condition bits go in, a single yes or no comes out.
Looking at the parts' pin names gave the answer: `condition`. Its pins are `lt`,
`eq`, `gt` and `X`; exactly the columns of this table. It's the part you built in
[15](./15_condition.md).

At one point this question came up: *"So condition will be the part that passes
the question asked here on to j?"* There's a small difference: condition doesn't
pass the question on, it **answers** it.

```
question  ←  from the command:   bits 2, 1, 0   →   lt, eq, gt
number    ←  ?                   X
answer    →  j
```

One question was left: which number is the question asked of? The answer: *"It'll
come from the ALU, right?"* Yes. The window says the same: "if the ALU output
conforms to the conditions." So the ALU's output goes to `condition`'s `X`.

The ALU's output now goes to **two places**: to `R` and to `condition`'s `X`. In
[22](./22_combined_memory.md#which-address) the A register's output also went to
two places; drawing more than one wire from an output is allowed.

> 🔑 **Condition doesn't pass the question on, it answers it.** The question comes
> from the command, the number from the ALU, the answer goes to j.

---

## 🎮 Now You Build It

Parts list: **1 × `alu`**, **1 × `condition`**, **1 × `select 16`**,
**1 × `16 bit splitter`**.

When you're done, every input pin should have a wire: 7 on `alu`, 4 on
`condition`, 3 on `select 16`, 1 on the splitter, **15** in total. And one wire to
each of the five outputs at the top (`R`, `a`, `d`, `*a`, `j`).

### How to test it

First test the choice of `Y`, then the whole command. Type `I` into its hex box.

| step | `I` (hex) | `A` | `D` | `*A` | look at | expected | what is tested |
|---|---|---|---|---|---|---|---|
| 1 | `0000` | 5 | 0 | 40 | the alu's `Y` | 5 | bit 12 = 0 → A |
| 2 | `1000` | 5 | 0 | 40 | the alu's `Y` | 28 (hex, that is 40) | bit 12 = 1 → `*A` |
| 3 | `f4a3` | 0 | 0 | 42 | `R` · `a d *a` · `j` | 42 · 1 0 0 · 1 | a whole command, read by hand below |
| 4 | `f4a6` | 0 | 0 | 42 | `R` · `a d *a` · `j` | 42 · 1 0 0 · 0 | the same calculation, another condition |
| 5 | `e762` | 1 | 2 | `ffff` | `R` · `a d *a` · `j` | 0 · 1 0 0 · 1 | the zero condition |

Rows 3–5 come from the game's own tests. In row 5, `*A` gets hex `ffff`, that is
−1.

<details>
<summary>🔑 If you're stuck — the wiring list</summary>

```
splitter:    input ← I
alu:         u ← bit 10    op1 ← bit 9    op0 ← bit 8    zx ← bit 7    sw ← bit 6
             X ← D         Y ← output of select 16                     →  R,  condition's X
select 16:   s ← bit 12    D1 ← *A        D0 ← A                       →  the alu's Y
condition:   lt ← bit 2    eq ← bit 1     gt ← bit 0    X ← the alu's output  →  j
outputs:     a ← bit 5     d ← bit 4      *a ← bit 3
```

</details>

The game's answer:

> *"3 components used. (Not counting splitter which does not contain any logic.)
> 3672 nand gates in total."*

The splitter isn't counted because there's no logic inside it: it only splits a
number into its wires. The three counted parts are `alu`, `condition` and
`select 16`.

![The ALU Instruction circuit: splitter on the left, select 16 in the middle, alu on the right and condition at the top](./gorseller/23_devre.png)
*The passing circuit. The wires from the splitter go to the alu's control pins, to the `s` of `select 16`, to the destination outputs and to `condition`.*

![The ALU Instruction level passed: 3 components, 3672 nands](./gorseller/23_basari.png)
*The level passed.*

---

## Reading a Command by Hand

Once the circuit is built, a command can also be read by hand. One of the game's
tests: `I = f4a3`, `A = 0`, `D = 0`, `*A = 42`.

First open the hex into binary. Each hex digit is four bits:

```
   f      4      a      3
 1111   0100   1010   0011
 ↑                       ↑
 bit 15                  bit 0
```

Then read it with the table:

| bit | value | goes to | meaning |
|:-:|:-:|---|---|
| 12 | 1 | the `s` of `select` | `Y` = `*A` = 42 |
| 10 | 1 | `u` | arithmetic |
| 9 | 0 | `op1` | addition |
| 8 | 0 | `op0` | second number is `Y` |
| 7 | 1 | `zx` | the left number becomes 0 |
| 6 | 0 | `sw` | no swap |
| 5 | 1 | `a` | the result will be written to A |
| 4 | 0 | `d` | |
| 3 | 0 | `*a` | |
| 2 | 0 | `lt` | |
| 1 | 1 | `eq` | is the result zero? |
| 0 | 1 | `gt` | is the result greater than zero? |

The calculation: `zx` makes the left number, D, 0. The operation is addition, the
second number is `*A`: 0 + 42 = **42**. The condition "zero or greater than zero?":
42 is greater, **j = 1**. That's exactly what the game expected: `R = 42`,
`a = 1`, `j = 1`.

In this command bits 15, 14 and 13 are 1 and bit 11 is 0. This circuit doesn't
look at them.

---

## Tests That Passed by Chance

On the first Check, the game gave this table:

| `I` | `A` | `D` | `*A` | `R` | `a` | `d` | `*a` | `j` | |
|---|---|---|---|---|---|---|---|---|---|
| `e590` | 7 | 9 | 13 | 1 | 0 | 1 | 0 | 0 | ✔ |
| `e018` | 6 | 5 | 0 | 4 | 0 | 1 | 1 | 0 | ✔ |
| `f4a3` | 0 | 0 | 42 | **0** | 1 | 0 | 0 | 1 | ✗ |
| *expected* | | | | **42** | 1 | 0 | 0 | 1 | |

![The first Check: in the third row R is 0 instead of 42](./gorseller/23_ilk_check.png)
*The first Check. The only red cell is the `R` of the third row.*

Only one cell is wrong: the `R` of the third row. `R` is directly the ALU's output,
so the place to look was the ALU. Its pins were checked one by one: wires reached
only `X` and `Y`. `u`, `op1`, `op0`, `zx` and `sw` were empty.

![The ALU's five control pins are empty](./gorseller/23_kontrol_bos.png)
*The first attempt. The wires from the splitter go to the destinations and to `condition`; the alu's `u`, `op1`, `op0`, `zx`, `sw` pins have no wire.*

An empty pin counts as 0 in the game; the 🎮 box in
[22](./22_combined_memory.md#when-a-wire-is-left-loose) explains why it isn't so
in reality. With all five control wires at 0, the ALU did the same operation for
every command: `u = 0` logic, `op1 op0 = 0 0` and. So `D and Y`, every time.

Then why did the first two rows pass?

| row | what the command wanted | what the circuit did | result |
|---|---|---|---|
| `e590` | `zx` and `op0`: 0 + 1 | 9 and 7 | both **1** |
| `e018` | 5 and 6 | 5 and 6 | both **4** |
| `f4a3` | `zx`: 0 + 42 | 0 and 42 | 42 ≠ **0** |

The first row is a coincidence: 9 (`1001`) and 7 (`0111`) = 1, and the wanted
0 + 1 is 1 as well. The second row wanted an and anyway. In the third row the
coincidence ran out. Even that row's `j` came out right by chance: the condition is
"zero or greater", and both 0 and 42 meet it.

> 🔑 **A passing test doesn't prove the circuit is right.** It only shows that the
> mistake didn't show up in those rows.

> 💡 Before pressing Check solution, count the input pins: this circuit has 15.
> With five control wires missing, the circuit could still pass the first two
> tests.

Once the control wires were connected to bits 10–6 of the table, all six test rows
passed.

---

## One of Three Questions Answered

At the end of [21.5](./21.5_sayi_mi_komut_mu.md#entering-the-processor) three
questions were left. Where they stand:

1. *To read the commands sitting one after another in memory, in order, which
   number should be held, and by whom?* Still open.
2. *Which wires will a command's bits go to?* This level's table: 10–6 to the
   ALU, 12 to the choice of `Y`, 5–3 to the destinations, 2–0 to the condition.
3. *Does `cl` come from outside until the end of the unit?* This level has no `cl`
   at all. The circuit stores nothing, so it has no need for the bell.

At the end of [22](./22_combined_memory.md#the-processor-has-begun) a note was
also left: `a`, `d`, `*a` are switched on by hand for now; if a number's bits were
wired to these wires, that number would decide "where to write `X`". In this level
those bits became known: 5, 4 and 3.

---

## Summary — Keep in Mind

```
☐ ALU Instruction: the 16-bit command I tells the ALU and condition what to do.
☐ Three output groups, three questions: R = what's the result? · a, d, *a = where to write it? · j = does it meet the condition?
☐ R = result, j = jump. There's no jumping in this level, only the answer to "should we jump?".
☐ lt, eq, gt are three separate questions: less than zero, equal, greater? If more than one is on, "any of them".
☐ *A is not a register, it's the RAM cell A points at. Lowercase is the write permission, uppercase the value read.
☐ 🔑 There's no register and no cl in the circuit: it takes values from outside and gives its decision outside. It writes nothing itself.
☐ The 16 bit splitter splits a number into its wires. Bits 10–6 → alu, bit 12 → the choice of Y, bits 5–3 → destination, bits 2–0 → condition. 15, 14, 13, 11 go nowhere.
☐ Y: bit 12 = 0 → A (the number itself), 1 → *A (the cell A points at). select 16 makes the choice.
☐ ⚠️ Whatever must pass while the lever is 0 goes on D0: A → D0, *A → D1.
☐ The boxes next to the pins show hex: 28 = 40.
☐ 🔑 A bit's number is a contract. What matters is where the wire goes; both sides must use the same table.
☐ ⚠️ "Bit 12" = the pin labeled 12. Read it as "the 12th bit" and counting from zero slips you to 11 (off-by-one).
☐ 🔑 Condition doesn't pass the question on, it answers it: the question from the command (bits 2–0), the number from the ALU (X), the answer to j.
☐ The ALU's output goes to two places: to R and to condition's X.
☐ Read a command by hand: hex → binary → table. f4a3: zx, addition, Y = *A → 0 + 42 = 42; eq and gt → j = 1.
☐ 🔑 A passing test doesn't prove the circuit is right. With its control wires empty the ALU always did D and Y, and the first two tests passed by chance.
☐ Count the pins before Check: alu 7, condition 4, select 16 3, splitter 1 = 15.
☐ Solution: 3 components (the splitter isn't counted), 3672 nands.
```

---

## 🔗 Related Topics

- [22_combined_memory.md](./22_combined_memory.md) — The `a`, `d`, `*a` flags; A is both data and address; lowercase, uppercase
- [21.5_sayi_mi_komut_mu.md](./21.5_sayi_mi_komut_mu.md) — A number whose bits are wired to control wires becomes a command
- [15_condition.md](./15_condition.md) — `lt`, `eq`, `gt` are three separate questions; inside condition
- [14_alu.md](./14_alu.md) — The ALU's control bits: `u`, `op1`, `op0`, `zx`, `sw`
- [13_arithmetic_unit.md](./13_arithmetic_unit.md) — D0 and D1 are just socket names
- [10_bayraklar.md](./10_bayraklar.md) — How bits are numbered; the 16 bit splitter

---

**Previous topic:** [22_combined_memory.md](./22_combined_memory.md)
**Next topic:** *(on the way — the third level of the Processor unit)*

*This lesson is part of the "From Switches to a Computer" series. The series moves along together with [nandgame.com](https://nandgame.com).*
