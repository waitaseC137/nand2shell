# 🔢 From Switches to a Computer — When Wires Become Numbers

> Up to now, wires have carried "yes/no" for you: current, a decision, the go-ahead from
> the ones that do the dirty work. In this lesson we'll give wires a brand-new meaning:
> **number.** This is the biggest mental leap in the series — and not a circuit lesson but
> a concept lesson. If you lay this groundwork solidly, the adder lessons will
> flow like water.

> **No circuit in this lesson, no game.** Just one idea. But the whole of Unit 1 rests on
> this idea: don't rush, read it twice if you need to.

---

## 📋 Table of Contents

- [The Limit of a Single Wire](#the-limit-of-a-single-wire)
- [The Remedy: Adding Wires and Assigning Values](#the-remedy-adding-wires-and-assigning-values)
- [The Token System](#the-token-system)
- [This Is a Trick You Already Know](#this-is-a-trick-you-already-know)
- [Counting in Binary](#counting-in-binary)
- [How Many Wires, How Many Numbers?](#how-many-wires-how-many-numbers)
- [The Reading Formula](#the-reading-formula)

---

## The Limit of a Single Wire

Recall the basic truth from lesson 01: **a wire knows no meaning.** On a wire we tell
apart two states, on and off. We named those two states "1" and "0" — that was the first
meaning we assigned.

Now a new need arises: in a moment our circuits will **count** (they'll answer the
question "how many?"). But the biggest thing a single wire can say is "1". There's no
third state called "2" on a wire: in [01.5](./01.5_yasak_bolge.md) we decided that a wire
has two states. So how does a circuit say 2, 3, or 500?

> 🔑 The answer isn't inside the wire, it's in the **number of wires:** for bigger numbers
> you add wires — and you **assign each wire a different value.** A number doesn't live on
> a single wire, it lives in how a **group** of wires is read.

---

## The Remedy: Adding Wires and Assigning Values

Take two wires. Call the left one the "**2's wire**" and the right one the "**1's wire**".
Our rule:

> The number the group says = **the sum of the values of the wires that are on.**

With two wires you can build four different states — and the four say four separate numbers:

| 2's wire | 1's wire | Number said |
|:---:|:---:|:---:|
| 0 | 0 | 0 + 0 = **0** |
| 0 | 1 | 0 + 1 = **1** |
| 1 | 0 | 2 + 0 = **2** |
| 1 | 1 | 2 + 1 = **3** |

That's all there is to it. The whole of the thing that wanders around under scary book
titles like "the binary number system" is this table: **assign values to wires, sum the
ones that are on.**

---

## The Token System

To make the same idea tangible, think in tokens. You have two kinds of token in your hand:
**2's** and **1's.** You say any amount by "which tokens you handed over":

```
   pay 0  →  no token            →  wires: 0 0
   pay 1  →  one 1's             →  wires: 0 1
   pay 2  →  one 2's             →  wires: 1 0
   pay 3  →  one 2's + 1's       →  wires: 1 1
```

> 💡 Note: you can use **at most one** of each kind of token — because a wire either turns
> on or it doesn't; there's no "turning on twice." Since you don't have the option of
> handing over two 1's when you "pay 2," the 2's token is **mandatory.** This mandate is
> why the values go 1, 2 (and, in a moment, 4, 8...): so that every amount can be paid,
> using at most one of each token, **with no gaps** and in **exactly one way.** That's why
> the new token is exactly one more than the sum of the ones you have: after 1 and 2 comes
> 1 + 2 + 1 = 4, then 1 + 2 + 4 + 1 = 8. Any smaller and some amount could be paid two
> ways; any larger and some amount in between couldn't be paid at all.

---

## This Is a Trick You Already Know

Don't let "assigning values to digits" feel new to you — **you've been doing it since
grade school.** When you write "347" in the decimal system, what you're really saying is:

```
   3       4       7
   ↓       ↓       ↓
 100's    10's    1's     →   3×100 + 4×10 + 7×1 = 347
```

In the decimal system the place values go 1, 10, 100, 1000... (each one **10 times** the
previous, because you can write **ten** different digits, 0–9, in each place).

In our wires, though, there are only **two** things that can be written in a place: 0 and 1.
So the place values go 1, 2, 4, 8... — each one **2 times** the previous.

> 🔑 So "the binary system" isn't a separate kind of math; it's **the same place-value idea,
> in its two-digit form.** Just as "10" in decimal is "one ten, zero ones," in binary `10`
> means "one 2's, zero 1's" — that is, **2.** See? There was nothing to be afraid of.

---

## Counting in Binary

With three wires (4's, 2's, 1's) let's count from 0 to 7 — out loud, in token language:

| Number | 4's | 2's | 1's | In token language |
|:---:|:---:|:---:|:---:|---|
| 0 | 0 | 0 | 0 | no tokens at all |
| 1 | 0 | 0 | 1 | 1's |
| 2 | 0 | 1 | 0 | 2's |
| 3 | 0 | 1 | 1 | 2's + 1's |
| 4 | 1 | 0 | 0 | 4's |
| 5 | 1 | 0 | 1 | 4's + 1's |
| 6 | 1 | 1 | 0 | 4's + 2's |
| 7 | 1 | 1 | 1 | all of them |

See a pattern in the table: the **1's column** ticks 0-1-0-1; the **2's column** goes in
twos; the **4's** in fours. Like the digits on an odometer — when the right one fills up,
the left one goes up by one. Same logic, except "filling up" happens at 1 instead of 9.

---

## How Many Wires, How Many Numbers?

Look at the table one more time with this in mind: **with three wires you could count up to
7 at most.** For anything larger you have to add a fourth wire.

Every new wire **doubles** the number of patterns you can build:

| wire count | how many distinct patterns | the range you can count |
|:-:|:-:|:-:|
| 1 | 2 | 0 – 1 |
| 2 | 4 | 0 – 3 |
| 3 | 8 | 0 – 7 |
| 4 | 16 | 0 – 15 |
| 8 | 256 | 0 – 255 |
| **16** | **65536** | **0 – 65535** |

> 🔑 The formula: **`n` wires build `2ⁿ` distinct patterns**, and the largest number is
> **`2ⁿ − 1`.** One less, because one of the patterns is spent on zero.

> 📌 The 0 or 1 that a single wire carries is called a **bit** (*binary digit*). 16
> wires = 16 bits.

Keep that last row in mind. The number `65535` will keep turning up insistently in later
lessons — because NandGame's computer works with **16-bit** bundles, and that is the
largest value a bundle **can hold.** (Today's computers mostly work with 64-bit bundles;
same idea, bigger number.)

> 💡 So what happens if you add one to 65535? Whatever an odometer does after 999999: it
> **wraps around.** For now just note it down: **the digits run out, the counter turns
> over.**

---

## The Reading Formula

Let's squeeze everything into a single line. Let the three wires, left to right, be named
`x h l` (4's, 2's, 1's):

> **number said = 4·x + 2·h + 1·l**

This formula is the key to the next two lessons. When our circuits hand you two wires called
`h l`, you won't panic; you'll just read "2·h + l" and move on.

> 💡 **You might be wondering:** *"So why doesn't a computer use decimal? People count in
> decimal, after all."* The answer from [01.5](./01.5_yasak_bolge.md): the voltage on a wire
> is a dial, and we decide how many states to count. If we wanted decimal, we'd have to
> reliably tell apart ten different voltage levels on every wire; squeeze ten bands into
> the same range and every band's noise margin shrinks. Two levels give the widest margin.
> Binary isn't a law of nature, it's **the sturdiest choice against noise.**

---

## Summary — Keep in Mind

```
☐ A single wire says "1" at most. A bigger number = ADD A WIRE + ASSIGN each wire a VALUE.
☐ Number = the sum of the values of the wires that are on. (Token analogy: which tokens did you hand over?)
☐ At most ONE of each token, no gaps → the values must be 1, 2, 4, 8... (powers of two).
☐ The binary system = the place-value idea from school, with two digits. `10` (binary) = "one 2's" = 2.
☐ Reading formula: number = 4x + 2h + 1l. This line is the key to two lessons.
☐ n wires → 2ⁿ patterns → the range 0 … 2ⁿ−1. Each new wire DOUBLES the number of patterns.
☐ Bit = the 0 or 1 a single wire carries. 16 wires = 16 bits.
☐ 16 bits → 0 … 65535. Add one to 65535 and the counter wraps to the start.
☐ Binary is a choice: two levels give the widest margin against noise (01.5).
```

---

## 🔗 Related Topics

- 👾 **For the curious:** [CWE-1261 — Single event upset](../cwe/cwe_1261.md) — one bit flipping: Belgium's 4096 votes, Mario's teleport
- 👾 **For the curious:** [CWE-681 — Incorrect numeric conversion](../cwe/cwe_681.md) — the same `n` wires read as another type: data is lost or the meaning changes in the conversion
- 👾 **For the curious:** [CWE-704 — Incorrect type conversion](../cwe/cwe_704.md) — wires claim nothing; a type is a contract about how to read the pattern
- 👾 **For the curious:** [CWE-1384 — Physical conditions](../cwe/cwe_1384.md) — the parent of 1261: when the physical world leaves the range the circuit assumes
- [01_akim_salter_role.md](./01_akim_salter_role.md) — Where the principle "a wire knows no meaning" was born
- [05_half_adder.md](./05_half_adder.md) — The fruit of this lesson: a circuit that ADDS numbers

---

**Previous topic:** [03.5_soyutlama_merdiveni.md](./03.5_soyutlama_merdiveni.md)
**Next topic:** [05_half_adder.md](./05_half_adder.md)

*This guide is part of the [waitaseC137/nand2shell](https://github.com/waitaseC137/nand2shell) repository.*
