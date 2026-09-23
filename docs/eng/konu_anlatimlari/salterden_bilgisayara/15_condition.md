# 🧮 From Switches to a Computer — Condition: A Valve, Not a Selector

> This lesson is written differently from the others. As if someone were sitting
> across from you, watching. It will ask you questions, wait while you build, and
> say "hold on, let's look at this" when you wire something wrong.
>
> And the wrong attempts in this lesson are not invented. They really happened,
> in this order: first the right logic was handed to the wrong gate, then the
> right part was wired to the wrong signal, then the circuit entered the state of
> "it works, but for the wrong reason". All three were corrected — and each one
> taught something that a straight explanation could not.
>
> So the mistakes were not deleted. The lesson is built on top of them.

---

## 📋 Table of Contents

- [What Does This Part Do?](#what-does-this-part-do)
- [lt, eq, gt Are Not a Number](#lt-eq-gt-are-not-a-number)
- [Why Is Everything Relative to Zero?](#why-is-everything-relative-to-zero)
- [The Part That Is Not in the Toolbox](#the-part-that-is-not-in-the-toolbox)
- [The First Attempt and Why It Failed](#the-first-attempt-and-why-it-failed)
- [Moving the NOT to the Input](#moving-the-not-to-the-input)
- [Why xor Works and Why You Should Not Write It](#why-xor-works-and-why-you-should-not-write-it)
- [The Trap: Right Part, Wrong Wire](#the-trap-right-part-wrong-wire)
- [AND as a Valve](#and-as-a-valve)
- [Combining Three Things with Two-Legged Gates](#combining-three-things-with-two-legged-gates)
- [🎮 Now You Build It](#-now-you-build-it)
- [You Never Built the Table](#you-never-built-the-table)
- [The Debt That Closes: OF](#the-debt-that-closes-of)

---

## What Does This Part Do?

You open the level. Here is the view:

```
inputs:    lt · eq · gt   (1 bit each)     X   (16 bits)
output:    1 bit
toolbox:   nand · inv · and · or · xor · is neg · is zero
```

And two things catch your eye immediately — both of them **absences**:

**① There is no `select 16` in the toolbox.**

For three levels you solved every table with a selector. In `12` you picked one
of four operations, in `13` you moved the selector to the input, in `14` you used
four selectors at once. Now that tool is taken away from you. What you put in its
place is the real subject of this lesson.

**② The third condition is not in the toolbox.**

There is `is neg` (is it negative) and `is zero` (is it zero). But there is **no**
part for "is it positive". You are going to manufacture it yourself — out of the
two parts you already have.

---

## lt, eq, gt Are Not a Number

There is one question to answer before you start, and the shape of the circuit
falls out of the answer.

The names are abbreviations:

```
lt  =  less than
eq  =  equal
gt  =  greater than
```

In some fonts `lt` looks like `It` — that first character is a lowercase L, not a
capital i. You will meet this trio for the rest of your life: in assembly, in C,
in database queries, always the same abbreviations.

But the real question is: **what do these three bits say?**

They are not a number. They are not read as "0 = less than, 1 = equal, 2 =
greater than". All three can arrive at once. None of them can arrive.

Think about the two extremes: what does `lt=0, eq=0, gt=0` mean? Or
`lt=1, eq=1, gt=1`?

The documentation answers: the first is **Never**, the second is **Always**.
Never and always. Neither of those is a comparison operator.

So the answer is this: the number of outcomes a comparison between two numbers
can produce is **exactly three.**

```
less    equal    greater
```

There is no fourth. A number is either less, or equal, or greater — one of the
three, and only one. Mathematics calls this trio **trichotomy**.

`lt`, `eq`, `gt` do not say "which comparison to perform". They say:

> **Which of these three outcomes count as "success"?**

Each flag is a **permission**. Open means that outcome is accepted, closed means
rejected.

### Compound operators are not new operators

The documentation has eight rows: `<`, `=`, `>`, `≥`, `≤`, `≠`, plus the two
extremes. There are not eight separate circuits for eight operators — there are
three bits. Because `≥`, `≤` and `≠` are not separate things; they are **unions**
of the three basic outcomes:

| operator | which outcomes it permits | `lt eq gt` |
|---|---|---|
| `X > 0` | greater only | `0 0 1` |
| `X = 0` | equal only | `0 1 0` |
| `X ≥ 0` | equal **or** greater | `0 1 1` |
| `X < 0` | less only | `1 0 0` |
| `X ≠ 0` | less **or** greater | `1 0 1` |
| `X ≤ 0` | less **or** equal | `1 1 0` |
| `Never` | none of them | `0 0 0` |
| `Always` | all of them | `1 1 1` |

The subsets of three things: 2³ = **8**. Those are the eight rows in the table.
Not one more, not one fewer.

> 🔑 You are not building a comparison called `≥`. You are separately permitting
> "equal" and "greater", and both count as valid. **The operator is born from the
> sum of the permissions.**

---

## Why Is Everything Relative to Zero?

Look at the table once more. Every row is written against zero: `X > 0`, `X = 0`,
`X < 0`. There is no row saying "is X greater than Y". Why?

Because a comparison **is** a subtraction.

```
comparing a with b   =   computing X = a − b
                         then looking at where X sits relative to zero

a = b   →   a − b = 0         →   X = 0
a < b   →   a − b is negative →   X < 0
a > b   →   a − b is positive →   X > 0
```

So this level is not independent of the [ALU](./14_alu.md). The ALU you built
yesterday does the subtraction, this level **reads** the result. Put together,
they answer "is a less than b" — and no second circuit is needed.

In a real processor this has a name. On x86, `cmp a, b` does exactly `a − b` and
**throws the result away** — it only keeps the flags. The `jl` / `je` / `jg` /
`jge` / `jne` instructions that follow do exactly the job of the circuit you are
about to build. You saw the software side in
[10_bayraklar_ve_cmp.md](../x86_assembly/10_bayraklar_ve_cmp.md); here is the
hardware side.

---

## The Part That Is Not in the Toolbox

You need to detect three outcomes. Let's look at the toolbox:

```
is zero   →  is X = 0 ?        ✅ ready
is neg    →  is X < 0 ?        ✅ ready
   ?      →  is X > 0 ?        ❌ MISSING
```

Two are given, the third is not. But the third one is in your hands too — because
the three outcomes are **mutually exclusive**.

> If a number is not negative and not zero, what is left?

Answer that and you can manufacture the third part out of the two you have. Build
it first; permissions come later.

---

## The First Attempt and Why It Failed

Suppose you set up the condition correctly:

> `X > 0`  ⟺  *not zero* **AND** *not negative*

That is exactly right, and the reasoning is right too: the three outcomes exclude
each other, eliminate two and the third remains. And yes, "two conditions at
once" = **AND**.

If you have got this far, the following looks very reasonable: `and` is in the
toolbox but so is `nand`, and `nand` + `inv` = `and`. Feed the two parts'
outputs into `nand`, then flip the result with `inv`.

Built. But it does not work. Why?

### Hold on, let's write out the three rows

First separate these:

```
what was given:        is zero        and   is neg
what the condition says:  NOT is zero  and   NOT is neg
```

The "not"s are missing. Let's walk the three cases:

| X | `is zero` | `is neg` | `nand` | `inv(nand)` = and | wanted |
|---|---|---|---|---|---|
| `X > 0` | `0` | `0` | `1` | `0` | **1** |
| `X = 0` | `1` | `0` | `1` | `0` | `0` |
| `X < 0` | `0` | `1` | `1` | `0` | `0` |

The `nand` column is `1` in all three rows. Invert it and all three become `0`.
So the circuit says either **always 1** or **always 0** — it distinguishes
nothing.

The reason: `is zero` and `is neg` **can never be 1 at the same time.** A number
cannot be both zero and negative. Feed an AND gate two mutually exclusive things
and its output stays `0` forever.

> ⚠️ What you learn here is not about picking a gate. **The logic can be right
> while the wiring is wrong** — and from the outside the two look identical. The
> circuit is built, the wires are connected, the screen shows a number. You only
> see that it is wrong once you write out the three rows.

---

## Moving the NOT to the Input

The condition contains two "not"s. The `inv` was placed at the output. So where
do the "not"s actually sit in the sentence?

```
(NOT zero)  and  (NOT negative)
    ↑                  ↑
  here               here
```

**Inside** the parentheses. Which means that is where the `inv` gates belong too
— **before** the combining.

> 🔑 In `13` we took the selector off the output and moved it to the input. Same
> move here: **move the NOT to the input.**

An `inv` on each part's output, then both into `and`. Walk the three rows again —
this time it holds. Three parts: `inv`, `inv`, `and`.

### But you can do the same job with two parts

Phrase the condition as a single sentence instead of two separate negations:

> *"X is neither zero nor negative."*

How many "not"s are in that sentence? One — and that one negates **the whole
thing.**

So, two questions:

**①** "X is zero **or** negative" — which gate is that as a circuit?
**②** What do you do to that gate's output to get "neither zero nor negative"?

```
is zero  ─┐
          ├─ or ──► "X is zero OR negative"  (X ≤ 0)  ──► inv ──► X > 0
is neg   ─┘
```

Two parts, not three.

This is not a saving trick, it is a **rule**. Its name is **De Morgan** and you
saw it back in `02`:

```
(NOT A) AND (NOT B)   ≡   NOT (A OR B)
```

They are the same circuit. Which one you build depends on the parts in your hand
— but **knowing they are the same** is mandatory. Because when you read code you
will meet both `!a && !b` and `!(a || b)`, and if you cannot see that they are
the same, you will think the same logic is two different things.

> ⚠️ Note the trap too: `!(a || b)` and `!a || !b` are **not the same.** In De
> Morgan the gate changes as well — `and` ↔ `or`. Distributing the "not"s while
> leaving the gate alone is one of the quietest logic bugs in software.
> Its catalogue entry: [CWE-480](https://cwe.mitre.org/data/definitions/480.html)
> *(English page on the way)* — use of an incorrect operator.

---

## Why xor Works and Why You Should Not Write It

There is a nice trap here, and it hides in language.

While thinking about "X is neither zero nor negative", this might come to mind:
*"we need something that says at least one arrived, but not both."*

The first half is right — "at least one" = `or`. The second half is not a
condition at all; it is **impossible**. A number cannot be zero and negative at
the same time. So "not both" is not a rule you have to impose, it is a **fact**
about the nature of `X`.

But "at least one but not both" also has a name: `xor`. And that is in the
toolbox too. Try it — it **works**:

| X | `is zero` | `is neg` | `or` | `xor` |
|---|---|---|---|---|
| `X > 0` | `0` | `0` | `0` | `0` |
| `X = 0` | `1` | `0` | `1` | `1` |
| `X < 0` | `0` | `1` | `1` | `1` |

The two columns are identical. Because `or` and `xor` only diverge when **both
inputs are 1** — and that row never occurs in this circuit.

> 🔑 Here `xor` gives **the right answer for the wrong reason.** If you mean "at
> least one", write `or`. It is not enough for a circuit to work correctly; it
> has to **state its intent.**

This is a pattern you will see often: a circuit, or a piece of code, works
because of an **assumption** standing behind it. While the assumption holds, no
one notices. If the assumption ever breaks — say these two signals start being
fed from somewhere else — the `or` version stays the same and the `xor` version
quietly starts doing something different.

The bug is not born on that day. The bug is born on the day `xor` was written; it
merely surfaces years later.

---

## The Trap: Right Part, Wrong Wire

You place `is zero` and `is neg`, you build the `or` and the `inv`, and the
structure is right. But somewhere along the way this can happen: the inputs of
those two parts get wired to the `eq` and `gt` flags instead of to `X`.

On the surface everything looks fine. The circuit runs, the screen shows a value,
it even outputs `1`.

But the job of those two parts is **to examine `X`**. They are asking "is the
number zero", "is the number negative". Hand them a flag and they will examine
*the permissions* — not *the number*.

### The wire was telling you

Next to the input leg of `is zero` there is a small **`16`**. Same on `is neg`.
Those legs expect 16 bits. `eq` and `gt` are **1 bit**.

### But NandGame did not object

It accepted the connection. Why? Because it silently **widened** the 1-bit `1`
into the 16-bit `0000000000000001`.

As a number it is not wrong. As **meaning it is completely wrong** — the circuit
asked "is the eq flag zero" when it should have asked "is X zero".

> 🔑 The question opened by the bundler section in `13` was exactly this: *what
> happens when you put a narrow value into a wide place?* Here it happened. The
> widening was silent, no error appeared, and the number looked perfectly valid.
> The only way to catch it is **to look at what you wired.**
>
> 👾 The software counterpart of that silence:
> [CWE-194](https://cwe.mitre.org/data/definitions/194.html) (sign extension) and
> [CWE-197](https://cwe.mitre.org/data/definitions/197.html) (truncation)
> *(English pages on the way)*. What they share is this: the conversion
> **succeeds.** No warning, no exception, and the result is a valid number. What
> is wrong is not the number but its **meaning.**

---

## AND as a Valve

Now the real work. You have three detections in hand, and they are **about X**.
Exactly one of them is `1` at any moment:

```
is neg        →  X < 0
is zero       →  X = 0
or + inv      →  X > 0
```

Facing them are three permissions, and those are **not about X** — they are about
what you accept:

```
lt · eq · gt
```

The pairing is obvious:

| permission | which detection it releases |
|---|---|
| `lt` | `X < 0` |
| `eq` | `X = 0` |
| `gt` | `X > 0` |

Take a single pair — `lt` with `X < 0`. For the output to be `1`, **both** have
to be true: the permission must be granted **and** the number must actually be
negative.

The gate that builds that sentence is `and`. But here `and`'s job is not
arithmetic:

```
permission = 0   →   and lets nothing through, that branch is dead
permission = 1   →   and passes the detection straight on
```

A **valve**. Open and it flows, closed and it holds. It decides nothing by
itself.

> 🔑 In `11` you built the selector and it **asked**: "which one shall I hand
> over?" A valve asks nothing. It is unaware of its neighbours; it looks only at
> its own permission.
>
> A selector is a central decision — one place, knowing everything. A valve is a
> distributed decision: three separate places, three separate permissions, none
> aware of the others.

That is why there is no selector in the toolbox. This level was designed to teach
the **alternative** to the selector.

---

## Combining Three Things with Two-Legged Gates

Once the three branches are built you will have three results:

```
and(lt, X<0)   ·   and(eq, X=0)   ·   and(gt, X>0)
```

If **any one** of them is `1`, the output is `1`. They do not all have to hold —
they cannot anyway; if `X < 0` then the other two are false.

The gate is clear: `or`. The only obstacle is that the toolbox `or` has **two**
legs and you have three things.

You answered this in `06`. The same problem came up while adding three bits, and
the solution was **chaining**: combine two, then combine the result with the
third.

```
and(lt,·) ─┐
           ├─ or ─┐
and(eq,·) ─┘      ├─ or ──► output
and(gt,·) ────────┘
```

Two `or`s, three inputs. The same trick works for four, five or twenty inputs —
each new input adds one gate.

---

## 🎮 Now You Build It

Parts list: **1 × `is zero`**, **1 × `is neg`**, **1 × `inv`**, **3 × `and`**,
**3 × `or`**. Nine parts in total.

In order:

1. Place `is zero` and `is neg`, and wire **both of their inputs to `X`**.
2. Manufacture the `X > 0` part: both outputs into an `or`, the `or`'s output
   into an `inv`. Test it: `X=5` → `1`, `X=0` → `0`, `X=−3` → `0`.
3. Build the three valves: `and(lt, is neg)`, `and(eq, is zero)`,
   `and(gt, the inv's output)`.
4. Chain the three valves with two `or`s and wire the result to `Output`.

### Do not forget fan-out

Do not place `is zero` and `is neg` **twice**. Each of their outputs goes to two
places at once:

```
              ┌──►  or   (for the X > 0 computation)
is neg(X) ────┤
              └──►  and  (for the lt branch)
```

The fan-out you learned in `11`. One output feeds as many inputs as you like.
Build a second copy and the circuit still works, but the budget swells — the
target here is 50 nands and these two parts are not cheap.

### How to choose the test

Two extreme rows exercise the entire circuit:

| `lt` `eq` `gt` | `X` | expected |
|---|---|---|
| `0` `0` `0` | `5`, `0`, `−3` | always **`0`** (Never) |
| `1` `1` `1` | `5`, `0`, `−3` | always **`1`** (Always) |

If those two hold, the six rows in between hold as well — because those six are
made of parts of these two. `Never` proves all the valves close, `Always` proves
they all open.

<details>
<summary>🔑 If you are stuck — the connection list</summary>

```
is zero:  input ← X
is neg:   input ← X

or1:  a ← is zero    b ← is neg          (X ≤ 0)
inv:  input ← or1                        (X > 0)

and1: a ← lt   b ← is neg
and2: a ← eq   b ← is zero
and3: a ← gt   b ← inv

or2:  a ← and1  b ← and2
or3:  a ← or2   b ← and3   →  Output
```

The outputs of `is zero` and `is neg` go to **two places each**: to `or1` and to
their own valve.

</details>

---

## You Never Built the Table

The circuit is finished. Now go back and look at what you did.

The documentation had eight rows: `Never`, `X>0`, `X=0`, `X≥0`, `X<0`, `X≠0`,
`X≤0`, `Always`.

**You wrote none of them into the circuit.**

You built three valves and combined their outputs. The eight rows appeared by
themselves:

```
000  →  all three valves closed      →  nothing passes           =  Never
111  →  all three valves open        →  whichever is true passes =  Always
011  →  eq and gt open, lt closed    →  X = 0 or X > 0           =  X ≥ 0
```

You did not build a gate called `≥`. You opened two valves and `≥` was **born**
there.

This is called **emergent behaviour**: behaviour written nowhere in the parts, but
appearing once they come together. The eight-row table sits nowhere in the
circuit; it is the circuit's **consequence**.

> 🔑 This is the other face of what we discussed in `14`. There the control word
> was 5 bits, the documentation described 8 rows, and the gap between them stood
> as **undocumented behaviour**. Here all eight states are documented — but none
> of them is written in the circuit.
>
> Two faces of the same fact: **what a circuit can do is not the same thing as
> what has been described.** Sometimes you describe less; sometimes you describe
> nothing at all. The circuit does it anyway.

Reverse engineering lives exactly in that gap. Look at the circuit, not the
documentation.

---

## The Debt That Closes: OF

Back in `10`, while building the flags, a promise was made: the overflow flag
(OF) would be explained later. The debt closes here.

In the circuit you built, `is neg` looks at one thing: the number's **sign bit**,
the leftmost bit of the 16-bit value. `1` means negative, `0` means not.

That works correctly if `X` is a value in its own right. But what if `X` came out
of a **subtraction** — and that subtraction **overflowed**?

### The sign bit can lie

For readability let's look at 4 bits (range: `−8` … `+7`):

```
  5 − (−4)  =  9        the true result, positive

  in 4 bits: 0101 − 1100
           = 0101 + 0100      (subtraction = adding the negation)
           = 1001

  1001  →  sign bit is 1  →  "negative"
  1001  →  read as two's complement  →  −7
```

The true result is `+9`, the circuit's result is `−7`. `9` does not fit in the
4-bit range; an **overflow** occurred. And because it overflowed, the sign bit is
not telling the truth.

Now think about what that means. If you compute `a − b` and decide "is a less
than b" by looking at the sign bit, then the moment an overflow happens you get
**the opposite** of the right answer.

Even though `5 > −4`, the circuit says "less".

### The correct form: N XOR OF

This is why real processors use two flags together:

```
signed "less than"  =  N XOR OF

N  = the result's sign bit (does it look negative)
OF = did an overflow occur (is the sign bit lying)
```

With no overflow (`OF = 0`) the answer is just `N`. With an overflow (`OF = 1`)
`N` gets flipped — because we know it is lying.

In the `5 − (−4)` example: `N = 1` (it looks negative), `OF = 1` (it overflowed),
`1 XOR 1 = 0` → "not less" → **the right answer.**

This is why x86 has two separate instruction families:

| instruction | flag it uses | when |
|---|---|---|
| `jl` / `jge` | `SF ≠ OF` | **signed** comparison |
| `jb` / `jae` | `CF` | **unsigned** comparison |

The same two numbers, the same subtraction, **two different right answers** —
which one you want depends on how you read the numbers. The sentence from `04`
and from [CWE-681](../cwe/cwe_681.md) applies here too: the pattern is the same,
the meaning is the reader's decision.

> ⚠️ In this NandGame level there is no OF, because `X` is compared directly
> against zero — with no subtraction step in between, the sign bit is always
> right. But in a real processor `cmp` is a subtraction and it can overflow. That
> is why "look at the sign bit" on its own is an **incomplete comparison**:
> [CWE-1023](https://cwe.mitre.org/data/definitions/1023.html)
> *(English page on the way)*.

### Next up

**SR Latch** opens the **Memory** section. Every circuit you have built so far
answered its input instantly; when the input changed, the output changed, and
there was no memory. Next comes the opposite: **feeding an output back into
itself** and making a circuit *remember* something.

---

## Summary — Keep in Mind

```
☐ lt / eq / gt = less than · equal · greater than. The first character of lt is a lowercase L.
☐ These three bits are NOT A NUMBER. They do not say "which comparison", they say "which outcomes count as success".
☐ A comparison has exactly three outcomes: less · equal · greater. There is no fourth (trichotomy).
☐ 8 rows = the subsets of three outcomes (2³). Never = the empty set, Always = all of them.
☐ You do not build a gate called ≥: you open the eq and gt permissions together and ≥ is born there.
☐ Everything is relative to zero because A COMPARISON IS A SUBTRACTION: a ? b → X = a − b → where X sits vs zero.
☐ On x86, cmp a,b does exactly a−b and THROWS THE RESULT AWAY, keeping only the flags.
☐ There is no "is pos" in the toolbox: NOT negative and NOT zero → positive. The three outcomes exclude each other.
☐ ⚠️ The logic can be right while the wiring is wrong. Feed is zero and is neg into an and and the output is 0 FOREVER.
☐ The reason: two mutually exclusive things are never 1 at once. and can never combine them.
☐ The "not"s sit INSIDE the parentheses in the sentence → so inv comes BEFORE the combining. Move the NOT to the input.
☐ De Morgan: (NOT A) AND (NOT B) ≡ NOT (A OR B). inv+inv+and = or+inv. Two parts instead of three.
☐ ⚠️ !(a || b) and !a || !b are NOT the same — in De Morgan the gate changes too (and ↔ or).
☐ Here xor gives the same result as or, because the "both are 1" row never occurs.
☐ 🔑 But xor gives THE RIGHT ANSWER FOR THE WRONG REASON. Working is not enough; a circuit must state its INTENT.
☐ A circuit resting on an assumption quietly does something else the day the assumption breaks. The bug is born when it is written.
☐ ⚠️ is zero / is neg inputs go to X. Wire them to a flag and NandGame does NOT object — it silently widens 1 bit to 16.
☐ 👾 The number is valid, the meaning is wrong. Software counterparts CWE-194 / CWE-197: the conversion SUCCEEDS, no warning.
☐ Here and does no arithmetic, it is a VALVE: permission 0 means the branch is dead, permission 1 passes the detection straight on.
☐ 🔑 A selector ASKS ("which shall I hand over"), a valve does not. Selector = central decision, valve = distributed decision.
☐ Combining three things with two-legged gates = chaining (the trick from 06). Each new input adds one gate.
☐ Fan-out: the outputs of is zero and is neg go to TWO places each. Do not build a second copy, the budget swells.
☐ Testing: the 000 (Never) and 111 (Always) rows exercise the whole circuit — the six in between are made of their parts.
☐ 🔑 You NEVER BUILT the eight-row table. You built three valves and the eight rows emerged by themselves.
☐ What a circuit can do is not the same as what has been described. Look at the circuit, not the documentation.
☐ The OF debt: is neg looks at the sign bit. If X came from a subtraction that OVERFLOWED, the sign bit LIES.
☐ In 4 bits 5 − (−4) = 9 does not fit → 1001 → it looks like "−7". The true result is positive, the sign bit says negative.
☐ 🔑 Signed "less than" = N XOR OF. Without overflow it is N itself; with overflow it is the opposite of N.
☐ x86: jl/jge are signed (SF≠OF), jb/jae are unsigned (CF). The same subtraction, two different right answers.
☐ 👾 Looking at the sign bit alone is an INCOMPLETE comparison: CWE-1023.
```

---

## 🔗 Related Topics

- 👾 **This lesson's pillar:** [CWE-697 — Incorrect Comparison](https://cwe.mitre.org/data/definitions/697.html) *(English page on the way)* — comparison's own top tier; the sibling of 682
- 👾 **The opposite of atomic:** [CWE-1254 — Comparison logic granularity](https://cwe.mitre.org/data/definitions/1254.html) *(English page on the way)* — `is zero` looks at all sixteen bits at once; a circuit that looks piece by piece leaks timing
- 👾 **Silent widening:** [CWE-194 — Sign extension](https://cwe.mitre.org/data/definitions/194.html) and [CWE-197 — Truncation](https://cwe.mitre.org/data/definitions/197.html) *(English pages on the way)* — what happens when a 1-bit flag meets a 16-bit leg
- 👾 **Incomplete comparison:** [CWE-1023](https://cwe.mitre.org/data/definitions/1023.html) *(English page on the way)* — looking at half the flags; a signed comparison without OF
- 👾 **Incorrect operator:** [CWE-480](https://cwe.mitre.org/data/definitions/480.html) *(English page on the way)* — half-applying De Morgan, mixing `&&` with `||`
- 👾 **Meaning is in the reader:** [CWE-681](../cwe/cwe_681.md) — the same bit pattern read as signed or unsigned
- 👾 **Overflow itself:** [CWE-190](../cwe/cwe_190.md) · [CWE-191](../cwe/cwe_191.md) — where OF is born
- [14_alu.md](./14_alu.md) — The part that produces the result this circuit reads
- [11_selector_switch.md](./11_selector_switch.md) — The selector and fan-out; this lesson's opposite pole
- [10_bayraklar.md](./10_bayraklar.md) — Where the flags are built; the lesson that promised OF
- [09_subtraction.md](./09_subtraction.md) — The subtraction underneath every comparison
- [06_full_adder.md](./06_full_adder.md) — The chaining trick
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — De Morgan and the basic gates
- [../x86_assembly/10_bayraklar_ve_cmp.md](../x86_assembly/10_bayraklar_ve_cmp.md) — `cmp` and the flags, software side
- [../x86_assembly/11_ziplamalar.md](../x86_assembly/11_ziplamalar.md) — `jl` / `jge` / `jb` / `jae`: this circuit's instruction counterparts

---

**Previous topic:** [14_alu.md](./14_alu.md)
**Next topic:** *(on the way — SR Latch)*

*This lesson is part of the "From Switches to a Computer" series. The series moves along together with [nandgame.com](https://nandgame.com).*
