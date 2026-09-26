# 👾 CWE Map

> If you got here from a **👾 For the Curious** link in a lesson, you're in the
> right place. This page first explains what a CWE and a CVE are, then lists the
> weaknesses you run into across the lessons, all in one spot.
>
> This is an **index**. Every weakness has its own page: what it is, which circuit
> it is born in, what it has done in the real world, and how it is prevented.
> The lessons themselves only teach the circuit and the math.

---

## 📋 Table of Contents

- [What Is a CWE?](#what-is-a-cwe)
- [What Is a CVE?](#what-is-a-cve)
- [CWE vs CVE](#cwe-vs-cve)
- [The Hierarchy Between CWEs](#the-hierarchy-between-cwes)
- [Chains: The Wire Between Two Bugs](#chains-the-wire-between-two-bugs)
- [The NandGame Tree](#the-nandgame-tree)
- [On the Way](#on-the-way)
- [On Hold — OverTheWire](#on-hold--overthewire)

---

## What Is a CWE?

**CWE** (*Common Weakness Enumeration*) is a catalogue of the **kinds of mistakes**
that keep showing up in software and hardware. It is maintained by MITRE, and every
kind has a number.

Example: **CWE-190 — Integer Overflow or Wraparound.** In lesson 08 you saw that
the 17th bit of a 16-bit adder has nowhere to go. That is the name of that kind of
mistake.

> 🔑 A CWE is a **weakness**, not a vulnerability on its own. A counter can wrap and
> nothing happens. It turns dangerous the moment the overflowed number is used as a
> memory size, a bounds check, or an array index.

---

## What Is a CVE?

**CVE** (*Common Vulnerabilities and Exposures*) is the identifier given to **one
specific vulnerability in one specific product**. The format is `CVE-year-number`.

Example: **CVE-2018-10299.** In the BEC Token smart contract, the total amount to
send was computed as `number of recipients × amount`. An attacker made that product
wrap in 256 bits (`2 × 2²⁵⁵ = 2²⁵⁶` → `0`); the balance check saw zero and let it
through. The kind of this vulnerability: **CWE-190.**

---

## CWE vs CVE

| | CWE | CVE |
|---|---|---|
| **What does it name?** | The **kind** of mistake | A single **case** |
| **Example** | CWE-190: integer overflow | CVE-2018-10299: the overflow in BEC Token |
| **Question it answers** | "What kind of bug is this?" | "Which product, which version?" |
| **What is it good for?** | Knowing **what to look for** when auditing code | Knowing **what to update** |

> 🔑 Many CVEs can sit under a single CWE. CVEs record what has already happened;
> knowing the CWE is what lets you find the next bug *before* it becomes a CVE.

---

## The Hierarchy Between CWEs

On the pages you will often see a row called **Parent**. That is because the CWE
list is not a flat list but **a tree with four tiers:**

```
Pillar             most abstract  ·  names a theme                     ·  e.g. CWE-682
   └─ Class                        ·  a kind independent of technology  ·  e.g. CWE-119
        └─ Base                    ·  concrete enough to give detection/prevention methods  ·  e.g. CWE-190
             └─ Variant            ·  specific to a particular language/technology
```

Most of the pages here are at the **Base** level — at that tier you can say "watch
out for this, prevent it like that".

> 🔑 **When a real vulnerability is given a number, the most CONCRETE tier possible
> is chosen.** Pillars and classes are not for labelling but for **orientation**:
> when you see a new bug they tell you which family it falls into, and what else
> the same defence closes at once.

There is also a category called **Compound**: not a single weakness but a pattern
formed by several weaknesses linked together. [CWE-680](./cwe_680.md) is such a
**chain** — explained below.

---

## Chains: The Wire Between Two Bugs

Some CWE numbers do not name a single mistake — they name how one mistake gives
birth to another. MITRE calls these **chains**.

```
   CWE-190                                      CWE-787
 number wraps  ─────────  CWE-680  ─────────►  out-of-bounds write
                    (the name of this wire)
```

`CWE-680` is not a third event; it is the name of the wire between two events: the
moment the wrapped number is used as a memory size. The two-box model explains it →
[CWE-680](./cwe_680.md#there-are-two-boxes-here)

---

## The NandGame Tree

This map covers the topics **from the start of NandGame up to the second level of
the Memory unit (D Latch)**. The rule is simple: **a topic that has not been
taught gets no CWE here.** The catalogue mirrors the curriculum; it does not run
ahead of it.

### The Two Halves of the Unit

The ALU unit does two jobs, and both have a counterpart in MITRE's top tier:

```
NandGame ALU unit
   │
   ├─ CALCULATES        →  CWE-682  Incorrect Calculation   (pillar)
   │                          └─ 190 · 191 · 193
   │
   └─ COMPARES          →  CWE-697  Incorrect Comparison    (pillar)
                              └─ 1023 · 1254
```

| CWE | Official name | Where it is born | link |
|---|---|---|---|
| [**CWE-682**](./cwe_682.md) | Incorrect Calculation — **pillar** | [08 · Increment](../salterden_bilgisayara/08_increment.md) · [13 · Arithmetic Unit](../salterden_bilgisayara/13_arithmetic_unit.md) | [📄](https://cwe.mitre.org/data/definitions/682.html) |
| [**CWE-697**](./cwe_697.md) | Incorrect Comparison — **pillar** | [15 · Condition](../salterden_bilgisayara/15_condition.md) | [📄](https://cwe.mitre.org/data/definitions/697.html) |

The rest of the catalogue is arranged around these two pillars. The three tiers
below are measured by a single question: **how necessary is it for understanding
NandGame?**

---

### 🔴 Tier 1 — Must Know

> The circuit you built is this weakness. If you do not know it, you built the
> circuit without knowing what you did.

| CWE | Official name | Where it is born | link |
|---|---|---|---|
| [**CWE-190**](./cwe_190.md) | Integer Overflow or Wraparound | [08 · Increment](../salterden_bilgisayara/08_increment.md) · [08.5](../salterden_bilgisayara/08.5_sayac_basa_donunce.md) | [📄](https://cwe.mitre.org/data/definitions/190.html) |
| [**CWE-191**](./cwe_191.md) | Integer Underflow (Wrap or Wraparound) | [09 · Subtraction](../salterden_bilgisayara/09_subtraction.md) · [08.5](../salterden_bilgisayara/08.5_sayac_basa_donunce.md) | [📄](https://cwe.mitre.org/data/definitions/191.html) |
| [**CWE-193**](./cwe_193.md) | Off-by-one Error | [13 · Arithmetic Unit](../salterden_bilgisayara/13_arithmetic_unit.md) | [📄](https://cwe.mitre.org/data/definitions/193.html) |
| [**CWE-681**](./cwe_681.md) | Incorrect Conversion between Numeric Types | [04 · When Wires Become Numbers](../salterden_bilgisayara/04_teller_sayi_olunca.md) | [📄](https://cwe.mitre.org/data/definitions/681.html) |
| [**CWE-787**](./cwe_787.md) | Out-of-bounds Write | [08 · Increment](../salterden_bilgisayara/08_increment.md#-the-security-bridge) | [📄](https://cwe.mitre.org/data/definitions/787.html) |
| [**CWE-1245**](./cwe_1245.md) | Improper Finite State Machines (FSMs) in Hardware Logic | [16 · SR Latch](../salterden_bilgisayara/16_sr_latch.md#the-unused-row) | [📄](https://cwe.mitre.org/data/definitions/1245.html) |

**Why is 787 here?** The overflow itself breaks nothing. Without this outcome 190
would remain a curiosity — this is why it sits at number one in the Top 25.

**Why is 1245 here?** The first CWE of the Memory unit. The SR Latch is the smallest
possible **state machine**, and the `0 0 → not used` row in its table is its
undefined transition. Understanding why the next level, the D Latch, exists goes
through understanding this weakness: the D Latch makes that row impossible by
construction ([17](../salterden_bilgisayara/17_d_latch.md#the-forbidden-row-is-gone)).

---

### 🟡 Tier 2 — Reinforcing Understanding

> Not required to build the circuit. The answer to "why does this matter" is here.

| CWE | Official name | Where it is born | link |
|---|---|---|---|
| [**CWE-680**](./cwe_680.md) | Integer Overflow to Buffer Overflow | [08 · Increment](../salterden_bilgisayara/08_increment.md#-the-security-bridge) | [📄](https://cwe.mitre.org/data/definitions/680.html) |
| [**CWE-196**](./cwe_196.md) | Unsigned to Signed Conversion Error | [09 · Subtraction](../salterden_bilgisayara/09_subtraction.md#-the-security-bridge) | [📄](https://cwe.mitre.org/data/definitions/196.html) |
| [**CWE-839**](./cwe_839.md) | Numeric Range Comparison Without Minimum Check | [09 · Subtraction](../salterden_bilgisayara/09_subtraction.md#-the-security-bridge) | [📄](https://cwe.mitre.org/data/definitions/839.html) |
| [**CWE-195**](./cwe_195.md) | Signed to Unsigned Conversion Error | [09 · Subtraction](../salterden_bilgisayara/09_subtraction.md#-the-security-bridge) | [📄](https://cwe.mitre.org/data/definitions/195.html) |
| [**CWE-1023**](./cwe_1023.md) | Incomplete Comparison with Missing Factors | [10 · Flags](../salterden_bilgisayara/10_bayraklar.md) | [📄](https://cwe.mitre.org/data/definitions/1023.html) |
| [**CWE-194**](./cwe_194.md) | Unexpected Sign Extension | [13 · Arithmetic Unit](../salterden_bilgisayara/13_arithmetic_unit.md#a-16-bit-1-is-not-one-wire) | [📄](https://cwe.mitre.org/data/definitions/194.html) |
| [**CWE-197**](./cwe_197.md) | Numeric Truncation Error | [13 · Arithmetic Unit](../salterden_bilgisayara/13_arithmetic_unit.md#a-16-bit-1-is-not-one-wire) | [📄](https://cwe.mitre.org/data/definitions/197.html) |
| [**CWE-480**](./cwe_480.md) | Use of Incorrect Operator | [12 · Logic Unit](../salterden_bilgisayara/12_logic_unit.md) | [📄](https://cwe.mitre.org/data/definitions/480.html) |
| [**CWE-1271**](./cwe_1271.md) | Uninitialized Value on Reset for Registers Holding Security Settings | [16 · SR Latch](../salterden_bilgisayara/16_sr_latch.md#waking-up-without-anyone-choosing) | [📄](https://cwe.mitre.org/data/definitions/1271.html) |

**The three are a chain.** In the Security Bridge example in lesson 09 the same
number is read three times under three different contracts: [196](./cwe_196.md) as
it enters the variable, [839](./cwe_839.md) at the check, [195](./cwe_195.md) at the
point of use.

**Two axes.** [196](./cwe_196.md) and [195](./cwe_195.md) describe what happens when
the **interpretation** of the same bits changes — the width stays fixed.
[194](./cwe_194.md) and [197](./cwe_197.md) describe what happens when **the width
itself** changes.

| | width | interpretation |
|---|---|---|
| [196](./cwe_196.md) · [195](./cwe_195.md) | fixed | changes |
| [194](./cwe_194.md) · [197](./cwe_197.md) | changes | tries to stay fixed |

The width axis entered the catalogue later, and the reason is instructive: this
topic only reached the curriculum with the bundler in
[13 · Arithmetic Unit](../salterden_bilgisayara/13_arithmetic_unit.md#a-16-bit-1-is-not-one-wire).
The catalogue was not wrong — it was an honest mirror of the scope at the time.

---

### 🟢 Tier 3 — Useful Later

> Not needed to understand NandGame. You will meet these in assembly and reverse
> engineering.

| CWE | Official name | Where it is born | link |
|---|---|---|---|
| [**CWE-1300**](./cwe_1300.md) | Improper Protection of Physical Side Channels | [01 · Current, the Switch, and NAND](../salterden_bilgisayara/01_akim_salter_role.md) | [📄](https://cwe.mitre.org/data/definitions/1300.html) |
| [**CWE-1247**](./cwe_1247.md) | Improper Protection Against Voltage and Clock Glitches | [02 · All the Gates from One Brick](../salterden_bilgisayara/02_nanddan_kapilar.md) | [📄](https://cwe.mitre.org/data/definitions/1247.html) |
| [**CWE-1261**](./cwe_1261.md) | Improper Handling of Single Event Upsets | [04 · When Wires Become Numbers](../salterden_bilgisayara/04_teller_sayi_olunca.md) | [📄](https://cwe.mitre.org/data/definitions/1261.html) |
| [**CWE-1384**](./cwe_1384.md) | Improper Handling of Physical or Environmental Conditions — **umbrella** | 01 · 02 · 04 | [📄](https://cwe.mitre.org/data/definitions/1384.html) |
| [**CWE-704**](./cwe_704.md) | Incorrect Type Conversion or Cast — **umbrella** | [04 · When Wires Become Numbers](../salterden_bilgisayara/04_teller_sayi_olunca.md) | [📄](https://cwe.mitre.org/data/definitions/704.html) |
| [**CWE-670**](./cwe_670.md) | Always-Incorrect Control Flow Implementation — **umbrella** | [12 · Logic Unit](../salterden_bilgisayara/12_logic_unit.md) | [📄](https://cwe.mitre.org/data/definitions/670.html) |
| [**CWE-1242**](./cwe_1242.md) | Inclusion of Undocumented Features or Chicken Bits | [14 · ALU](../salterden_bilgisayara/14_alu.md) | [📄](https://cwe.mitre.org/data/definitions/1242.html) |
| [**CWE-1254**](./cwe_1254.md) | Incorrect Comparison Logic Granularity | [15 · Condition](../salterden_bilgisayara/15_condition.md) | [📄](https://cwe.mitre.org/data/definitions/1254.html) |
| [**CWE-119**](./cwe_119.md) | Improper Restriction of Operations within the Bounds of a Memory Buffer — **umbrella** | [08 · Increment](../salterden_bilgisayara/08_increment.md) | [📄](https://cwe.mitre.org/data/definitions/119.html) |

**1254 is a first:** the only CWE in your catalogue with **two parents**. MITRE put
it under both [697](./cwe_697.md) (the comparison was built in the wrong manner)
and **208** (the time difference is observable from outside). Because it stands
right at the crossroads, once 208 is written this page will be reachable from both
sides.

**Why is 1242 in this tier but still important?** The ALU level's control word is
5 bits, that is **32 states** — but the documentation defines 8 operations. The
difference is harmless in NandGame. On a real chip, if an undocumented control bit
switches off a security feature, its name is **chicken bit**. The rule: *every
control word wider than its documented state space is a place to look.* That is
exactly the job reverse engineering does.

---

## On the Way

🔜 These arrive as the lessons are written. The order follows the curriculum.

| Where | CWE | Official name |
|---|---|---|
| Memory unit · addressing | **125** | Out-of-bounds Read |
| Memory unit | **416** | Use After Free |
| Clock · seeded in [16](../salterden_bilgisayara/16_sr_latch.md#the-unused-row) | **1298** | Hardware Logic Contains Race Conditions |
| Pipeline / speculation | **208** | Observable Timing Discrepancy |
| SMT / shared units | **1303** | Non-Transparent Sharing of Microarchitectural Resources |
| After the two above | **203** | Observable Discrepancy (umbrella) |
| Microcode / privileged controls | **1256** | Improper Restriction of Software Interfaces to Hardware Features |

> 📌 **The "where" column here is an estimate, not a promise.** It sharpens as the
> lessons are written. The only firm condition known for `125` is this: reading out
> of bounds first needs an **address** — that weakness cannot be born before the
> question *"which slot shall I read?"* appears. We will write down which level it is
> born in once we reach that level.
>
> 🔑 **We are not writing 203 now, on purpose.** A topic with no lesson gets no CWE.
> 203 only becomes meaningful once 208 and 1303 are written — building an umbrella
> without both of its children would put the map ahead of the curriculum.
>
> 697 and 1242 used to be on this list; they moved into the tree once their lessons
> were written.

---

## On Hold — OverTheWire

OverTheWire is not being solved right now, so these pages were **taken off the
map.** The pages remain and can be reached from their own lessons; they will come
back here when those series are picked up again.

[78](./cwe_78.md) · [59](./cwe_59.md) · [367](./cwe_367.md) ·
[77](./cwe_77.md) · [706](./cwe_706.md) · [362](./cwe_362.md)

---

## 🔗 Related Topics

- [08.5_sayac_basa_donunce.md](../salterden_bilgisayara/08.5_sayac_basa_donunce.md) — The math of overflow: `ℤ/2ⁿℤ`, the error set, deriving the correct check
- [CWE-680](./cwe_680.md#there-are-two-boxes-here) — Why 680 is a wire and not an event: the two-box model
- [KONU_ANLATIMLARI.md](../KONU_ANLATIMLARI.md) — The full topic index

---

*Numbers, official names and abstraction levels are taken from MITRE's CWE list: [cwe.mitre.org](https://cwe.mitre.org).*
