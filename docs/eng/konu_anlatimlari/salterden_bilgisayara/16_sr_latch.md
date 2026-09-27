# 🧮 From Switches to a Computer — SR Latch: The Circuit That Holds Its Own Tail

> Like the previous lesson, this one is written as if someone were sitting across
> from you, watching. It asks you questions and waits while you build.
>
> The wrong attempts in this lesson are not invented either; they really happened
> in this order. First both legs of both gates were given the two inputs, and no
> leg was left for the wire that has to come back. Then the structure was built
> correctly but one of the gates was the wrong choice, and the circuit started to
> **flicker**. That flicker is the most valuable part of this lesson, because it
> showed the difference between memory and instability better than any
> explanation could.
>
> So the mistakes were not deleted.

---

## 📋 Table of Contents

- [What Does This Part Do?](#what-does-this-part-do)
- [The Silent Rule of Eighteen Levels](#the-silent-rule-of-eighteen-levels)
- [The Wire That Comes Back](#the-wire-that-comes-back)
- [The Command Is Zero](#the-command-is-zero)
- [Set Does Not Mean Send](#set-does-not-mean-send)
- [The Gate That Speaks Firmly at Zero](#the-gate-that-speaks-firmly-at-zero)
- [First Attempt: No Free Leg Left](#first-attempt-no-free-leg-left)
- [The Circuit Flickers](#the-circuit-flickers)
- [Count the Inversions](#count-the-inversions)
- [Why Nobody Said Wrong](#why-nobody-said-wrong)
- [🎮 Now You Build It](#-now-you-build-it)
- [Same Input, Different Answer](#same-input-different-answer)
- [The Unused Row](#the-unused-row)
- [Waking Up Without Anyone Choosing](#waking-up-without-anyone-choosing)

---

## What Does This Part Do?

You are at the first door of the Memory unit. Here is the view:

```
inputs:     s · r   (1 bit each)
output:     1 bit
toolbox:    nand · and · or · inv · xor
```

The toolbox is familiar. At first glance the table is familiar too:

| s | r | output |
|---|---|---|
| 1 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 1 | **previous output** |
| 0 | 0 | not used |

The first two rows hold nothing new. You have been building tables like these for
eighteen levels.

What is new is **the third row.** There, the inputs are not enough to find the
output. You also need to know **the output itself.**

That single row asks for a circuit unlike anything you have built so far.

---

## The Silent Rule of Eighteen Levels

Every circuit you have built so far followed one rule. Nobody ever said it,
because it always held:

> **The output depends only on the current input.**

Tell me the inputs and I will compute the output. What the circuit did a minute
ago does not matter; it has no past. Circuits like this are called
**combinational**. The adder, the ALU, Condition: all of them were like this.

That rule was hiding a gap, and to see it you only need to go back to
[13](./13_arithmetic_unit.md). This line appeared there:

```
PC ← PC + 1
```

You built the increment circuit, so the `+ 1` part is ready. But **where does PC
live?**

Nowhere. There is no such thing. You always typed `X` and `Y` into the ALU by
hand. You read the result, and then the result was gone.

> 🔑 What you have built so far is a **calculator.** A computer is something that
> can keep its own result and put a new calculation on top of it. The difference
> between them starts with one ability: **remembering.**

Circuits that remember are called **sequential**. Every level of this unit builds
that ability, and all of them rest on the single idea in this level.

---

## The Wire That Comes Back

So far the signal has always flowed **in one direction**: from the inputs into the
gates, from the gates to the output. No wire ever turned back.

The third row of the table says "the output is the previous output". With the
gates you have, there is only one way to bring the previous output into the
circuit: **wire the output
back into the input of a gate.**

This is called **feedback**. And the idea is stranger than it sounds.

Ask a combinational circuit "what is the output?" and there is exactly one
answer. In a circuit with feedback that question can have **more than one
answer**. With the same inputs the circuit can sit at 0 or at 1, and which one
it sits at is decided by its **past**.

> 🔑 This kind of remembering is not like writing in ink. The circuit is holding
> its own tail: the gates in the loop hold each other at the same value. Nothing
> is circling around in there; there is a **balance** that stays up as long as
> the power does. Cut the power and the balance collapses, and the bit is gone.

The registers and the cache inside the processor are this one idea repeated
millions of times. The gigabytes of RAM in your computer take another road: they
hold each bit as charge in a [capacitor](./01.5_yasak_bolge.md), with no loop.
Because the charge leaks, every cell has to be refreshed roughly every 64
milliseconds. The flash memory in an SSD is yet another road: it traps the
charge in an insulated layer, and the bit stays even when the power is cut.

---

## The Command Is Zero

Before choosing a gate, read the table once more, this time with a different
question.

The names say: *"s=1 sets, r=1 resets."* But when both inputs are `1`, **nothing
happens**; the circuit just waits.

> While the circuit is waiting (`1 1`), which input has to change, and to what,
> for the output to become 1? Which one for it to become 0?

The answer:

```
output becomes 1   →   r must drop to 0
output becomes 0   →   s must drop to 0
```

You can read the same row in two ways:

| row | reading by name | reading by the drop |
|---|---|---|
| `s=1 r=0 → 1` | "only s is up → **set**" | "r dropped → 1" |
| `s=0 r=1 → 0` | "only r is up → **reset**" | "s dropped → 0" |

Both are correct. The names ask "which one stayed at 1?" For building the
circuit, the second reading is more useful: the circuit **rests at `1 1`**, and
for something to happen an input has to **drop to 0**.

> 🔑 In this circuit the command is not `1`, it is `0`. In electronics this is
> called **active low**. If you later see, in a **datasheet** (the technical
> document a maker publishes for a chip), a bar over a signal name (`S̄`, `R̄`) or
> `_n` / `#` at the end of the name (`RESET#`), this is what it means: "this
> signal does its job when it is 0."

> ⚠️ **Careful when you look at a datasheet: the names map to the game's the
> other way round.** In a datasheet's `nand` latch, when `S̄` drops, `Q = 1`, that
> is, "set". In the game, what makes the output 1 is **`r`** dropping. The game's
> `r` does the job of the datasheet's `S̄`, and `s` does the job of `R̄`. The reason
> is the naming: the game named them by the first reading of the table above
> ("which one stayed at 1"), the datasheet by the second ("which one dropped").
>
> This trap was fallen into even after the lesson was written: the SR Latch's
> contract was once stated backwards, as "if s drops 1, if r drops 0". Do not
> trust the name; look at what it does when it drops.

---

## Set Does Not Mean Send

A question may come up here: *"If reset clears, does set send the value on to
the next circuit?"*

No. **Set means "make the stored bit 1"**, **reset means "make the stored bit
0"**. Neither has anything to do with sending.

The latch does not push anything. The output wire **shows the stored bit all the
time**, like a lamp that is either on or off. Whenever the next circuit looks,
it sees the value at that moment.

Deciding *when* the value should be taken is a separate job. That job arrives
later in this unit, together with the **clock**.

---

## The Gate That Speaks Firmly at Zero

Now that you have read the table, you can look for the gate. The behaviour you
found is this:

```
one input drops to 0   →  the circuit forces a value without listening to the other input
both inputs are 1      →  the circuit leaves the decision somewhere else
```

So the question is:

> Which gate gives a firm answer without looking at the other input when one of
> its inputs is **0**, and leaves the decision to the other input when its input
> is **1**?

Try the five gates in the toolbox one by one with this question.

In the attempt this lesson was written from, the answer was **`and`**. And the
answer was right, because `and` really does fit the description. But it is not
the only gate that fits:

| gate | one input 0 → | one input 1 → |
|---|---|---|
| `and` | forces **0** | passes the other input **as is** |
| `nand` | forces **1** | passes the other input **inverted** |

Both fit the description. The difference between them is **which value** they
force when a 0 arrives.

Put this next to what you found in the previous section:

```
s drops  →  output must be 0   →  the one that forces 0: and ✓
r drops  →  output must be 1   →  the one that forces 1: ?
```

`and` does half the job perfectly. Give `s` to an `and`, and the moment `s`
drops the output becomes 0, whatever it was.

For the other half you need a gate that forces 1 when `r` drops, and the table
says that is `nand`. So: `and` + `nand`.

This is a sensible circuit; each gate is chosen for its own job. Build it.

---

## First Attempt: No Free Leg Left

In the first build, both legs of both gates were wired to the inputs:

```
and:   a ← r    b ← s
nand:  a ← r    b ← s
```

Look at what happens in the `1 1` row:

```
and (1, 1)  = 1
nand(1, 1)  = 0
```

The **same** answer every time. The table wants the **previous** output in this
row, but there is no wire in the circuit carrying the previous output. There
cannot be, because all four legs went to the inputs. There is no **free leg**
left for the feedback to plug into.

What you found in the previous section points the way: each input commands
**a single job**.

```
s  →  the "make it 0" command
r  →  the "make it 1" command
```

It is enough for each input to go to a single gate. Then one leg of each gate is
left free, and the free legs are waiting for the wires that come back.

So **which** wire should come to the free leg, the gate's own output or the other
gate's? You can derive this from the table too:

- The `Output` comes out of a single gate, but it has to hear **both** inputs:
  0 when `s` drops, 1 when `r` drops.
- The gate of `s` does not see `r` directly. It only hears about `r` if the output
  of `r`'s gate comes to its free leg. The same holds for the other side.
- If a gate listens to its own output, it never hears the other input at all. The
  two gates become two separate loops, cut off from each other. In the
  simulation the `and`'s output never heard `r`, and the `nand` inverted itself
  and flickered.

So each gate has to listen to the other: **cross-coupling.** It is not something
to memorise; it follows from the need that "the output must hear both inputs".

---

## The Circuit Flickers

The second build:

```
s              →  and.a
r              →  nand.b
and output     →  nand.a       ← feedback
nand output    →  and.b        ← feedback
```

The two gates are cross-coupled, each holding the other's tail. The structure is
exactly the one that was wanted.

Test it:

```
s=1  r=0   →   and = 1   ✓
s=0  r=1   →   and = 0   ✓
```

Two rows hold. When an input drops to 0 one gate forces its answer, and the loop
stays at that value.

Now set `s=1 r=1` and look carefully at the two numbers on the screen:

```
output of and      →  1
leg a of nand      →  0      ← the same wire!
```

One end of a single wire shows 1 and the other end shows 0. That cannot happen on
a real wire. The simulator could not bring the loop to rest and stopped it
somewhere. What you see is a snapshot of that moment.

To see why it does not come to rest, walk the loop by hand:

```
and = 1  →  nand(1, 1) = 0  →  and(1, 0) = 0
and = 0  →  nand(0, 1) = 1  →  and(1, 1) = 1
and = 1  →  ...                               forever
```

Whatever value you start with, one lap later it has turned into its **opposite**.
There is no value the circuit can rest at.

---

## Count the Inversions

Look at what each gate does to the value during the lap:

```
and   (while s = 1)  →  passes the value AS IS
nand  (while r = 1)  →  INVERTS the value
```

There is **one** inversion in the lap. The circuit is saying to itself *"my value
is the opposite of my value"*. No bit can make that sentence true, neither 0 nor
1.

So how many inversions does it take for the circuit to say *"my value is my
value"*?

Here the right answer is often **felt before it can be explained**: two `nand`s.
That feeling is right. One rule is enough to explain it:

```
(−) × (−) = (+)
```

While `s=1 r=1`, both `nand`s have a fixed `1` on one leg. A `nand` with one leg
at 1 outputs the inverse of its other leg, which means it behaves like an `inv`.
In [02](./02_nanddan_kapilar.md) you built `inv` by giving the same wire to both
legs of a `nand`. Fixing one leg to `1` does the same job. The loop actually
turns into this:

```
   ┌──→ inv ──→ inv ──┐
   └──────────────────┘
```

The value is inverted in the first half of the lap, inverted back in the second
half, and arrives where it started with the **same** value:

```
1  →  0  →  1   ✓ rests
0  →  1  →  0   ✓ rests
```

It rests comfortably at both values. Which one it is at is decided by the input
that dropped last. **That is memory.**

> 🔑 **While the inputs are resting (`1 1`), the number of inversions decides
> the loop's fate.**
>
> **Even** → the loop confirms itself → two stable states → **memory**
> **Odd** → the loop contradicts itself → no stable state → **oscillation**

The condition in the box matters. The circuit with `and` was also stable in the
`1 0` and `0 1` rows (the test above); the flicker only appeared at `1 1`. When
an input drops to 0, that gate stops listening to its other leg, the loop is
broken, and there is no round left to count. The counting rule only works while
both gates are listening, that is, in the resting row.

An even number is not enough on its own either. Cross-couple two `and`s and the
loop has no inversion at all, and zero is an even number: the loop holds a
memory. But when a 0 arrives, `and` can only force **0**. No input can write a 1
into this circuit; even at `s=1 r=0` the output stays at 0. The number tells you
whether there is a memory. Which values can be written is decided by what you
[saw above](#the-gate-that-speaks-firmly-at-zero): the value the gate forces
when a 0 arrives.

An odd loop is not useless either. Real chips build it on purpose, because it
produces a signal that blinks on and off without stopping. It is called a **ring
oscillator**. You will meet it again when we get to the clock.

> 🔬 On a real chip there is a subtle point. Wire a single `inv`'s output back to
> its own input and it does not flicker: the output sits in the forbidden zone
> from [01.5](./01.5_yasak_bolge.md), at a voltage halfway between 0 and 1. To
> flicker, the loop needs at least **three** inverting stages, and that is why
> real ring oscillators are built with 3, 5, 7… stages. The `and` + `nand` loop in
> this lesson is already like that: in
> [02](./02_nanddan_kapilar.md#and-the-inverse-of-the-inverse) you built `and` from
> a `nand` and an `inv`, so the loop has three stages: `nand`, `inv`, `nand`.

---

## Why Nobody Said Wrong

When the circuit started to flicker, "change the `and` to a `nand`" would have
been a single sentence. It was not said, and that was a deliberate choice.

The reason: the right circuit shows you **what** works. The wrong circuit shows
you **why** it works.

Had two `nand`s been built on the first try, the circuit would have worked and
the level would have been passed. But the fact that there is such a thing as
"the number of inversions" would never have come up. You would not have seen
that screen where the two ends of one wire show different values. You would not
have learned that memory and oscillation come from the same structure, with a
single gate between them.

Choosing `and` was not carelessness either. It fit the description, the
reasoning was sound, and it did its own job, forcing 0 when `s` drops,
perfectly. The problem was not in the gate itself; it showed up in **the loop as
a whole**. You cannot find this kind of problem by looking at the gates one by
one; you have to walk the loop.

> 🔑 Sometimes thinking about the mistake is not enough to find the right answer;
> you have to **live through** it. Looking at the gates one by one, `and` broke no
> rule. Seeing the mistake took walking the round, and what made us walk it was
> the flicker itself.

---

## 🎮 Now You Build It

Parts list: **2 × `nand`**. Nothing else.

1. First `nand`: wire leg `a` to `s`.
2. Second `nand`: wire leg `b` to `r`.
3. Cross-couple them: the output of the first to the free leg of the second, the
   output of the second to the free leg of the first.
4. Wire the `Output`. But to which gate?

### Where does the Output go?

In the circuit with `and`, the `Output` was on the gate of `s`. In the circuit
with two `nand`s this **changes.** Do not memorise which gate to wire it to; find
it by testing: set `s=1 r=0`, which gate gives `1`?

The reason is in the previous section: `nand` passes the value inverted. The
gate of `s` now holds the **inverse** of the stored bit. The two gates (except
at `0 0`) carry opposite values, and that is why real latches have two outputs:
`Q` and `Q̄`.

The bar here does not mean the same thing as the bar on `S̄`
[above](#the-command-is-zero). The bar on `S̄` says "does its job when it is 0"
(active low); the one on `Q̄` says "the inverse of `Q`". Datasheets write both
meanings with the same mark; you tell them apart from the context.

### How to test the memory

Looking at single rows is not enough. Testing memory needs a **sequence**:

| step | `s` `r` | expected | what is being tested |
|---|---|---|---|
| 1 | `1` `0` | `1` | set |
| 2 | `1` `1` | **`1`** | does it remember 1 |
| 3 | `0` `1` | `0` | reset |
| 4 | `1` `1` | **`0`** | does it remember 0 |

Look at step 2 and step 4: **the inputs are the same, the outputs differ.** Those
two rows are the proof that the circuit has memory.

<details>
<summary>🔑 If you are stuck — the connection list</summary>

```
nand1:  a ← s               b ← nand2 output
nand2:  a ← nand1 output    b ← r              →  Output
```

The `Output` is on the gate of `r`. `nand1` holds its inverse (except at `0 0`).

</details>

---

## Same Input, Different Answer

Think once more about step 2 and step 4 of the test table. This is a change that
affects everything you build from here on.

For eighteen levels a wrong circuit gave **a wrong value**, and always the same
wrong value. Feed the input again and you would see the mistake again. The
mistake depended **on the input alone.**

Now the circuit has a past. The same input and the same circuit can give **two
different results**. Which one comes out depends on the order in which you got
there.

> 🔑 Time has entered the circuit. And with time came a new class of bugs:
> **order-dependent bugs.** A test that looks at inputs one by one cannot find
> them. To find them you have to test the order.

Here the order is in the tester's hands: give the same order every time and you
get the same result. The case where the order is **in nobody's hands**, where two
signals race each other, comes up in the next section. That is where the race
condition is.

---

## The Unused Row

The last row of the table says "not used" for `0 0`. Not being used does not mean
the circuit does nothing in that row. Look at what happens in the circuit you
built:

```
nand1(s = 0, ·) = 1
nand2(·, r = 0) = 1
```

Both gates are `1`. Two outputs that should carry opposite values show the
**same** value. The circuit has broken its own rule.

The real trouble starts when **leaving** this row. If both inputs go from `0` to
`1` at the same moment, both gates compute `nand(1, 1)` at the same moment and
drop to `0` at the same moment. Then both go back to `1` at the same moment. The
loop starts to flicker.

This does not contradict the "even → memory" rule. The rule says **where** the
loop can rest, not **how it gets there**. The two stable states still exist, but
on a perfectly symmetric exit the circuit cannot pick one of them.

On a real chip two signals never arrive at exactly the same moment. Which one
rises first decides the result, and the winner is **the command of the input
that rises last**:

```
s rises first  →  r is still 0, the "make it 1" command holds   →  output 1
r rises first  →  s is still 0, the "make it 0" command holds   →  output 0
```

You **cannot know in advance** which one will rise first. The race between the
two wires decides the result.

One more subtlety. If the difference is very small, the circuit can hang between
the two for a while, in the forbidden zone from
[01.5](./01.5_yasak_bolge.md): neither 0 nor 1. It falls to one side in the end,
but when it will fall is not known. This is called **metastability**. You will
meet it again when we get to the clock.

You can see this yourself in NandGame. To get from `0 0` to `1 1` you have to
flip the two switches **one at a time**. It was tried in the game:

| order | output |
|---|---|
| `s` first, then `r` | `1` |
| `r` first, then `s` | `0` |

The order in which you press the switches decides the result.

> 🔑 The documentation says "not used" for this row, yet the circuit still does
> something. This is the dark side of the idea from [15](./15_condition.md):
> **what a circuit can do is not the same as what is described.** A state that
> should not be used is only safe as long as nobody actually uses it.
>
> 👾 The weakness catalogue's name for this row is
> [CWE-1245](../cwe/cwe_1245.md) —
> *Improper Finite State Machines (FSMs) in Hardware Logic*. The
> latch you built is a two-state **state machine**: a circuit that looks at its
> input and its current state and **moves** from one state to another. The `0 0`
> row is its undefined transition. MITRE's description fits this row:
> *"undefined states (left as don't cares) … drive the system into an unstable
> state."* With one difference: MITRE's machine only gets out of that state with
> a reset, while the latch recovers with the next valid command. The row the
> designer does not care about is the row the attacker cares about.
>
> In software this situation, where nobody chooses the order, is called a
> **race condition**: [CWE-362](../cwe/cwe_362.md). TOCTOU
> ([CWE-367](../cwe/cwe_367.md)), where a file changes between the moment a
> program checks it and the moment it uses it, is the software member of this
> family. The race when leaving `0 0` is its hardware ancestor.
>
> The weakness born from signals racing in hardware is called
> [CWE-1298](../cwe/cwe_1298.md) — *Hardware Logic Contains Race Conditions*.
> Its first seed is here; its page was written together with the selector latch
> experiment in [17](./17_d_latch.md#why-not-select).

---

## Waking Up Without Anyone Choosing

The level description had one more sentence: *"The output is undefined until the
first set or reset signal."*

Why undefined? Because the circuit has two stable states and both are equally
stable. The moment power arrives, the two gates will fall one way, and
**no design decision chooses** which way. Small differences in the wires,
temperature, and tiny imbalances left over from manufacturing do the choosing.

It looks like an innocent detail, but think of it this way: let this bit hold a
**lock**. A lock such as "Is debug mode on?" or "Is this memory region
protected?".

If that lock wakes up with a random value every time the chip powers on, then on
some boots the door that should be closed starts **open**.

> 👾 The weakness catalogue's name for this is
> [CWE-1271](../cwe/cwe_1271.md) —
> *Uninitialized Value on Reset for Registers Holding Security
> Settings*. In MITRE's example the attacker **resets the device over and over**
> and waits to land on a boot where the lock wakes up open. The fix is simple but
> easy to forget: force every security-related bit to a **known** value while
> reset is active. Do not wait for the first write, do not leave it undefined.
>
> In software the counterpart is far more familiar: using a variable that was
> never given an initial value. You read whatever was left in memory.

A latch starting "undefined" is not a problem, because NandGame openly accepts
it. When a security setting starts undefined, nobody knows what that setting is.

### Next up

**D Latch.** The SR Latch has two commands and one bad row. The next level turns
those two into a single data wire and a single "take it now" wire. That way the
bad row can no longer occur at all once the inputs have settled.

---

## Summary — Keep in Mind

```
☐ Every circuit so far was COMBINATIONAL: the output depends only on the current input, no past.
☐ A calculator computes, a computer REMEMBERS. The PC in 13's PC ← PC + 1 lived nowhere.
☐ A circuit that remembers is SEQUENTIAL. The one new idea: FEEDBACK, wiring the output back into a gate's input.
☐ In a circuit with feedback, "what is the output?" can have more than one answer. The PAST decides which.
☐ 🔑 Memory built from gates is not a notebook, it is a BALANCE that stays up with the power. Cut the power and the balance collapses, the bit is gone.
☐ Registers and cache are built on this idea. RAM (DRAM) holds the bit as charge in a capacitor and is refreshed; flash holds it without power.
☐ In this circuit the command is 0: the circuit rests at 1-1 and acts when an input DROPS to 0 (active low).
☐ r drops → output 1, s drops → output 0. The names say "which one stayed at 1"; both are readings of the same row.
☐ ⚠️ In a datasheet, when S̄ drops Q = 1: the game's r does the job of the datasheet's S̄. Look at the behaviour, not the name. The bar on Q̄ means "inverse".
☐ Set does not mean "send", it means "make the bit 1". The output shows the bit ALL THE TIME; when to take it is the clock's job.
☐ Two gates speak firmly at 0: and forces 0, nand forces 1. The difference is the VALUE THEY FORCE.
☐ Each input goes to one gate → one leg of each gate is left free → the feedback plugs into that free leg.
☐ The free leg gets the OTHER gate's output (cross-coupling): the output must hear both inputs. A gate listening to its own output never hears the other input.
☐ ⚠️ and + nand cross-coupled: two rows right, at 1-1 the circuit FLICKERS. The two ends of one wire show different values.
☐ 🔑 While the inputs rest (1-1), what decides is the NUMBER OF INVERSIONS. Even → confirms itself → MEMORY. Odd → contradicts itself → OSCILLATION.
☐ ⚠️ The number says whether there is a memory; which value can be written is decided by THE GATE TYPE: and+and is even but cannot write 1.
☐ A nand with one leg at 1 behaves like an inv. The two-nand loop = inv → inv = (−)×(−) = (+).
☐ An odd loop is useful too: the ring oscillator, a signal that blinks without stopping. It returns with the clock.
☐ The right circuit shows WHAT works, the wrong circuit shows WHY it works.
☐ and broke no rule; the problem was not in the gate but in THE LOOP AS A WHOLE. Loop bugs are not found by looking at gates one by one.
☐ Solution: 2 nand, optimal. The Output is on r's gate; s's gate holds its inverse (Q and Q̄), except at 0-0.
☐ Testing memory is a SEQUENCE: set → 1-1 → reset → 1-1. Same input (1-1), different output. That is the proof.
☐ 🔑 Time has entered the circuit: same input, same circuit, two different results. New bug class: ORDER-DEPENDENT bugs.
☐ You choose the order in the test, and the result is always the same: that is NOT a race. The race is where nobody chooses the order: leaving 0-0.
☐ The "not used" row (0-0) still does something: both outputs are 1, the rule is broken.
☐ Leaving 0-0 for 1-1, the RACE between two signals decides the result: the command of the one that rises LAST wins (s first → 1, r first → 0; tried in the game).
☐ If the difference is very small: METASTABILITY. The circuit hangs in the forbidden zone; when it will fall is not known.
☐ 👾 In software, race condition CWE-362, TOCTOU CWE-367. The race when leaving 0-0 is their hardware ancestor.
☐ 👾 The latch is a two-state STATE MACHINE; 0-0 is its undefined transition: CWE-1245 (MITRE's needs a reset, the latch recovers with the next command). The row the designer ignores is the row the attacker cares about.
☐ 👾 Signal race in hardware: CWE-1298. The documentation says "not used", the circuit still does something.
☐ At power-on the latch is undefined: the two stable states are equal, NO DESIGN DECISION chooses which one it falls into; physics does.
☐ 👾 If that bit is a security lock, on some boots the door starts open: CWE-1271. Force security bits to a known value while reset is active.
```

---

## 🔗 Related Topics

- 👾 **The race itself:** [CWE-362 — Race Condition](../cwe/cwe_362.md) — two jobs reaching for the same resource without synchronisation
- 👾 **The race in hardware:** [CWE-1298](../cwe/cwe_1298.md) — leaving `0 0` seeded it here, the selector latch grew it in 17
- 👾 **The grandchild in software:** [CWE-367 — TOCTOU](../cwe/cwe_367.md) — the gap between the check and the use
- 👾 **This lesson's main CWE:** [CWE-1245 — Improper state machine](../cwe/cwe_1245.md) — the row left as "not used"; why the D Latch exists
- 👾 **Undefined wake-up:** [CWE-1271](../cwe/cwe_1271.md) — a security bit with no defined value at power-on; the repeated reset attack
- [15_condition.md](./15_condition.md) — The difference between what a circuit can do and what is described
- [13_arithmetic_unit.md](./13_arithmetic_unit.md) — `PC ← PC + 1`: a counter with nowhere to be stored
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — `inv` = `nand`; here the same result is reached by fixing one leg to `1`

---

**Previous topic:** [15_condition.md](./15_condition.md)
**Next topic:** [17_d_latch.md](./17_d_latch.md)
