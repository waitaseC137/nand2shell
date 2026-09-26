# 🧮 From Switches to a Computer — Logic Unit: The First Circuit That Takes Orders

> Every circuit you have built so far had **a single job**. An adder adds, a
> subtractor subtracts. You can't tell them "now do something else".
>
> A processor is different. One moment it adds, the next it ANDs, then it XORs.
> The **program** decides which. In this lesson you build the place where a
> circuit takes an **order** for the first time.

> We aren't learning a new operation; all four are already in the toolbox. What
> you learn here is how to **pick one of them on command.**

---

## 📋 Table of Contents

- [What Does This Part Do?](#what-does-this-part-do)
- [The Command Is a Number](#the-command-is-a-number)
- [All Four Always Run](#all-four-always-run)
- [How Does OR Know What to Do?](#how-does-or-know-what-to-do)
- [Four Choices, Three Selectors](#four-choices-three-selectors)
- [Which Lever Goes to Which Wire?](#which-lever-goes-to-which-wire)
- [The Trap: Which Input?](#the-trap-which-input)
- [🎮 Now You Build It](#-now-you-build-it)
- [Who Holds the Meaning?](#who-holds-the-meaning)

---

## What Does This Part Do?

These instructions appear in [lesson 13](../x86_assembly/13_bit_islemleri.md) of
the x86 series. If you read that series, you wrote them yourself; if not, that is
fine:

```nasm
and eax, ebx
or  eax, ebx
xor eax, eax
```

Add `not eax`, which flips every bit, to that list. When the processor reaches the
line `and eax, ebx`, the circuit that does the AND is **the circuit you build in
this lesson.**

Here is that one line's journey from start to finish:

```
and eax, ebx
   │
   ①  the assembler turns the line into bits       →  21 D8
   │
   ②  the control unit reads the bits, says "AND"  →  op1 = 0, op0 = 0
   │
   ③  the values in eax and ebx arrive on the X and Y wires
   │
   ④  LOGIC UNIT: four results are ready, the order is "AND",
   │  the AND result goes out                         ← this lesson
   │
   ⑤  the result is written back into eax
```

`21 D8` is the real x86 encoding of that line (checked by assembling it with
`nasm`). NandGame's machine will use its own bit layout, but the skeleton is the
same. ② comes with the control unit, ③ and ⑤ with the memory unit. Real x86
puts more layers in between, but this is the skeleton.

> 🔑 The question underneath is: **when you write an instruction in assembly, what
> happens where inside the machine?** This lesson is the first answer: the place
> where the operation itself happens.

---

## The Command Is a Number

The level has four inputs:

```
X, Y        →   16 wires each   the numbers to work on          (data)
op1, op0    →   one wire each   which operation to perform       (control)
```

Same split as in `11`: a data wire goes into the calculation, a control wire
**chooses** the calculation.

Now recall the rule from [04](./04_teller_sayi_olunca.md): `n` wires give `2ⁿ`
different patterns. Two control wires give `2² = 4` patterns, so 4 operations.
Together, op1 and op0 form a **number** from 0 to 3, and that number is an
**order**:

| op1 | op0 | number | operation |
|:-:|:-:|:-:|---|
| 0 | 0 | 0 | X and Y |
| 0 | 1 | 1 | X or Y |
| 1 | 0 | 2 | X xor Y |
| 1 | 1 | 3 | invert X |

The last row doesn't use Y at all. Inverting works on a single number.

> ⚠️ An expression like "op = 1" can be read two ways: does it mean **the op0 wire
> is 1**, or **the number formed by the two wires is 1**? In this lesson, "op = number" always
> means the second: op = 1 means op1 = 0, op0 = 1, which is **or**. When we mean a
> single wire, we'll name it.

---

## All Four Always Run

Try an experiment. Put only `and 16` on the canvas and connect X and Y to it. Set
the order to **or** (op1 = 0, op0 = 1). Then type hex `00FF` into X and hex `0F0F`
into Y.

> 💡 **What is hex?** Writing a 16-bit number as 0s and 1s takes a while:
> `0000000011111111`. So the bits are grouped four at a time and each group is
> written as a single character: `0`–`9`, then `a` = 10, `b` = 11 … `f` = 15. This
> is called **hexadecimal**, or **hex** for short. Four bits make one hex digit,
> 16 bits make four: `0000 0000 1111 1111` = `00FF`. By the same rule, `ffff` is
> the number with all sixteen bits set to 1.

What does `and 16` show? **`000F`.** Had the order been obeyed, you would see
`0FFF`. The order says "or", yet AND keeps computing.

Why? Look at `and 16`: **no wire** comes to it from op1 or op0. The box doesn't
know the order exists. All it gets is X and Y, and it ANDs them nonstop.

> 💡 If you had run the experiment with X = Y = 0, you'd have seen 0 on the
> screen. But that wouldn't show the box had stopped, because 0 AND 0 is 0 anyway.
> To see whether something is working, pick an input that gives a **non-zero**
> result when it is.
>
> Even better, pick an input for which **all four operations give different
> results.** `00FF` and `0F0F` are exactly that: and `000F`, or `0FFF`, xor
> `0FF0`, invert X `FF00`. Whatever number you see on the screen, you know which
> operation produced it.

Put all four operations on the canvas and all four compute **at the same time,
all the time.** The sentence from `08` holds here too: the information isn't lost,
**nobody is looking at it.** We said it at the end of `11` as well: *it does them
all, then picks one.*

Think of a television: every channel is broadcasting at once. The remote doesn't
**start** a broadcast; it **chooses** which one reaches the screen. The order is a
channel number.

> 🔑 The order doesn't say "**do** this". All four are already done. The order says
> "**let this one through**".
>
> ```
> wrong picture :  the order arrives  →  that operation gets done
> right picture :  all four are always done  →  the order arrives  →  one is let through
> ```

> 💡 Real processors sometimes switch off units they aren't using at the moment,
> to save energy. But this is the core idea of the design: keeping the results
> ready and choosing is faster than deciding first and computing afterwards.

---

## How Does OR Know What to Do?

A natural question pops up here: if we don't give the order to OR, **how does OR
know what to do?**

It doesn't. **It doesn't need to, because it can't do anything else.**

In [02](./02_nanddan_kapilar.md) you built OR out of NANDs yourself. Open the
`or 16` box and you'd find 16 copies of that circuit. Nobody tells it "do OR";
the way its wires are connected already decides what the output will be. That
wiring can't do anything else.

> 🔑 No part of a computer **knows** anything. What a part does **is** how it is
> wired.

That's why an order is needed **only where there is a choice.** OR has only one
thing it can do, so there's nothing to ask it. A selector has two options, so
someone has to answer "which one?". That is exactly where the op wires connect.

---

## Four Choices, Three Selectors

The toolbox has a selector: `select 16`. It's the Selector you built in `11`,
16 wires wide:

```
        ┌───────────┐
  D1 ───┤           │
        │ select 16 ├─── output
  D0 ───┤           │
        └─────┬─────┘
              s
```

| s | goes through |
|:-:|:-:|
| 0 | D0 |
| 1 | D1 |

D1 and D0 are 16 wires each, **but s is a single wire.** So it's 16 selectors
side by side, all turned by the same s.

Here's the problem: a selector has two ways in, and we have four results.

The solution takes two steps. Two selectors bring the four results down to two,
and a third picks one of those two:

```
   and     or           xor    inv
    │      │             │      │
  ┌─┴──────┴─┐         ┌─┴──────┴─┐
  │    A     │         │    B     │
  └────┬─────┘         └────┬─────┘
       └─────────┐  ┌───────┘
               ┌─┴──┴─┐
               │  C   │
               └──┬───┘
                output
```

It's the floors trick from `06`: 4 choices became 2 × 2.

Picture a building: two floors, two flats on each. AND and OR live on the ground
floor, XOR and INV upstairs. To find a flat, a two-part address is enough: the
**floor** and the **door.**

---

## Which Lever Goes to Which Wire?

The three selectors have three s inputs. Let's call them **levers**, since
they're what turns each selector. You have two order wires. Which wire goes to
which lever?

Two things first:

1. **You can't leave a lever unconnected.** An unconnected input counts as 0 (like
   the B input you left empty in `08`). A selector with an empty lever stays on D0
   forever.
2. **The order has no other way in.** We saw that the four operation boxes know
   nothing about the order. The levers are the only place it can enter the circuit.

Here's the method: **put the rows the selector has to tell apart one under the
other. The wire that changes is the wire for that selector's lever.**

**A: and, or or?**

```
            op1   op0
X and Y  →   0     0
X or  Y  →   0     1
             ↑     ↑
           same  DIFFERENT
```

op1 is 0 in both rows, so it can't tell AND from OR. op0 is the one that changes.
**A's lever is op0.**

**B: xor, or inv?**

```
            op1   op0
X xor Y  →   1     0
invert X →   1     1
```

op0 changes again. **B's lever is op0 too.** One wire can go to two levers (the
fan-out you saw in `11`). When op0 changes, A and B turn together.

**C: A's group, or B's group?**

```
            op1   op0
X and Y  →   0     0   ┐
X or  Y  →   0     1   ┘  A's group
X xor Y  →   1     0   ┐
invert X →   1     1   ┘  B's group
```

The wire that separates the two groups is op1. **C's lever is op1.**

> 🔑 The two-bit order got split in two: **op1 picks the group**, **op0 picks the
> operation inside the group.** Decimal numbers do the same: in 23, the 2 tells
> you which ten, and the 3 tells you which one inside that ten.

---

## The Trap: Which Input?

Even with the levers wired correctly, the circuit can fail. The most common
mistake in this level is plugging an operation into the **wrong input** of a
selector. The rule fits in one sentence:

> 🔑 **Whatever should get through when the lever is 0 goes on D0.**

Try it on A: A's lever is op0. When op0 = 0, the order is **and**. So AND goes on
**D0**, and OR on **D1**. Work out B and C with the same question: *"when the
lever is 0, which one should get through?"*

### Reading the failing row

If you wire it wrong, the game shows you the failing row. For example:

```
op1  op0    X      Y       output   expected
 0    0     0    ffff   →  ffff        0       ✗
```

This row doesn't just say "wrong". It gives you a clue:

1. The order is 0 0, which is **and**. 0 AND ffff should have been 0.
2. What came out is **ffff.** The operations that turn 0 and ffff into ffff are
   **or**, **xor** and **invert X** (the inverse of 0 is ffff).
3. So when the order is AND, OR, XOR or INVERT is getting through. The problem isn't
   where the levers connect; it's which **inputs** the operations are plugged into.
   Because with the order 0 0 both order wires are 0: whatever wire each lever is
   connected to, all of them are at 0, and all three selectors pass D0. Only a
   value sitting on a D0 input can reach the output.

Then build that row by hand (op1 = 0, op0 = 0, X = 0, Y = ffff) and **trace the
wrong value backwards.** Every box shows its current output above it. What is at
C's output, and which of C's inputs is it coming from? What is at the output of
the selector on that input? The first selector where the wrong value appears is
where the mistake is.

> 💡 A failing test row is an experiment with a known answer. Ask "what was
> expected, what came out, which operations give that?" and the row itself will
> often tell you where the mistake is.

---

## 🎮 Now You Build It

**Task:** NandGame → **Arithmetic Logic Unit → Logic Unit** level.

What you have: `nand`, `select 16`, `inv 16`, `and 16`, `or 16`, `xor 16`.

- `inv 16` has a single input, and only **X** goes into it.
- After you build it, run the "All Four Always Run" experiment. See with your own
  eyes that `and 16` keeps computing while the order is "or".

The game accepts the 7-part solution as *"the simplest possible solution"*.

<details>
<summary>🔒 Solution schematic — try it yourself first, then open</summary>

1. `and 16`, `or 16`, `xor 16`: inputs **X** and **Y**.
2. `inv 16`: input **X**.
3. `select 16` (A): D0 ← `and`, D1 ← `or`, s ← **op0**.
4. `select 16` (B): D0 ← `xor`, D1 ← `inv`, s ← **op0**.
5. `select 16` (C): D0 ← A's output, D1 ← B's output, s ← **op1** → **to the output**.

</details>

---

## Who Holds the Meaning?

One last question: who made the rule "op 00 = and"?

Not nature. Whoever designed the level decided it. 00 could just as well have
meant XOR; the circuit would simply have been wired differently. It's an
**agreement.**

In fact, every layer makes an agreement like this with the one below it:

```
a & b             C, Python      the compiler's agreement : "& means the and instruction"
and eax, ebx      assembly       the assembler's agreement: "and means these bits"
21 D8             machine code   the designer's agreement : "these bits turn these selectors"
op1 = 0, op0 = 0  wires          below this it's physics  : current flows where the wiring lets it
```

Two things need to be kept apart here:

- **Behaviour comes from the wiring.** No language can change the fact that OR
  does OR.
- **Meaning comes from the agreements.** Reading 16 wires as a number and 2 wires
  as an order, saying "00 = and": those are our decisions.

> 🔑 The parts know what to do from their wiring. We give them meaning, not in one
> place but with an agreement at every layer. High-level languages are the top
> layer of those agreements. That is exactly the ladder from
> [03.5](./03.5_soyutlama_merdiveni.md).

### Next up

**Arithmetic Unit** builds the same idea with four **arithmetic** operations:
X + Y, X − Y, X + 1, X − 1. After that the **ALU** puts the two units in one box.
And the unit's last level, **Condition**, brings the overflow flag (OF) we
promised in `10`.

---

## Summary — Keep in Mind

```
☐ The Logic Unit is where a circuit takes an ORDER for the first time. It runs x86's and/or/xor/not.
☐ op1 op0 = 2 wires = 2² = 4 patterns = a NUMBER from 0 to 3. That number is an order.
☐ "op = 1" → the number 1 (op1 = 0, op0 = 1), not a single wire. Say which one you mean.
☐ The four operation boxes know NOTHING of the order; no op wire reaches them. All four always compute.
☐ The order doesn't say "do", it says "let through". Everything is done, one is chosen (TV channels).
☐ To see whether something works, pick an input that gives a non-zero result.
☐ OR doesn't know what to do; its wiring IS what it does. An order is only needed where there is a CHOICE.
☐ select 16: s = 0 → D0, s = 1 → D1. D1/D0 are 16 wires each, s is one wire.
☐ 4 choices = 2 × 2: two selectors (A, B) + one selector on top (C).
☐ Finding the lever: put the rows to tell apart under each other; the wire that CHANGES is the lever. A, B ← op0 · C ← op1.
☐ op1 picks the group, op0 picks inside the group (23: the ten + the one).
☐ ⚠️ Whatever should get through when the lever is 0 goes on D0.
☐ A failing test row is an experiment: what was expected, what came out, which operation gives that → then trace back.
☐ Behaviour comes from wiring, meaning from agreements. Every layer is an agreement; a high-level language is the top one.
```

---

## 🔗 Related Topics

- 👾 **For the curious:** [CWE-480 — Use of incorrect operator](../cwe/cwe_480.md) — mixing up the bitwise `&` you built in this lesson with the logical `&&`. The most famous case in the same family: a single missing `=` someone tried to slip into the Linux kernel in 2003
- [11_selector_switch.md](./11_selector_switch.md) — The selector itself; "it does them all, then picks one"
- [06_full_adder.md](./06_full_adder.md) — The floors trick
- [04_teller_sayi_olunca.md](./04_teller_sayi_olunca.md) — `n` wires → `2ⁿ` patterns
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — The circuit inside the OR box
- [03.5_soyutlama_merdiveni.md](./03.5_soyutlama_merdiveni.md) — Layers and agreements
- [../x86_assembly/13_bit_islemleri.md](../x86_assembly/13_bit_islemleri.md) — **The same operations, from the software side**

---

**Previous topic:** [11_selector_switch.md](./11_selector_switch.md)
**Next topic:** [13_arithmetic_unit.md](./13_arithmetic_unit.md)

*This lesson is part of the "From Switches to a Computer" series. The series moves along together with [nandgame.com](https://nandgame.com).*
