# 🔗 From Switches to a Computer — Flags: How a Machine Says "If"

> Everything you've built in this series so far **computed**: it added, incremented,
> subtracted. All of it took numbers and gave back numbers.
>
> The two circuits you'll build in this lesson don't produce a number. They **ask a
> question** and give a one-bit answer: yes or no. A processor's ability to say `if` starts
> exactly here.

> We take the two levels together because both produce the same thing: a **flag.** One
> reports zero-ness, the other negativeness. This is the kind of wire a processor says
> "if" with: on x86, an `if` or a `while` you write usually turns into a jump that
> looks at these flags.

---

## 📋 Table of Contents

- [From Computing to Deciding](#from-computing-to-deciding)
- [Flip the "All Zero" Question Around](#flip-the-all-zero-question-around)
- [Tree or Chain?](#tree-or-chain)
- [The Zero Flag (ZF)](#the-zero-flag-zf)
- [Sign: You Don't Even Need a Circuit](#sign-you-dont-even-need-a-circuit)
- [Why Is the Sign Bit Number 15?](#why-is-the-sign-bit-number-15)
- [The Whole of Comparison](#the-whole-of-comparison)
- [🎮 Now You Build It](#-now-you-build-it)
- [Closing: You Built the Flags Yourself](#closing-you-built-the-flags-yourself)

---

## From Computing to Deciding

See the difference between a computing circuit and a **detector**:

| | its input | its output | what it does |
|---|---|---|---|
| adder | two numbers | one number | **computes** |
| detector | one number | **a single bit** | **decides** |

A detector's output is called a **flag**: raised means a condition holds, lowered means it
doesn't.

Your first task is this: 4 bits go in, one bit comes out.

```
   all 0            →  output 1
   anything else    →  output 0
```

**Only one** of the 16 possibilities gives a 1. So the circuit is looking for a single
pattern.

---

## Flip the "All Zero" Question Around

The first reflex is to go looking for an "are they all 0?" gate. There is no such gate —
what you have works in pairs, and knows nothing about "all four at once".

So flip the question:

```
"every bit is 0"     ⟺     "no bit is 1"
```

The two sentences say the same thing. But hidden inside the second one is a question you
*can* build:

> 🔑 **"Is at least one bit a 1?"** — the gate that answers this question is called **OR.**

And once you have the answer you want the exact opposite of it, because "at least one is 1"
and "none is 1" are each other's negation. So you put an `inv` on the end.

> 💡 The combination `OR` + `inv` is already a gate of its own: **NOR.** You just built a
> 4-input NOR. One more member of the family you met in lesson 02 while deriving gates from
> NAND.

**This is the general pattern:** if a question is hard to build directly, build its
**opposite** and invert the result. It's the single most useful trick in circuit design.

---

## Tree or Chain?

OR takes two inputs and you have four bits. Three ORs are needed — but **how will you arrange
them?** There are two valid shapes and both give the right answer:

```
        TREE                          CHAIN

   b3 b2   b1 b0                 b3 b2
    └OR┘    └OR┘                  └OR┘ b1
      └──OR──┘                      └OR┘ b0
         │                             └OR┘
        inv                              │
                                        inv

  3 gates deep                  4 gates deep
```

The result is the same. The difference is in how many gates the signal passes through.

Every gate has a small delay (when an input changes, the output takes time to settle) and
those delays **stack up.** At four bits the difference is negligible. But:

| bit count | tree depth | chain depth |
|:-:|:-:|:-:|
| 4 | 3 | 4 |
| 16 | 5 | 16 |
| 64 | 7 | 64 |

The tree grows **logarithmically**, the chain **linearly.** In real processors this choice
directly determines the clock speed.

> ⚠️ Don't confuse this with the ripple-carry from lesson 07. That chain had a real reason:
> every digit **depended** on its right neighbour's carry. (Even that dependency doesn't
> make the chain the only way; the carry-lookahead at the end of 07 computes the carry in
> advance. But the dependency is real.) Here there's no such dependency — all the bits are
> ready at the same time, none of them waits for another.
>
> 🔑 **A chain born of a real dependency and a chain built out of habit are different
> things.** If you see a
> sequence in a circuit, ask: is this really a dependency, or was it just laid out that way?

---

## The Zero Flag (ZF)

The wire you built has a real name: the **zero flag**, `ZF` for short.

On x86 the `jz` / `jnz` instructions (jump if zero / not zero) look at exactly this bit.
Every `if (x == 0)` you've ever written passes through this wire.

And the best part surfaces when you combine it with lesson 09:

> 🔑 **Equality doesn't need a separate circuit.** The machine can answer the question
> `a == b` like this: compute `a − b`, then ask **is the result zero?** x86's compare
> instruction `cmp` does exactly this.
>
> If it is, ZF = 1: equal. If it isn't (whether it's 1 or 1000), ZF = 0: not equal.
> ZF doesn't say which one is bigger; the sign bit will tell you that in a moment.
>
> (A separate equality circuit can be built too: compare the two numbers bit by bit with
> XOR and check whether the result is zero. The difference detector from
> [03](./03_xor_iki_fedai.md), 16 times over.)

Subtractor + zero detector = comparison. The product of two lessons.

---

## Sign: You Don't Even Need a Circuit

The second task: *"is this 16-bit number negative?"*

Don't go looking for a gate. The answer is already sitting there waiting.

In lesson 09 you saw that `−1` is `65535` and `−2` is `65534`. Keep going by the same rule
and the patterns split exactly down the middle: the half whose leftmost bit is 0 (0–32767)
is zero and the positives, the half whose leftmost bit is 1 (32768–65535) the negatives.
Whether a number is negative is determined **by looking at the leftmost bit.**

So the entire level is a single wire: open up the 16-bundle and connect **bit 15** to the
output.

> 💡 This is the power of a good representation. With a separate "sign digit" plus a
> magnitude, the sign would also sit on the leftmost wire, but with a trap: there would be a
> second zero, `−0`, and a test that looks at one wire would call it "negative". Two's
> complement has a single zero; the job is buried **inside the representation**, and what's
> left is a single wire.
>
> Good design takes work away from the circuit and dumps it on the representation.

---

## Why Is the Sign Bit Number 15?

First the numbering: bits are counted **right to left**, the rightmost one is `bit 0`.

```
  bit:      15    14    13   ...    2     1     0
value:   32768 16384  8192   ...    4     2     1
```

Look familiar — this is the token table from lesson 04. `bit n` = a `2ⁿ` token. `bit 15` is
the **leftmost** and most expensive token in the bundle.

Now why it's the one that announces the sign:

| pattern | bit 15 | signed value |
|---|:-:|---:|
| `0000000000000000` | 0 | 0 |
| `0111111111111111` | 0 | **+32767** ← the largest positive |
| `1000000000000000` | 1 | **−32768** ← the smallest negative |
| `1111111111111111` | 1 | −1 |

Exactly **half** of the 65536 patterns (bit 15 = 0) are zero and the positives; the other
**half** (bit 15 = 1) are the negatives.

> 🔑 In two's complement the sign bit isn't a bit picked out separately. Counting upward from 0,
> bit 15 stays off; go one step below 0 and it turns on instantly. **The sign bit is where
> the wrapping boundary passes** — not a label attached afterwards.

This wire has a name too: the **sign flag (SF).**

---

## The Whole of Comparison

Combine the two flags with the subtractor:

```
a == b   →   do a − b,  look at ZF
a <  b   →   do a − b,  look at SF
a >  b   →   do a − b,  look at both: ZF = 0 and SF = 0
```

The third line has no flag of its own: not equal and not less means greater.

On x86 this is exactly these two lines:

```asm
cmp  eax, ebx      ; do eax − ebx, DON'T store the result but set the flags
je   if_equal      ; jump if ZF = 1
```

`cmp` is a `sub` that writes its result nowhere. Its only job is to set the flags.

> ⚠️ **A warning for full correctness:** in the `a < b` test, looking only at SF is not
> always enough, because **the subtraction itself can overflow.** Example: `a = −32768`,
> `b = 1`. The true result is `−32769`, which doesn't fit in 16 bits, so it wraps to
> `+32767` — sign bit 0. A circuit that looks at SF says "a isn't smaller", when it is.
>
> This is why real processors keep one more flag, the **overflow flag (OF)**, and in signed
> comparison they check the condition `SF ≠ OF`. You're laying the foundation in this
> lesson.
>
> One more thing: this table reads the numbers as **signed**. Read them as unsigned,
> as in 04–08 (0–65535), and the sign bit misleads: `40000 − 1 = 39999`, its top bit
> is 1, yet 40000 is not smaller than 1. The table is not actually wrong; it answers
> the question for signed numbers: read as signed, the pattern of 40000 means
> `−25536`, which really is smaller than 1. The sentence from [09](./09_subtraction.md)
> holds here too: the pattern is the same, the meaning is the reader's decision.

---

## 🎮 Now You Build It

**Two levels:**

**1. Equal to Zero** — 4 bits go in; give 1 if they're all 0.

<details>
<summary>🔒 Solution schematic — try it yourself first, then open</summary>

1. `OR₁`: inputs `b3`, `b2`
2. `OR₂`: inputs `b1`, `b0`
3. `OR₃`: inputs are `OR₁`'s and `OR₂`'s outputs → *"at least one is 1"*
4. `inv`: invert `OR₃`'s output → **the output**

Arrange it as a tree, not a chain — same result, one gate shallower.

</details>

**2. Less than Zero** — 16 bits go in; give 1 if it's negative.

<details>
<summary>🔒 Solution schematic — try it yourself first, then open</summary>

1. Wire the input to the **16-bit splitter**.
2. Connect the **`bit 15`** pin straight to the output.

That's all. No gates. The difficulty isn't in the circuit, it's in **knowing why it's bit
15.**

</details>

---

## Closing: You Built the Flags Yourself

Seen from software, the flags are things **handed to you**: mysterious bits sitting
somewhere in the processor that instructions set. Today you built them **yourself.** ZF is
the output of three ORs and an inv. SF is a single wire pulled out of a bundle. Every `jz`
in assembly that asks "is the result zero?" looks at the circuit you built today.

What's left in the gap? Gathering all these operations into a single box and letting
something outside choose "which one to do" — that is, the **ALU.** For that, the circuit
first has to be able to **choose;** that's exactly the next lesson's subject.

---

## Summary — Keep in Mind

```
☐ A flag = a one-bit answer. A computing circuit gives a number, a detector DECIDES.
☐ Turn a hard-to-build question into its OPPOSITE and flip the result with inv. (best trick)
☐ "all 0" ⟺ "none is 1" → an OR tree + inv = NOR = ZF
☐ Tree depth is logarithmic, chain depth linear. At 64 bits it's 7 versus 64.
☐ A chain born of a real dependency (ripple-carry) and a chain built out of habit are not the same thing.
☐ Equality NEEDS no separate circuit: do a − b and look at ZF (x86's cmp does this). A separate one can be built too: XORs + a zero detector.
☐ The negativity test is one wire: bit 15. No gate needed.
☐ The sign bit wasn't added afterwards — it's where the wrapping boundary passes.
☐ Good design takes work off the circuit and puts it on the REPRESENTATION (two's complement).
☐ SF alone isn't enough for a < b; if the subtraction overflows it misleads → you need OF.
☐ The table reads the numbers as signed. Read them as unsigned and the sign bit misleads: the top bit of 40000 − 1 is 1, yet 40000 is not smaller.
```

---

## 🔗 Related Topics

- 👾 **For the curious:** the bits you hand the comparator can be wrong too — sign conversion [CWE-196](../cwe/cwe_196.md), [CWE-195](../cwe/cwe_195.md)
- [09_subtraction.md](./09_subtraction.md) — The circuit that produces the result the flags look at
- [02_nanddan_kapilar.md](./02_nanddan_kapilar.md) — The tree's gates: NOT, AND, OR
- [04_teller_sayi_olunca.md](./04_teller_sayi_olunca.md) — Token values: 1, 2, 4, 8 …

---

**Previous topic:** [09_subtraction.md](./09_subtraction.md)
**Next topic:** [11_selector_switch.md](./11_selector_switch.md) — The circuit's first decision

*This lesson is part of the "From Switches to a Computer" series. The series moves along together with [nandgame.com](https://nandgame.com).*
