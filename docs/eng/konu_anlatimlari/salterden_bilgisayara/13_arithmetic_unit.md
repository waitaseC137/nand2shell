# 🧮 From Switches to a Computer — Arithmetic Unit: Moving the Selector to the Input

> In `12` four operations sat side by side on the canvas and you picked one at
> the output. In this level the table is four rows again and the parts in your
> hand are the same ones. The setup feels familiar.
>
> But look at the table a little longer this time and you will **not** see four
> separate operations. You will see two — and you will notice that the choice
> does not have to happen at the output.
>
> This lesson does not teach an operation. It teaches **doing the same job with
> fewer parts.**

---

## 📋 Table of Contents

- [What Does This Part Do?](#what-does-this-part-do)
- [Each Flag Asks Its Own Question](#each-flag-asks-its-own-question)
- [Moving the Selector to the Input](#moving-the-selector-to-the-input)
- [Who Will Produce the Constant 1?](#who-will-produce-the-constant-1)
- [A 16-Bit "1" Is Not One Wire](#a-16-bit-1-is-not-one-wire)
- [The Trap: Subtraction Is Not Commutative](#the-trap-subtraction-is-not-commutative)
- [The Trap: D0 and D1 Are Just Socket Names](#the-trap-d0-and-d1-are-just-socket-names)
- [🎮 Now You Build It](#-now-you-build-it)
- [How Do You Choose a Test?](#how-do-you-choose-a-test)
- [The Circuit That Runs on Every Instruction](#the-circuit-that-runs-on-every-instruction)

---

## What Does This Part Do?

In [lesson 9](../x86_assembly/09_aritmetik.md) of the x86 series you wrote these
lines:

```nasm
add eax, ebx
sub eax, ebx
inc eax
dec eax
```

All four of them run on the circuit you are about to build. The same journey as
in `12`, only the operations are arithmetic:

```
add eax, ebx
   │
   ①  the assembler turns the line into bits
   │
   ②  the control unit reads the bits and says "add"   →  op1 = 0, op0 = 0
   │
   ③  the values of eax and ebx arrive on wires X and Y
   │
   ④  ARITHMETIC UNIT: the right result comes out, per the order   ← this lesson
   │
   ⑤  the result is written back into eax
```

The only difference from `12` is ④. But the **inside** of that box will be built
in a completely different way — and the reason is hidden in the table.

---

## Each Flag Asks Its Own Question

Here is the table the level gives you:

| op1 | op0 | output |
|:-:|:-:|---|
| 0 | 0 | X + Y |
| 1 | 0 | X − Y |
| 0 | 1 | X + 1 |
| 1 | 1 | X − 1 |

Four rows, four operations. With the reflex from `12` you would build four boxes
and pick one at the output. That works. But first read the table **column by
column, not row by row.**

What happens when `op1` changes? Hold `op0` fixed and look:

```
with op0 = 0:   X + Y   →   X − Y        the sign changed
with op0 = 1:   X + 1   →   X − 1        the sign changed
```

In both cases `op1` does **the same thing**: it turns addition into subtraction.
It never touches the second number.

Now do the same for `op0`:

```
with op1 = 0:   X + Y   →   X + 1        the second number changed
with op1 = 1:   X − Y   →   X − 1        the second number changed
```

`op0` also does the same thing in both cases: it turns the second number from Y
into 1. It never touches the operation.

Write the table as a **two-axis grid** instead of four rows and it becomes
visible:

```
                op0 = 0      op0 = 1
              ┌──────────┬──────────┐
     op1 = 0  │  X + Y   │  X + 1   │     the addition row
              ├──────────┼──────────┤
     op1 = 1  │  X − Y   │  X − 1   │     the subtraction row
              └──────────┴──────────┘
                  Y           1
            second number  second number
```

> 🔑 `op1` picks **which operation** it is, `op0` picks **what the second number
> is.** The two never mix; two separate questions with two separate answers.

This is a **different structure** from `12`. There the two flags formed a
hierarchy: `op1` chose the group, `op0` chose the operation inside the group —
like tens and ones. Here there is no hierarchy; there are **two independent
axes.**

And a third observation: X sits on the left in all four rows, always in the same
place. X never enters any choice.

> ⚠️ Reading it as "X stays fixed in some cases" would be wrong. X does **not
> change in any case.** What changes is the second number that goes into the
> operation with it.

---

## Moving the Selector to the Input

The brute-force way would be this: build all four operations, pick at the output.

```
X+Y   X−Y   X+1   X−1        →  4 arithmetic units
  │     │     │     │
  └──┬──┘     └──┬──┘
     A           B           →  2 selectors
     └─────┬─────┘
           C                 →  1 more selector
```

It works. That is the schematic of `12`. But look at the grid again: `X + Y` and
`X + 1` are **the same operation.** Both are addition. Why would you build two
adders?

Change the order. Pick the second number first, then do the operation:

```
  Y ────────→ D0 ┐
                 ├─ selector (lever = op0) ──┬──→ adder ──────┐
  1 ────────→ D1 ┘                           │                ├─ selector (lever = op1) → output
                                             └──→ subtractor ─┘
  X ──────────────────────────────────────────→ (the first input of both)
```

| | brute-force | this way |
|---|:-:|:-:|
| arithmetic units | 4 | **2** |
| selectors | 3 | **2** |

Same table, half the parts.

> 🔑 The selector does not have to sit at the output. **If you choose at the
> input, you only have to build everything behind it once.**

The reason is the grid itself: the two cells in the addition row are *the same
operation*, only their second numbers differ. If you settle the difference
**before** the operation, you build the operation once.

> 💡 This is not a "trick", it is a recurring design reflex. Whenever a design
> contains more than one of the same part, ask: *can I settle the difference
> earlier?*

The rule from `12` — "they all run, one gets picked" — still holds here, except
now **two run instead of four.** Both the adder and the subtractor compute all
the time, both see the same wire as their second number, and the selector above
lets one of them through.

---

## Who Will Produce the Constant 1?

The selector at the input needs two sources: **Y** and **1**.

Y is ready, sitting down there as an input. But where will the 1 come from?

Look at the toolbox. There is `nand`, `select 16`, `add 16`, `sub 16`, `inv`,
`16 bit bundler`, and a constant **`0`**.

There is no `1`.

This is not an omission, it is the level's question. What happens if you invert
the constant 0?

```
  0  ──→  inv  ──→  1
```

The `inv` you built out of NANDs back in `02` flips the wire at its input. If the
input is 0, the output is 1. That is where the constant 1 comes from.

> 🔑 In hardware constants are not **stored** somewhere, they are **manufactured.**
> The thing you call "1" is a wire held at a voltage; you either tie it straight
> to the supply or you flip a 0 you already have.

One thing is still missing: the output of `inv` is **a single wire.** The input
of the selector is 16 wires. These do not connect directly.

---

## A 16-Bit "1" Is Not One Wire

This is the real lesson of this level.

In software you write `1` and you are done. In hardware there is no such thing.
In a 16-bit number system, `1` is this:

```
  bit   15 14 13 12 11 10  9  8  7  6  5  4  3  2  1  0
        ─────────────────────────────────────────────────
         0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  1
         └──────────────── 15 wires low ───────────┘   └─ 1 wire high
```

**Sixteen wires.** Fifteen of them at 0, one at 1. `inv` hands you only one of
them — bit 0. The remaining fifteen also have to exist and sit at 0.

The `16 bit bundler` exists exactly for this job: it takes 16 separate one-bit
wires and turns them into a single 16-bit value.

```
  bit 0  ←── inv output (1)
  bit 1  ←── unconnected (0)
  bit 2  ←── unconnected (0)
    ⋮                          ═══>  16-bit value:  0x0001
  bit 15 ←── unconnected (0)
```

Since unconnected inputs count as 0 (the rule from `08`), wiring bit 0 alone is
enough. But the other fifteen are **conceptually there** — the bundler produces
them as well.

> 🔑 The bundler does not compute anything. It is a **width adapter:** it weaves
> a road out of single wires.

This distinction matters, because inside a processor the two always travel
together but their jobs are separate:

| part | its job |
|---|---|
| `0` + `inv` + `bundler` | **manufacturing** the constant 1 |
| the first `select 16` | **choosing** between Y and that constant |

One is a producer, the other is a chooser.

And notice this: without the bundler you could not have put a 16-bit constant on
the selector's input. If you cannot put it there, you cannot choose at the input;
if you cannot choose at the input, you would have been forced to build four
arithmetic units. **The thing that makes the cheap design possible is the width
adapter.**

> 💡 This width business will come up again. When you load an 8-bit value into a
> 16-bit place, what do you fill the remaining 8 bits with? For negative numbers
> there are two different correct answers — we will open that in the memory unit.

---

## The Trap: Subtraction Is Not Commutative

`add 16` and `sub 16` each have two inputs: `A` and `B`.

```
  add 16   →   A + B
  sub 16   →   A − B
```

In addition the order does not matter: `A + B` equals `B + A`. In subtraction it
does:

```
   5 − 3  =  2
   3 − 5  = −2        not the same thing
```

The table says `X − Y`, not `Y − X`. Therefore:

> ⚠️ **X always goes to `A`, the selector's output always goes to `B`.** In both
> boxes.

If you wire them the other way round, the addition rows come out **correct**
(because addition is commutative) and the subtraction rows come out with the
wrong sign. A circuit that half works is more confusing than one that does not
work at all — because you think "the connections are probably right".

---

## The Trap: D0 and D1 Are Just Socket Names

The two data inputs of `select 16` are named `D0` and `D1`. These names are about
**the value of the lever**:

| lever (s) | what passes to the output |
|:-:|:-:|
| 0 | **D0** |
| 1 | **D1** |

`D1` has nothing to do with the `1` in the table, nor with `X`, nor with `Y`. It
is the name of a socket, that is all. What you put inside it is your decision.

The rule from `11` applies here too, and it comes down to one question:

> 🔑 **Whatever has to pass when the lever is 0 gets wired to D0.**

For the selector at the input, the lever is `op0`. Look at the table — when
`op0 = 0` the second number is **Y**. So Y → `D0`, constant 1 → `D1`.

For the selector at the output, ask yourself the same question: *what is its
lever, and which result has to pass when that lever is 0?*

---

## 🎮 Now You Build It

**Task:** NandGame → **Arithmetic Logic Unit → Arithmetic Unit** level.

What you have: `nand`, `select 16`, `add 16`, `sub 16`, `0`, `inv`,
`16 bit bundler`.

Go in order, do not try to build it in one move:

1. First **manufacture the constant 1** (`0` → `inv` → the bundler's **bit 0**).
   Check that the bundler's output reads `Hex 0001`. If it does not, do not go
   further.
2. Then build the **input selector** (lever `op0`, Y and the constant 1).
3. Then `add 16` and `sub 16` — **X into the `A` of both**, the selector's output
   into the `B` of both.
4. Last, the **output selector** (lever `op1`).

> 💡 Putting the constant 1 on the wrong leg of the bundler is the most common
> mistake in this level. Put it on bit 11 and the circuit computes `X + 2048` —
> because 2¹¹ = 2048. The good news: the bundler's output reads `0800`, which
> means **the instrument tells you about the mistake.** Make reading the number
> on the wire a habit.

<details>
<summary>🔒 Solution schematic — try it yourself first, then open</summary>

1. `0` → `inv` → the **bit 0** input of the `16 bit bundler`. The other 15 bits
   are unconnected (0).
2. `select 16` (input): `D0` ← **Y**, `D1` ← the bundler's output, `s` ← **op0**.
3. `add 16`: `A` ← **X**, `B` ← the input selector's output.
4. `sub 16`: `A` ← **X**, `B` ← the input selector's output. *(the same wire goes
   into two boxes at once — the fan-out from `11`)*
5. `select 16` (output): `D0` ← `add 16`, `D1` ← `sub 16`, `s` ← **op1** → to the
   **output**.

</details>

---

## How Do You Choose a Test?

Before you press `Check solution`, test the circuit yourself. But what kind of
test?

Run these four rows:

| X | Y | op1 | op0 | expected |
|:-:|:-:|:-:|:-:|:-:|
| 5 | 3 | 0 | 0 | **8** |
| 5 | 3 | 1 | 0 | **2** |
| 5 | 3 | 0 | 1 | **6** |
| 5 | 3 | 1 | 1 | **4** |

The real question is: **why 5 and 3?**

Because all four results differ from each other: 8, 2, 6, 4. You can tell which
row is broken just by looking at the output.

A bad choice would have cost you that. Try X = 2, Y = 1:

```
X + Y = 3        X − Y = 1
X + 1 = 3        X − 1 = 1        ← two pairs give the same number
```

With that test, even if `op0` were broken, **all four rows would look correct.**
The circuit is wrong and the test is green. That is the worst case.

> 🔑 A test does not only ask "did it work". Its real job is to let you say **I
> would have noticed if it were broken.** A test whose results cannot be told
> apart is worse than no test at all — because it gives you false confidence.

This is one step beyond the rule from `12`, "pick an input that gives a non-zero
result". There you wanted to see that a box was working; here you want to **tell
four cases apart.**

---

## The Circuit That Runs on Every Instruction

The `X + 1` row in the table looks innocent. It is actually the **most frequently
performed arithmetic operation** in the machine.

When a processor finishes an instruction it asks "where is the next one?" The
answer:

```
PC ← PC + 1
```

`PC` = the program counter, the register holding the address of the next
instruction. This addition happens **on every instruction**, nonstop, as long as
the machine is on.

And not only there:

| where | what |
|---|---|
| [loops](../x86_assembly/12_donguler.md) | `i++` — one increment per turn |
| [the stack](../x86_assembly/14_stack.md) | the stack pointer shifts by one on every `push`/`pop` |
| walking an array | "go to the next element" = increment the address |

That is why `+1` and `−1` earned a place in the table as legitimately as `+Y`.
The circuit you built today is the circuit that will drive the program counter in
the upcoming **Processor** unit.

> 💡 x86 has separate `inc` and `dec` instructions for the same reason. The funny
> ending: on modern processors `inc` is sometimes **slower** than `add reg, 1`,
> because it does not update all the flags, and that partial update causes stalls
> in the pipeline. What once made things faster became a burden when the
> architecture changed.

### Next up

**ALU** will merge the two units you built in this unit — the Logic Unit and the
Arithmetic Unit — into a single box. After that, **Condition** will bring the
overflow flag (OF) that was promised back in `10`.

---

## Summary — Keep in Mind

```
☐ Read the table COLUMN by column, not row by row: each flag asks its own question.
☐ op1 = which operation (add/sub) · op0 = what the second number is (Y / constant 1).
☐ Difference from 12: there it was a hierarchy (group + member), here there are TWO INDEPENDENT AXES.
☐ X enters no choice at all — it is on the left in all four rows, always the same place.
☐ The selector does NOT have to sit at the output. Choose at the input and you build what is behind it once.
☐ Brute force: 4 arithmetic units + 3 selectors · this way: 2 + 2. Same table, half the parts.
☐ The reflex: if a design has more than one of the same part, ask "can I settle the difference earlier?"
☐ In hardware constants are not stored, they are MANUFACTURED. Constant 1 = inv(0).
☐ A 16-bit "1" is not one wire, it is SIXTEEN wires: 15 low, 1 high.
☐ The bundler computes nothing, it is a WIDTH ADAPTER. Without it you could not choose at the input.
☐ ⚠️ sub is not commutative: X ALWAYS goes to A. Wire it backwards and addition is right, subtraction is inverted.
☐ D0/D1 are just socket names — nothing to do with the 1 in the table. What passes when the lever is 0 goes to D0.
☐ If the constant 1 lands on the wrong bit the circuit computes X + 2048; the 0800 on the wire tells you.
☐ A good test = one where you can say "I would have noticed if it were broken". 5 and 3 → all four results differ.
☐ A test whose results cannot be told apart is worse than no test: it gives false confidence.
☐ X + 1 is the machine's most frequent arithmetic operation: PC ← PC + 1, on every instruction.
```

---

## 🔗 Related Topics

- 👾 **For the curious:** [CWE-193 — Off-by-one](https://cwe.mitre.org/data/definitions/193.html) *(English page on the way)* — this lesson's `X + 1` landing one unit off: is it `<` or `<=`
- 👾 **The width axis:** [CWE-194 — Sign extension](https://cwe.mitre.org/data/definitions/194.html) (narrow → wide) and [CWE-197 — Truncation](https://cwe.mitre.org/data/definitions/197.html) (wide → narrow) *(English pages on the way)* — the security counterpart of the bundler section
- [12_logic_unit.md](./12_logic_unit.md) — The same idea with logic operations; the order, the choice, "they all run, one gets picked"
- [11_selector_switch.md](./11_selector_switch.md) — The selector itself and fan-out
- [09_subtraction.md](./09_subtraction.md) — The circuit inside `sub 16`
- [08_increment.md](./08_increment.md) — Why an unconnected input counts as 0
- [04_teller_sayi_olunca.md](./04_teller_sayi_olunca.md) — Wires becoming numbers; bit weights (2¹¹ = 2048)
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — The circuit inside the `inv` box
- [../x86_assembly/09_aritmetik.md](../x86_assembly/09_aritmetik.md) — **The same operations, from the software side**

---

**Previous topic:** [12_logic_unit.md](./12_logic_unit.md)
**Next topic:** [14_alu.md](./14_alu.md)

*This lesson is part of the "From Switches to a Computer" series. The series moves along together with [nandgame.com](https://nandgame.com).*
