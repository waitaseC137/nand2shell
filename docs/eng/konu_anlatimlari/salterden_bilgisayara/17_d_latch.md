# 🧮 From Switches to a Computer — D Latch: The Gatekeeper of Memory

> Like the ones before it, this lesson is written as if someone were sitting
> across from you, watching. It asks you questions and waits while you build.
>
> In this level the circuit worked on the first try. The places where things got
> stuck were not in the circuit but in the concepts: it was assumed that "when a
> 0 arrives there is no data", and that a `nand` with one leg at 1 does not
> listen to its other leg. Both turned out to be the most instructive parts of
> this lesson, because both exposed a small gap carried over from the previous
> level.
>
> So the misconceptions were not deleted.

---

## 📋 Table of Contents

- [What Does This Part Do?](#what-does-this-part-do)
- [Viewfinder and Shutter](#viewfinder-and-shutter)
- [Zero Is Data Too](#zero-is-data-too)
- [Where Does the Data Live?](#where-does-the-data-live)
- [No New Memory Is Built](#no-new-memory-is-built)
- [The Translation Table](#the-translation-table)
- [Why Is the Command Zero?](#why-is-the-command-zero)
- [A Nand with One Leg at 1 Listens](#a-nand-with-one-leg-at-1-listens)
- [Column by Column](#column-by-column)
- [Why the Inverse of d?](#why-the-inverse-of-d)
- [The Forbidden Row Is Gone](#the-forbidden-row-is-gone)
- [🎮 Now You Build It](#-now-you-build-it)
- [While the Gate Is Open](#while-the-gate-is-open)
- [The One Thing That Does Not Change](#the-one-thing-that-does-not-change)

---

## What Does This Part Do?

You are at the second door of the Memory unit. Here is the view:

```
inputs:     st · d   (1 bit each)
output:     1 bit
toolbox:    sr latch · nand · inv · and · or · xor · select
```

There is something new in the toolbox: **`sr latch`.** The circuit you built from
two `nand`s in the previous lesson now sits there as a single part. The move you
named in [03.5](./03.5_soyutlama_merdiveni.md) is at work again: you box up what
you built and climb on top of it.

The table:

| st | d | output |
|---|---|---|
| 1 | 0 | 0 |
| 1 | 1 | 1 |
| 0 | 1 | **same as previous** |
| 0 | 0 | **same as previous** |

There is also a note: *"Before `st` is set to 1 for the first time, the output
is unspecified; any value is allowed."*

---

## Viewfinder and Shutter

Before looking at the table, get the two names straight, because that was the
first question: *"What are `st` and `d`?"*

- **`d` = data.** The bit that should be stored. It can keep changing.
- **`st` = store.** The trigger that says "take whatever is on `d` right now".

Think of a camera. `d` is the scene in the viewfinder, changing all the time.
`st` is the shutter button. While it is pressed, the output shows the current
scene. When you let go, the last frame stays, no matter how much the scene
changes.

Read the table again with this in mind:

```
st = 1   →   the output is whatever d is      (shutter pressed)
st = 0   →   d is not heard, the old frame    (shutter released)
```

The difference from the SR Latch is here: there were two separate buttons
there, "make it 1" and "make it 0". Here there is a single data wire and a
single "now" button.

---

## Zero Is Data Too

Looking at the bottom two rows of the table, this thought comes first: *"`d` is
0, `st` is 0, there is no data. So what is the output holding?"*

Two separate things are mixed up in that sentence.

**First: 0 does not mean "no data".** 0 is just as valid a bit as 1. The answer
"Is this region protected? No." is a piece of information. The reason nothing is
stored while `st=0` is not that `d` is 0, it is that **`st` is 0.** Had `d`
been 1, nothing would have been stored either. The table shows the proof side by
side: the `0 1` and `0 0` rows give the same answer.

**Second: "previous" does not come from outside.** The value the output is
holding does not come from any wire at that moment; it circulates **inside** the
SR Latch's loop. The previous lesson gave this a name: memory is not a notebook,
it is a motion that never stops.

> *"Haven't we fallen into a loop?"* We have, but into the **good** one. The loop
> has an even number of inversions, so it confirms itself. The loop that
> flickered was the odd one.

What happens if no value was ever written into the loop? The note under the
table says it in advance: until the first `st`, the output is free.

---

## Where Does the Data Live?

A deeper question comes out of this: *"Is what we call data the 0 and 1 coming
from `d`, or is it the state of the gates at that moment?"*

In the levels before Memory there was no need to ask. The signal always flowed
in one direction, and the state of the gates was computed from the current
inputs. Whoever knew the inputs also knew the state of every gate. "Data" and
"what is on the wires right now" were the same thing.

Feedback broke that. Now, with the same inputs (`st=0`), the output can be 0 or
1. The past decides which, and the past is stored nowhere else but in **the
state of the wires in the loop**.

In this level every wire has a different role:

| wire | role |
|---|---|
| `d` | **candidate** — "this might be what gets stored" |
| `st` | **decision** — "take it now" |
| `s`, `r` | **command** — tells the SR Latch what to do |
| the wires of the loop | **the actual data** — the stored bit lives here |

The most important row here is the third. `s` and `r` were never data, not in
the previous level either. Both were **commands**: "make it 1", "make it 0",
"leave it alone".

> 🔑 What the latch stores is not the current `d`, but **the `d` from the
> moment `st` was last 1.** After that moment `d` can change as much as it
> likes; the loop does not hear it.

---

## No New Memory Is Built

So why does the loop not hear `d` changing?

Because `d` **never touches the loop directly.** In this level you are not
building a new memory. The memory already exists, inside the SR Latch. What you
build in this level is a **translator** placed in front of it:

```
d, st  →  [ translator ]  →  s, r  →  [ SR Latch loop ]  →  output
candidate  translation      command    the actual data lives here
```

The SR Latch does not speak the language of `st` and `d`; it only understands
`s` and `r`. The translator's job is to translate `st` and `d` into that
language. If the translator produces a "leave it alone" command while `st=0`,
whatever `d` is, then `d`'s voice never reaches the loop.

> 🔑 Every part carries the inheritance of the one before it. The D Latch has no
> memory of its own; it uses the SR Latch's. The only new thing is the gatekeeping.

---

## The Translation Table

Building the translator means filling in this table. Remember the SR Latch's
rule: **the command is 0, the circuit rests at 1-1.** If `r` drops the output is
1, if `s` drops the output is 0.

| st | d | s | r | what should happen |
|---|---|---|---|---|
| 0 | 0 | ? | ? | leave it alone |
| 0 | 1 | ? | ? | leave it alone |
| 1 | 0 | ? | ? | write 0 |
| 1 | 1 | ? | ? | write 1 |

Fill it in yourself, then continue.

The first two rows are easy: "leave it alone" is `1 1` in the SR Latch's
language. For the bottom two rows you need to find which wire should drop, and
rather than going from memory, the safest way is to press the **`i`** button of
the `sr latch` in the toolbox and look at its own table.

```
write 0   →   s must drop   →   s=0  r=1
write 1   →   r must drop   →   s=1  r=0
```

| st | d | s | r |
|---|---|---|---|
| 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | **0** | 1 |
| 1 | 1 | 1 | **0** |

In the third row this question comes up: *"Reset has no effect there, so why is
it 1?"*

Because in this language **1 means "I am silent."** `r=1` means "reset says
nothing". The value of having no effect is already 1. Had `r` been 0 too, two
commands would arrive at once, and that would be the SR Latch's forbidden `0 0`
row.

---

## Why Is the Command Zero?

There is a question worth stopping for in the middle of the road here: *"Why are
1 and 0 reversed for the SR Latch? In everyday life 1 is on, 0 is off."*

Nobody made an arbitrary decision that "the command shall be 0". The reason is
that the SR Latch is **built from `nand`.** Look at a `nand` with one input 0
and with one input 1:

```
one input 0   →   the output is 1 without looking at the other input   (an order)
one input 1   →   the output is the inverse of the other input          (passes it on)
```

The only thing that can force the loop is a 0. When a 1 arrives, the `nand`
decides nothing; it passes the loop's own value on. That is why `1 1` means
"rest" and a single 0 means "command".

> 🔑 The value that has a say over `nand` is 0. You can only force it with a 0.

The same latch can also be built from **`nor`**. The value that has a say over
`nor` is 1, so in that latch the command is 1 and resting is `0 0`. Same logic,
opposite signs.

> 💡 Does the name **"NAND flash"** in SSDs come from here? Partly. The name
> comes from the memory cells being **strung in series** like a chain, because
> that arrangement resembles the transistor layout of a `nand` gate. But NAND
> flash is not a memory built from `nand` gates the way this lesson's is. The
> "NAND" in the name is a resemblance, not the structure itself.

---

## A Nand with One Leg at 1 Listens

While reading the previous section, this misconception came up: *"If a `nand`
with one input at 0 does not look at the other side, then a `nand` with one
input at 1 does not look either."*

It does look. Put the two rows where `a=1` side by side:

| a | b | nand |
|---|---|---|
| 1 | 0 | **1** |
| 1 | 1 | **0** |

`a` is the same in both rows, yet the output changes. The only thing changing it
is `b`. The output is exactly the inverse of `b`, in other words an `inv`.

Now the rows where `a=0`:

| a | b | nand |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |

`b` changes, the output does not. **This is the only case that does not look at
the other side.**

```
a = 0   →   nand does NOT HEAR b             (output locked at 1)
a = 1   →   nand passes b on INVERTED        (inv)
```

The previous lesson had the same thing: at `1 1` both `nand`s behaved like an
`inv` and the loop held itself. In this level the same property is useful once
more, this time as a gatekeeper:

```
st = 0   →   d is not heard
st = 1   →   d passes (inverted)
```

---

## Column by Column

Split the translation table into single columns. First `r`:

| st | d | r |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | **0** |

> Which gate with inputs `st` and `d` has exactly this table?

The 0 appears only when both inputs are 1. That is the very table you put side
by side in the previous section: **`r = nand(st, d)`.**

Now `s`. Add a helper column next to it:

| st | d | inverse d | s |
|---|---|---|---|
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 1 | **0** |
| 1 | 1 | 0 | 1 |

The 0 in `s` appears in the `d=0` row. Take `st` and **inverse d** as the inputs
and the table is `nand` again: **`s = nand(st, inv(d))`.**

Both gates are fed by `st`. While `st=0` both give 1, so the top half of the
translation table solves itself.

---

## Why the Inverse of d?

This is also a question that was really asked: *"Why does `s` need the inverse
of d?"*

In three steps:

1. `nand` gives 0 only when both inputs are 1. In no other case does it give 0.
2. The moment `s` has to drop to 0 is the moment `d=0` ("write 0").
3. At that moment `d` is 0, so if you feed `d` straight into the `nand`, the
   `nand` never gives 0. Invert `d` and `d=0` becomes a 1 in the `nand`'s eyes,
   and the `nand` fires.

In short, `r` asks "is d 1?" and `s` asks "is d 0?". Translating the second
question into a language `nand` understands takes an `inv`.

---

## The Forbidden Row Is Gone

What this section describes came up after the circuit was built and the level
was passed, while trying to explain the lesson.

What would happen without the `inv`? Both `nand`s would get `st` and `d`:

```
st=1  d=1   →   s = nand(1,1) = 0   r = nand(1,1) = 0   →   0 0  ⚠️ forbidden row
st=1  d=0   →   s = nand(1,0) = 1   r = nand(1,0) = 1   →   1 1     nothing gets written
```

So the `inv` does two jobs at once: it makes writing 0 possible, and it stops
two commands from arriving at the same time.

Look at the second one more closely. `d` and `inverse d` can **never both be 1
at the same time.** So `s` and `r` can never both drop to 0 at the same time.

> 🔑 The SR Latch's forbidden `0 0` row is **physically impossible** in this
> circuit. Because both commands are derived from a single data wire, two
> opposing orders cannot arrive at once.

In the previous lesson that row got its name,
[CWE-1245](https://cwe.mitre.org/data/definitions/1245.html) *(English page on
the way)*: leaving an undefined transition as "not used" and trusting that nobody
will use it. The D Latch gives a different answer to the same problem: **instead
of asking people not to use the undefined row, it builds a structure that cannot
reach it.** It does not leave the rule to the user; it bakes it into the shape of
the circuit.

---

## 🎮 Now You Build It

Parts list: **1 × `sr latch`**, **2 × `nand`**, **1 × `inv`**.

1. Wire `d` into the `inv`.
2. First `nand`: one leg `st`, the other leg the output of the `inv`. Its output
   goes to the **`s`** leg of the `sr latch`.
3. Second `nand`: one leg `st`, the other leg `d`. Its output goes to the
   **`r`** leg of the `sr latch`.
4. Wire the output of the `sr latch` to `Output`.

Do not mix up the gate going to `r` with the gate going to `s`. If you do, the
output always holds the inverse of `d`.

### How to test the memory

As in the previous lesson, looking at single rows is not enough; you need a
**sequence**:

| step | `st` `d` | expected | what is being tested |
|---|---|---|---|
| 1 | `1` `1` | `1` | is 1 written |
| 2 | `0` `1` | **`1`** | does it hold |
| 3 | `0` `0` | **`1`** | `d` changed, did it ignore it |
| 4 | `1` `0` | `0` | is 0 written |
| 5 | `0` `1` | **`0`** | `d` changed, did it ignore it |

Look at steps 3 and 5: `d` changes, the output does not. Those two rows are the
proof of the gatekeeper.

<details>
<summary>🔑 If you are stuck — the connection list</summary>

```
inv:       ← d
nand1:     a ← st    b ← inv output    →  sr latch.s
nand2:     a ← st    b ← d             →  sr latch.r
sr latch:  output  →  Output
```

Total: 4 components, 6 `nand`s (2 inside the `sr latch`, 1 inside the `inv`).

</details>

### One part too many

This circuit passes the level, but NandGame also says: *"it is possible to solve
using fewer components."*

That route was not tried while this lesson was written, so the answer is not
here. There is one hint: **you do not need to add a new part.** In the circuit
you built, there is a wire that already does the `inv`'s job.

---

## While the Gate Is Open

The gatekeeper does its job perfectly while `st=0`. But what happens while
`st=1`?

As long as `st=1`, the output follows `d` **instantly.** If `d` flickers, the
output flickers. As long as the shutter is held down, the camera is not taking a
photo, it is giving a live view. That is why latches like this are called
**transparent** latches: while the gate is open, everything passes through.

On its own this is an innocent property. Now recall the line from
[13](./13_arithmetic_unit.md):

```
PC ← PC + 1
```

Imagine keeping PC in a D Latch, feeding its output into the increment circuit,
and wiring the result back into the same latch's `d`. The moment you set
`st=1`:

```
PC = 5  →  d = 6  →  gate open, PC = 6  →  d = 7  →  PC = 7  →  ...
```

As long as the gate stays open the number keeps **climbing.** How many times it
climbs is decided by how long the gate stays open and how fast the gates are, in
other words, once again, a **race.** What you wanted was a single step.

> 🔑 A transparent latch gives a crude answer to the question "when": "as long as
> the gate is open." A computer needs a sharper answer: **"exactly now, once."**

The next level, **Data Flip-Flop**, builds that sharp moment. Its name comes from
there: the clock.

---

## The One Thing That Does Not Change

The level's note: *"Before `st` is set to 1 for the first time, the output is
unspecified."*

The D Latch removed the forbidden row, but it could not remove this note. The SR
Latch inside still wakes up at random in one of its two equally stable states.
The translator can only step in when a command arrives, and at the moment of
power-on no command has arrived yet.

The previous lesson gave this its name:
[CWE-1271](https://cwe.mitre.org/data/definitions/1271.html) *(English page on
the way)*, a security bit with no defined value at power-on. The D Latch does
not solve it. The fix is still the same: force every security-related bit to a
**known** value at power-on. Here that means setting `st=1` once at power-on and
writing a known `d`.

### Next up

**Data Flip-Flop.** Narrowing the transparent gate down to a single moment.

---

## Summary — Keep in Mind

```
☐ The toolbox now has sr latch: the previous lesson's circuit was boxed up and climbed on.
☐ d = data, the bit to store (viewfinder). st = store, "take it now" (shutter).
☐ st=1 → the output takes d. st=0 → d is not heard, the previous value stays.
☐ ⚠️ 0 does NOT mean "no data". The reason nothing is stored at st=0 is st, not d.
☐ The "previous value" does not come from outside, it circulates in the SR Latch's loop. The good loop: even inversions.
☐ 🔑 In Memory, DATA is the state of the loop's wires. d is the candidate, st the decision, s/r the COMMAND. s and r were never data.
☐ 🔑 The latch stores not the current d, but the d from the moment st was LAST 1.
☐ The D Latch builds no new memory. It places a TRANSLATOR (gatekeeper) in front of the SR Latch.
☐ In the SR Latch's language 1 = "I am silent", 0 = "command". Resting is 1-1.
☐ 🔑 The command is 0 because of nand: the value that has a say over it is 0. Built from nor, the command would be 1.
☐ ⚠️ A nand with one leg at 1 DOES LISTEN to its other leg and inverts it (inv). Only the one with a leg at 0 does not listen.
☐ Read the translation table COLUMN BY COLUMN: r = nand(st, d), s = nand(st, inv(d)).
☐ The inverse of d is needed because nand gives 0 only at 1-1; s has to fire when d=0.
☐ Without the inv: at st=1 d=1 both s and r are 0 → forbidden row. The inv does two jobs.
☐ 🔑 d and inverse d can never both be 1 → s and r can never both be 0 → THE FORBIDDEN ROW IS IMPOSSIBLE.
☐ 👾 An answer to CWE-1245: instead of asking people not to use the undefined row, make it unreachable.
☐ Solution: 4 components, 6 nands. NandGame says fewer is possible; hint: a wire already does the inv's job.
☐ Testing memory is a SEQUENCE: write → st=0 → change d → the output must not change.
☐ While st=1 the output follows d INSTANTLY: a TRANSPARENT latch. Build PC ← PC + 1 with it and the number keeps climbing.
☐ The need is not "while the gate is open" but "exactly now, once" → Data Flip-Flop and the clock.
☐ 👾 Still undefined at power-on: the D Latch does not solve CWE-1271. Force security bits to a known value at power-on.
```

---

## 🔗 Related Topics

- [16_sr_latch.md](./16_sr_latch.md) — The memory behind the gatekeeper; the command is 0, resting is 1-1, the number of inversions
- 👾 **The CWE this lesson answers:** [CWE-1245 — Improper state machine](https://cwe.mitre.org/data/definitions/1245.html) *(English page on the way)* — making the undefined row structurally unreachable
- 👾 **Left unsolved:** [CWE-1271](https://cwe.mitre.org/data/definitions/1271.html) *(English page on the way)* — a security bit with no defined value at power-on
- 👾 **A race while the gate is open:** [CWE-362 — Race Condition](https://cwe.mitre.org/data/definitions/362.html) *(English page on the way)* — a counter built on a transparent latch races instead of taking one step
- [13_arithmetic_unit.md](./13_arithmetic_unit.md) — `PC ← PC + 1`: why it cannot be built with a transparent latch
- [03.5_soyutlama_merdiveni.md](./03.5_soyutlama_merdiveni.md) — Boxing up what you built and climbing on top; the SR Latch is now a single part
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — `inv` = `nand`; why a `nand` with one leg at 1 behaves like an `inv`

---

**Previous topic:** [16_sr_latch.md](./16_sr_latch.md)
**Next topic:** *(on the way — Data Flip-Flop)*
