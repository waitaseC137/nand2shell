# 🧮 From Switches to a Computer — ALU: Changing the Material, Not the Operation

> In `12` you built the first circuit that takes an order. In `13` you took the
> selector off the output and moved it to the input. In this level both units sit
> ready on the shelf — the only thing left to do seems to be joining them.
>
> But under the table there are two more rows: `zx` and `sw`. Neither of them
> picks an operation. Neither of them goes inside the units.
>
> This lesson makes the series' last turn of the handle: if the selector can be
> moved to the input, then **the input itself can be changed.** And a table of
> eight rows starts doing far more than eight things without a single new gate.

---

## 📋 Table of Contents

- [What Does This Part Do?](#what-does-this-part-do)
- [Data Bits and Control Bits](#data-bits-and-control-bits)
- [Floor and Door: Control Bits Are an Address](#floor-and-door-control-bits-are-an-address)
- [Same Pair of Wires, Different Contracts](#same-pair-of-wires-different-contracts)
- [The Flags Change the Material](#the-flags-change-the-material)
- [Why Two Selectors for One Flag and One for the Other?](#why-two-selectors-for-one-flag-and-one-for-the-other)
- [The Trap: The Order Is Mandatory](#the-trap-the-order-is-mandatory)
- [The Trap: Wiring Zero to the Wrong Flag](#the-trap-wiring-zero-to-the-wrong-flag)
- [🎮 Now You Build It](#-now-you-build-it)
- [Compute Everything, Then Pick](#compute-everything-then-pick)
- [Eight Rows, 32 States](#eight-rows-32-states)

---

## What Does This Part Do?

ALU = **Arithmetic Logic Unit**. The only part of a processor that does the
arithmetic. In this level you build it — and because you are on the fourth level
of the unit, both of its halves are already in your hands.

Inputs:

```
X, Y          16 bits each   the numbers the operation works on
u             1 bit          which unit
op1, op0      2 bits         which operation inside that unit
zx, sw        2 bits         what happens to the operands
```

One output: a 16-bit result.

The first table in the documentation has eight rows:

| `u` | `op1` | `op0` | result |
|---|---|---|---|
| `0` | `0` | `0` | `X and Y` |
| `0` | `0` | `1` | `X or Y` |
| `0` | `1` | `0` | `X xor Y` |
| `0` | `1` | `1` | `invert X` |
| `1` | `0` | `0` | `X + Y` |
| `1` | `0` | `1` | `X + 1` |
| `1` | `1` | `0` | `X − Y` |
| `1` | `1` | `1` | `X − 1` |

The top four rows are the **logic unit** you built in `12`, the bottom four the
**arithmetic unit** you built in `13`. Both sit in the toolbox as ready-made
parts. So in this level you are not building a single logic gate — you are
**joining what you have already built.**

Then a second table arrives, and it looks nothing like the first:

| `zx` | `sw` | what `X − Y` becomes |
|---|---|---|
| `0` | `0` | `X − Y` |
| `0` | `1` | `Y − X` |
| `1` | `0` | `0 − Y` |
| `1` | `1` | `0 − X` |

Notice: **the operation did not change.** All four rows subtract. What changed is
*what gets handed to* the subtraction.

---

## Data Bits and Control Bits

Seven things enter this circuit and they split into two kinds. The distinction
holds for the rest of the series:

| | | what it carries |
|---|---|---|
| **data** | `X`, `Y` | the **numbers** being operated on |
| **control** | `u`, `op1`, `op0`, `zx`, `sw` | the **instruction** saying what to do |

`X` and `Y` are material. The other five are not numbers — they are orders. They
say "do this" to the circuit.

Together the five form a **control word**:

```
  u  op1  op0  zx  sw
  └──────── 5 bits ────────┘
```

This is the first time in the series you meet it: a circuit taking an entire
**instruction** as input. In `12` the order was two bits, in `13` two again. Here
it is five. In the upcoming **Processor** unit this word will be read from memory
and its name will be **machine instruction**.

> 🔑 There is no physical difference between a control bit and a data bit. Both
> are wires, both are either high or low. The difference is entirely in **where
> they are wired**. Another face of the sentence from `04`: meaning is not in the
> wire, it is in where the wire goes.

---

## Floor and Door: Control Bits Are an Address

`u`, `op1` and `op0` together form an **address**. Think of an apartment
building:

```
u        →  which floor            1 bit  →  2 floors
op1 op0  →  which door on it       2 bits →  4 doors
```

2 floors × 4 doors = **8 apartments**. The eight rows in the table are exactly
that.

| floor (`u`) | doors (`op1 op0`) |
|---|---|
| `0` — the logic floor | `and` · `or` · `xor` · `invert` |
| `1` — the arithmetic floor | `X+Y` · `X+1` · `X−Y` · `X−1` |

The addressing logic maps straight onto the circuit: `op1` and `op0` go to
**both units at once**, while `u` sits in the final selector. Both floors prepare
their answer first, then `u` says which floor the answer is taken from.

---

## Same Pair of Wires, Different Contracts

This is the easiest part of the lesson to skip over.

`op1` and `op0` are a single pair of wires. But they go to two different places
and they say two different things:

```
op1 op0 = 1 0    for the logic unit        →  xor
op1 op0 = 1 0    for the arithmetic unit   →  X − Y
```

The signal is the same. The voltage is the same. Its meaning changes with **who
is listening.**

The two units' contracts:

| | what `op1` says | what `op0` says |
|---|---|---|
| **logic unit** | the group: `and/or` or `xor/invert` | which member of the group |
| **arithmetic unit** | the operation: add or subtract | the second number: `Y` or constant `1` |

You worked out the right-hand column yourself in `13` — looking at the table and
saying *"`op1` changes what the operation is, `op0` changes what the second
operand is"*. That observation still holds. What is new is that **the left column
says something else at the same time.**

> 👾 This is the purest form of the sentence from `04` — *"the pattern is the
> same, the meaning is the reader's decision"* — and the circuit side of
> [CWE-681](../cwe/cwe_681.md). There the same bit pattern was read as two
> different numbers; here the same bit pattern is read as two different
> **instructions**. If the wrong unit listens, what comes out is not faulty —
> it is **a different operation.**

---

## The Flags Change the Material

`zx` and `sw` are not part of the address above. They pick none of the eight
apartments.

Their names say what they do:

```
zx  =  zero X     make the left operand 0
sw  =  swap       exchange X and Y
```

And both of them stand **in front of** the units:

| | what it says |
|---|---|
| `u`, `op1`, `op0` | **which machine** will run |
| `zx`, `sw` | **what gets handed** to that machine |

Write the second table as what is left of the minus and what is right of it, and
the shape of the circuit becomes visible:

| `zx` | `sw` | left operand | right operand |
|---|---|---|---|
| `0` | `0` | `X` | `Y` |
| `0` | `1` | `Y` | `X` |
| `1` | `0` | `0` | `Y` |
| `1` | `1` | `0` | `X` |

**The whole level is in this table.** Everything else is a ready-made part.

And the idea here is one step past `13`:

```
12:  four operations run, ONE IS PICKED AT THE OUTPUT
13:  the selector moves TO THE INPUT, what is behind it is built once
14:  the input is not PICKED, it is CHANGED — the operation never finds out
```

The units know nothing about these flags. The `arithmetic unit` is still
subtracting the two numbers that reach it; it does not know one of them is `0`.
It does not need to know — and that is exactly where the lesson's efficiency
comes from.

---

## Why Two Selectors for One Flag and One for the Other?

While building the front layer this is the first thing people get stuck on: `sw`
needs two `select 16` boxes, `zx` needs one. Why is it not symmetric?

The one-sentence answer:

> **`sw` touches both sides, `zx` touches only one.**

`sw` says "let them swap places". Both the left and the right receive a new
value. Producing two values takes two selectors.

`zx` says "let the **left** operand be 0". It never looks at the right side. One
value, one selector.

Draw the circuit as two separate pipelines and it settles:

```
RIGHT OPERAND  —  a single layer, never sees zx

   X ──┐
       ├── S2  (s = sw) ──────────────────►  right operand
   Y ──┘                                      → the Y input of both units


LEFT OPERAND  —  two layers, two questions

   X ──┐
       ├── S1  (s = sw) ──┐
   Y ──┘                  ├── S3  (s = zx) ──►  left operand
                 0 ───────┘                      → the X input of both units
```

`S2` goes straight to the units because the right side's single question has been
answered. `S1` does not go to the units; it stops at `S3` first, because the left
side **has one more question.**

The left side has to answer two questions: *who is on the left?* and *should it
be erased?* Two questions, two layers.

---

## The Trap: The Order Is Mandatory

In which order are `sw` and `zx` applied? This is not a preference — the table
forces it.

The litmus test is the last row:

| `zx` | `sw` | result |
|---|---|---|
| `1` | `1` | `0 − X` |

`sw` says "X and Y swap". `zx` says "the **left** operand becomes 0". With both
at 1 the result is `0 − X` — **`X`**, not `Y`.

Swap first: `X` moves to the right, the left becomes `Y`, then the left is
erased → `0 − X` ✅

Erase first: the left becomes `0`, then swap → `0` moves right, the left becomes
`X` → `X − 0` ❌

The reason is inside the word: `zx` says "**the left one**". For something to be
on the left, the positions have to be settled first. `sw` settles the positions,
`zx` touches the settled position.

> 💡 The general rule: if a layer describes a position — "the one over there" —
> the layer that decides positions has to come before it.

---

## The Trap: Wiring Zero to the Wrong Flag

There are three selectors in the front layer and all of them have spare data
legs. Plugging the `0` constant into one of them is very easy — and plugging it
into the wrong one is easier still.

The wrong build looks like this: `0` gets wired to the empty data leg of one of
the selectors driven by `sw`.

```
S1:  s = sw,  D0 = X,  D1 = 0      ← 0 is in the WRONG place here
```

In this circuit `0` appears whenever `sw` flips. But look at the table: `0` only
appears in the `zx = 1` rows. It never appears in the `sw` rows.

An analogy:

```
sw  is a PAIR OF SCISSORS  →  it swaps positions
zx  is an ERASER           →  it erases the left one
```

Tie the eraser to the handle of the scissors and the eraser fires every time you
turn the scissors.

**The symptom:** one of the four rows comes out right and three come out wrong.
And because the correct row is usually the starting state (`zx=0, sw=0`),
everything looks fine the first time you glance at the screen. Remember the
measure from `13` — to be able to say *"I would have noticed if it were broken"*
you have to walk **all four rows.**

---

## 🎮 Now You Build It

Parts list: **4 × `select 16`**, **1 × `0`**, **1 × `logic unit`**,
**1 × `arithmetic unit`**. No `nand`, `and 16`, `add 16` or `inv 16` at all —
they are already inside the units.

Go in order so the canvas stays readable:

1. **Produce the right operand.** A single selector, `s = sw`. When it is done,
   type `X=5, Y=3` and flip `sw`: you should see `3` and `5`.
2. **Build the first layer of the left operand.** A second selector, `s = sw`,
   but with its data legs **the reverse** of the first one's.
3. **Build the second layer of the left operand.** A third selector, `s = zx`.
   One of its data legs is the `0` constant, the other is the output of step 2.
4. **Verify the front layer.** Before placing any unit, walk all four rows:

   | `zx` | `sw` | left | right |
   |---|---|---|---|
   | `0` | `0` | `5` | `3` |
   | `0` | `1` | `3` | `5` |
   | `1` | `0` | `0` | `3` |
   | `1` | `1` | `0` | `5` |

5. **Place the units.** Left operand into the `X` leg of both, right operand into
   the `Y` leg of both. `op1` and `op0` to both.
6. **The final selector.** `s = u`, the two units' outputs on the two data legs.
   Wire its output to `Output`.

Verifying the front layer before placing the units is this level's one real
lesson in method. When you see a wrong number at the end, the fault can be in one
of nine places. With the front layer verified, that drops to three.

<details>
<summary>🔑 If you are stuck — the connection list</summary>

```
S1 (left candidate): s ← sw   D0 ← X            D1 ← Y
S2 (right operand):  s ← sw   D0 ← Y            D1 ← X
S3 (left operand):   s ← zx   D0 ← S1's output  D1 ← the 0 constant

logic unit:      op1 ← op1   op0 ← op0   X ← S3   Y ← S2
arithmetic unit: op1 ← op1   op0 ← op0   X ← S3   Y ← S2

S4 (result):     s ← u     D0 ← logic unit   D1 ← arithmetic unit
                 output → Output
```

The data legs of `S1` and `S2` are the reverse of each other — the same `sw` wire
drives both, but one puts `X` forward and the other puts `Y` forward. That is
where the swap comes from.

</details>

---

## Compute Everything, Then Pick

When the circuit is finished you will see this on screen: even when `u = 0`, a
number sits on the `arithmetic unit`'s output. Even when `zx = 1`, `S1` produces
a number.

Neither is used. But both are **computed.**

```
u = 0  →  the arithmetic unit still computed X+Y, the result was thrown away
zx = 1 →  S1 still produced sw's answer, the result was thrown away
```

This is not a fault, it is how hardware works. A circuit cannot wait around
asking "am I needed?" — waiting takes a circuit too, and that circuit takes time.
The cheaper road is this:

> **Compute everything, then pick one.**

You met this idea for the first time in `12` (*"all four always run"*). Here the
scale grows: now two whole units and a front layer throw away part of their
output on every instruction.

And right here the lesson's second face opens:

> 🔑 The discarded result **does not vanish.** It is merely *not used*. While it
> was being computed, gates switched, current flowed, heat came out, time passed.
> You cannot read the result — but you can read the **traces** of it having been
> computed.

For now that sentence is only a curiosity. By the time you reach `Stop 4` it will
be the name of a method. [CWE-1300](../cwe/cwe_1300.md) — physical side channel —
describes exactly this gap: something that is logically hidden staying physically
measurable.

---

## Eight Rows, 32 States

Now go back to the control word and count.

```
u  op1  op0  zx  sw     =  5 bits  →  2⁵ = 32 combinations
```

How many of them are written down?

- The first table: **8 rows** for `u`, `op1`, `op0`
- The second table: **4 rows** for `zx`, `sw` — and only through the `X − Y`
  example

So the documentation describes the two axes **separately**. The full cross
product is written nowhere. Each of the 32 combinations produces a result, but
only eight have an entry in a table.

### 🔍 Let's count

How many **distinct** operations can your circuit perform? Eight operations ×
four flag states = 32 combinations; but some give the same result (`X and Y` and
`Y and X` are the same thing). Remove the duplicates and list what is left.

<details>
<summary>🔑 Answer — count it yourself first</summary>

**Nineteen.**

```
constants      0        1        −1
copies         X        Y
negations      −X       −Y
inversions     not X    not Y
neighbours     X+1      X−1      Y+1      Y−1
addition       X+Y
subtractions   X−Y      Y−X
logic          X and Y  X or Y   X xor Y
```

**Eight** of them are written in the table. The remaining **eleven** come out of
the product of the two tables and are listed nowhere.

The most striking ones:

| how it comes out | result |
|---|---|
| the `X + 1` operation, `zx = 1` | `0 + 1` = the constant **1** |
| the `X − 1` operation, `zx = 1` | `0 − 1` = the constant **−1** |
| the `X and Y` operation, `zx = 1` | `0 and Y` = the constant **0** |
| the `X − Y` operation, `zx = 1` | `0 − Y` = **`−Y`**, negation |
| the `X or Y` operation, `zx = 1` | `0 or Y` = **`Y`**, passed through as is |

In `13` manufacturing the constant `1` cost you three parts (`0` + `inv` +
bundler). Here the constants `1`, `−1` and `0` come **for free** — with no extra
gate at all, purely as a flag combination. The same goes for "negate" and "pass
through unchanged": not in the table, yet present in the circuit.

</details>

### Undocumented States

Now to the real point. In NandGame these eleven undocumented states are **good
news** — free operations. On a real chip the same picture means something else.

If a piece of hardware has an `n`-bit control word, that part can enter `2ⁿ`
states. If the documentation describes only some of them, the rest do not
disappear — they **exist, undescribed.** If one of them switches off a security
feature, it is called a **chicken bit**.

MITRE catalogues this as a weakness of its own: **CWE-1242 — Inclusion of
Undocumented Features or Chicken Bits**.

The working rule that falls out of this:

> **Any control word wider than its documented state space is a place to look.**

That is exactly what reverse engineering does on the hardware side: put the
states the documentation counts next to the states the word allows, and try the
difference. The counting you did today in NandGame — 32 combinations, 8
documented rows — is the smallest version of that job.

> 📄 Details on its own page: [CWE-1242](../cwe/cwe_1242.md) —
> what a chicken bit is, why it gets left in, and
> why being undocumented does not count as a protection.

### Next up

**Condition**, the last level of the ALU unit. This time there is **no selector**
in the toolbox — for three levels you solved everything with `select`, and that
habit breaks here. And the overflow flag (OF) promised back in `10` gets paid off
there.

---

## Summary — Keep in Mind

```
☐ You build no gate in this level: you JOIN what you built in 12 and 13.
☐ Two kinds of bit: DATA (X, Y) and CONTROL (u, op1, op0, zx, sw). The difference is not in the wire but in where it is wired.
☐ Five control bits form a CONTROL WORD — in the Processor unit its name becomes "machine instruction".
☐ u · op1 · op0 are an ADDRESS: 2 floors × 4 doors = the 8 rows in the table.
☐ ⚠️ op1/op0 go to both units at once and are read under TWO DIFFERENT CONTRACTS. Same signal, separate meaning.
☐ zx and sw pick no operation: they say not "which machine" but "WHAT gets handed to the machine".
☐ zx = zero X (make the left operand zero) · sw = swap (exchange X and Y).
☐ 12: pick at the output · 13: pick at the input · 14: CHANGE THE INPUT. The units never find out.
☐ sw touches both sides → two selectors. zx touches one side → one selector. That is the asymmetry.
☐ The right operand NEVER sees zx: one layer. The left operand answers two questions: two layers.
☐ ⚠️ The order is mandatory: sw first, then zx. A layer that says "the left one" comes AFTER the layer that decides positions.
☐ ⚠️ The 0 constant belongs to zx's selector. Put it on sw's spare leg and you have tied an eraser to a pair of scissors.
☐ The symptom of a wrong build: ONE of the four rows is right — and that one is usually the starting state.
☐ Verify the front layer before placing the units: the fault surface drops from nine to three.
☐ Compute everything then pick: the arithmetic unit computes even when u=0, S1 runs even when zx=1.
☐ 🔑 A discarded result DOES NOT VANISH, it is merely unused. Gates switched, heat came out, time passed.
☐ The control word is 5 bits = 32 states. The documentation gives 8 rows + 4 rows SEPARATELY; it never writes the product.
☐ The circuit's real capacity is 19 distinct operations — 8 written down, 11 born from the flag product.
☐ The constant 1 that cost three parts in 13 comes FREE here with zx=1. So do the constants 0 and −1.
☐ 👾 Any control word wider than its documented state space is a place to look (CWE-1242).
```

---

## 🔗 Related Topics

- 👾 **Meaning is in the reader:** [CWE-681 — Incorrect conversion between numeric types](../cwe/cwe_681.md) — the same pattern read under two contracts
- 👾 **The trace of what was thrown away:** [CWE-1300 — Physical side channel](../cwe/cwe_1300.md) — what is computed but unused staying measurable
- 👾 **Undocumented space:** [CWE-1242 — Chicken Bits](../cwe/cwe_1242.md) — 32 states, 8 documented rows: the gap between them
- [13_arithmetic_unit.md](./13_arithmetic_unit.md) — Moving the selector to the input; the arithmetic contract of `op1`/`op0`
- [12_logic_unit.md](./12_logic_unit.md) — The first circuit that takes an order; "all four always run"
- [11_selector_switch.md](./11_selector_switch.md) — `select 16` itself, and fan-out
- [10_bayraklar.md](./10_bayraklar.md) — Where flags are built; the OF debt
- [04_teller_sayi_olunca.md](./04_teller_sayi_olunca.md) — Meaning is not in the wire but in where it goes
- [../x86_assembly/09_aritmetik.md](../x86_assembly/09_aritmetik.md) — The software side of the same operations
- [../x86_assembly/13_bit_islemleri.md](../x86_assembly/13_bit_islemleri.md) — The instruction counterparts of the logic floor

---

**Previous topic:** [13_arithmetic_unit.md](./13_arithmetic_unit.md)
**Next topic:** [15_condition.md](./15_condition.md)

*This lesson is part of the "From Switches to a Computer" series. The series moves along together with [nandgame.com](https://nandgame.com).*
