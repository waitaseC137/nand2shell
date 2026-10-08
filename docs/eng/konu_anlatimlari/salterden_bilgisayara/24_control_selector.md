# 🧮 From Switches to a Computer — Control Selector: One Lever, Two Packages

> This level opened with a single table, and the first question was: what is the
> operation here? The answer was that there is none. Then two ideas came. The
> first was to wire `a₀` straight to `a`. The second was to gather all the
> selectors into one main `select 16`. Both were fixed from the same place: only
> a selector hears `s`, and every output needs its own selector.

---

## 📋 Table of Contents

- [What Does This Part Do?](#what-does-this-part-do)
- [How Many Wires Is a Bus?](#how-many-wires-is-a-bus)
- [Who Makes the Decision?](#who-makes-the-decision)
- [A Wire Doesn't Hear s](#a-wire-doesnt-hear-s)
- [A Selector for Every Output](#a-selector-for-every-output)
- [Test with Different Values](#test-with-different-values)
- [What Breaks Without It?](#what-breaks-without-it)
- [🎮 Now You Build It](#-now-you-build-it)
- [Why Is It Needed?](#why-is-it-needed)

---

## What Does This Part Do?

The third level of the Processor unit. The landscape:

```
inputs:     s (1 bit)
            Control bus 1:  R₁ (16 bits) · a₁ · d₁ · *a₁ · j₁ (1 bit each)
            Control bus 0:  R₀ (16 bits) · a₀ · d₀ · *a₀ · j₀ (1 bit each)
outputs:    R (16 bits) · a · d · *a · j (1 bit each)
toolbox:    nand · select · select 16 · 16 bit splitter · is neg
```

The window that opened:

> *"The s flag selects one of the two sets of inputs for output."*

| `s` | R | `a` | `d` | `*a` | `j` |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | R₀ | a₀ | d₀ | *a₀ | j₀ |
| 1 | R₁ | a₁ | d₁ | *a₁ | j₁ |

> *"This is a simple component, but necessary for supporting different kinds of
> instructions in the CPU."*

When the level opened, the first question was: *"What is the operation here?"*

> 🔑 **There is no calculation in this level.** The circuit doesn't add or
> compare anything. Two sets come in, one passes through.

Read the table row by row: while `s` = 0 every output takes the input marked ₀
next to its name; while `s` = 1, the one marked ₁. There is no mixing. R can't
come from bus 1 while `a` comes from bus 0; the set passes as a whole.

> 💡 The toolbox also has `is neg` and `16 bit splitter`. The toolbox shows the
> parts you can use, not the parts you must use. Nothing in the window asks about
> a negative number, and nothing asks for a number to be split into its wires.

---

## How Many Wires Is a Bus?

At the bottom of the screen the inputs sit in two frames: **Control bus 1** and
**Control bus 0**. At one point in the level, a *bus* was taken to be "the speed
of data through a wire". It isn't.
[21.5](./21.5_sayi_mi_komut_mu.md#follow-the-wire) already said it: a bus is a
bundle of wires running side by side.

So how many wires are in this bundle? The first guess was 16. Count what is
inside the frame:

```
Control bus 1:   R₁    a₁    d₁    *a₁    j₁
                 16  + 1   + 1   + 1    + 1    =  20 wires
```

`R₁` is a 16-bit number; the other four are one bit each, in other words one
switch each. A bus is not 16 wires but **20**.

The names are familiar: R, `a`, `d`, `*a`, `j`. The circuit you built in
[23](./23_alu_instruction.md#r-and-j) had exactly these outputs: the result,
where the result should be written, and whether the condition holds. A control
bus is the bundle that carries these five answers together.

---

## Who Makes the Decision?

At one point this sentence came up: *"R decides which of the outputs above to
pick."*

The decision isn't in R. R is just one of the outputs, a 16-bit number. Which
set passes is decided **by `s` alone**, and for all five outputs at once.

```
s                 →  the decision
R, a, d, *a, j    →  the result of the decision
```

---

## A Wire Doesn't Hear s

The first connection that came to mind was this: wire `a₀` straight to the `a`
output. While `s` = 0 this works, because in that row the table wants `a₀`
anyway.

The question is: *what shows up on `a` when `s` = 1?*

The first answer was *"I won't see anything."* In fact `a` shows **`a₀`**. The
wire has no idea `s` exists; whatever `s` is, it keeps carrying `a₀`. The result
isn't an empty output, it's a wrong value.

The `and 16` in [12](./12_logic_unit.md#all-four-always-run) was the same: since
no wire came to it from `op1` or `op0`, it knew nothing about the command and
kept on ANDing.

> 🔑 **A wire doesn't hear `s`.** In the toolbox, the only parts that hear `s`
> are the selectors: `select` and `select 16`. Every output that must switch to
> another input when `s` = 1 needs a selector in front of it.

---

## A Selector for Every Output

The next idea was this: make the choice between the two buses with several
selectors and gather everything into one **main `select 16`**.

Look at the outputs at the top: R, `a`, `d`, `*a` and `j` are five separate
sockets. `a` doesn't need to pass through R, and nothing needs to be gathered in
one place. Every output has its own selector; the only thing they share is the
lever, `s`.

```
                          s
      ┌──────────┬────────┼────────┬─────────┐
      ▼          ▼        ▼        ▼         ▼
  select 16   select   select   select    select
      │          │        │        │         │
      ▼          ▼        ▼        ▼         ▼
      R          a        d        *a        j
```

Which selector gets which size? The reason was given during the level: *"For R
I'll use the 16-bit select. For the others a normal select, because they're one
bit each; there's no need for a 16-bit one."*

| output | wires | selector |
|---|:-:|---|
| R | 16 | `select 16` |
| `a`, `d`, `*a`, `j` | 1 each | `select` (4 of them) |

> 🔑 **The width of the wire sets the size of the selector.**

> ⚠️ **While `s` = 0, bus 0 must pass.** The trap from
> [13](./13_arithmetic_unit.md#the-trap-d0-and-d1-are-just-socket-names) is here
> five times over: D0/`d0` and D1/`d1` are just socket names. Bus 0 → D0/`d0`,
> bus 1 → D1/`d1`.

---

## Test with Different Values

Test the circuit yourself before pressing Check. Remember the rule from
[13](./13_arithmetic_unit.md#how-do-you-choose-a-test): a good test is one that
would make you notice if the circuit were broken.

The easiest way to break this circuit is to wire a selector backwards. If you
write the **same** values into both buses, a backwards selector never shows: the
output looks the same whichever bus passes. So write different values into the
two buses:

| | Control bus 1 | Control bus 0 |
|---|:-:|:-:|
| R | 2 | 1 |
| `a`, `d`, `*a`, `j` | all 1 | all 0 |

Then flip `s` back and forth between 0 and 1:

| `s` | expected R | expected `a d *a j` |
|:-:|:-:|:-:|
| 0 | 1 | 0 0 0 0 |
| 1 | 2 | 1 1 1 1 |

The game's own tests follow this rule too. In the first two rows every value of
the two buses differs: 42 and −256 (hex `ff00`) on R, 0 and 1 on `a`, 1 and 0 on
`d`, 0 and 1 on `*a`, 1 and 0 on `j`.

![Control Selector level passed: four test rows, 5 components, 260 nands](./gorseller/24_basari.png)
*The game's tests. In the first two rows every value of the two buses differs; a backwards selector fails these rows right away.*

---

## What Breaks Without It?

What happens if you remove a selector? Say `j` has no selector and `j₀` is wired
straight to `j`. Which of the game's four test rows fail?

Guess first, then open:

| row | `s` | j₁ | j₀ | expected `j` |
|:-:|:-:|:-:|:-:|:-:|
| 1 | 0 | 1 | 0 | 0 |
| 2 | 1 | 1 | 0 | 1 |
| 3 | 1 | 0 | 1 | 0 |
| 4 | 0 | 0 | 1 | 1 |

<details>
<summary>Answer</summary>

Without a selector, `j` shows `j₀` in every row: 0, 0, 1, 1.

| row | expected | seen | |
|:-:|:-:|:-:|:-:|
| 1 | 0 | 0 | ✔ |
| 2 | 1 | 0 | ✗ |
| 3 | 0 | 1 | ✗ |
| 4 | 1 | 1 | ✔ |

The rows with `s` = 0 pass, because in those rows the table wants `j₀` anyway.
The two rows with `s` = 1 fail. That is because the test is well built: if `j₁`
and `j₀` were equal in an `s` = 1 row, the missing selector wouldn't show there
either.

</details>

---

## 🎮 Now You Build It

Parts list: **1 × `select 16`**, **4 × `select`**.

When you're done, all three input pins of every selector should have a wire:
**15** in total. Each of the five outputs at the top gets a wire too. Five wires
leave the `s` input.

<details>
<summary>🔑 If you're stuck — connection list</summary>

```
select 16:   s ← s    D1 ← R₁     D0 ← R₀     →  R
select:      s ← s    d1 ← a₁     d0 ← a₀     →  a
select:      s ← s    d1 ← d₁     d0 ← d₀     →  d
select:      s ← s    d1 ← *a₁    d0 ← *a₀    →  *a
select:      s ← s    d1 ← j₁     d0 ← j₀     →  j
```

</details>

The game's answer:

> *"5 components used. 260 nand gates in total."*

![Control Selector circuit: select 16 goes to R, four selects go to a, d, *a and j; all five take s from the same wire](./gorseller/24_devre.png)
*The passing circuit. The blue wires spread from `s` to the five selectors (`s` = 1).*

---

## Why Is It Needed?

The window says this part is needed "for supporting different kinds of
instructions". Which kinds? The next level of the Processor unit will show that.

The idea itself isn't new. In [14](./14_alu.md#compute-everything-then-pick) the
ALU ran the arithmetic unit and the logic unit at the same time and picked the
result at the very end with `u`. Here too, two sets wait ready at the same time,
and at the very end `s` lets one through.

The difference is in what gets picked:

```
ALU               →  picks one of two results
Control Selector  →  picks one of two packages:
                     the result (R) + where to write it (a, d, *a) + did the condition hold (j)
```

> 💡 **In the real world: MUX.** In
> [11](./11_selector_switch.md#merging-why-or-is-safe) you learned the selector's
> name: multiplexer, mux for short. Gaming laptops have a part called a **MUX
> switch** that chooses which graphics card drives the screen. The wires going to
> the panel switch with one lever and as a set, just like in this level.

---

## Summary — Keep in Mind

```
☐ Control Selector: s passes one of two input sets to the outputs as a whole. No calculation.
☐ Bus = a bundle of wires running side by side (21.5). Not a speed.
☐ A control bus is 20 wires: R (16) + a, d, *a, j (1 each). The same five names are 23's outputs.
☐ R doesn't decide, s does; one lever for all five outputs.
☐ 🔑 A wire doesn't hear s. An a₀ wired straight through still carries a₀ when s = 1: not an empty output, a wrong value.
☐ The part that hears s is a selector. A selector for every output; only s is shared.
☐ 🔑 The width of the wire sets the size of the selector: R → select 16, single bits → select.
☐ ⚠️ While s = 0, bus 0 passes: bus 0 → D0/d0, bus 1 → D1/d1.
☐ Test by writing different values into the two buses; with equal values a backwards selector stays hidden.
☐ Remove a selector and only the s = 1 rows fail, and only if the two buses differ there.
☐ The ALU picked one of two results; the Control Selector picks one of two packages.
☐ In the real world: a MUX switch chooses which graphics card drives the screen.
☐ Solution: 1 select 16 + 4 select = 5 components, 260 nands.
```

---

## 🔗 Related Topics

- [23_alu_instruction.md](./23_alu_instruction.md) — R, `a`, `d`, `*a`, `j`: result, destination, condition
- [21.5_sayi_mi_komut_mu.md](./21.5_sayi_mi_komut_mu.md) — A bit is a wire; a bundle of wires is a bus
- [14_alu.md](./14_alu.md) — Compute everything, then pick
- [13_arithmetic_unit.md](./13_arithmetic_unit.md) — D0 and D1 are just socket names; how to choose a test
- [12_logic_unit.md](./12_logic_unit.md) — A box with no wire coming in knows nothing of the command
- [11_selector_switch.md](./11_selector_switch.md) — The selector; multiplexer (mux)

---

**Previous topic:** [23_alu_instruction.md](./23_alu_instruction.md)
**Next topic:** *(on the way — the fourth level of the Processor unit)*

*This lesson is part of the "From Switches to a Computer" series. The series moves along together with [nandgame.com](https://nandgame.com).*
