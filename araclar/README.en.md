# 🧰 Tools — For Testing the Claims in the Lessons

> Every file in this folder was written to test **one specific sentence** in the
> [From Switches to a Computer](../docs/eng/konu_anlatimlari/salterden_bilgisayara/)
> series. They are not general-purpose tools. When a lesson says "required",
> "enough", "impossible" or "was simulated", the test behind that sentence lives
> here, and anyone can repeat it on their own machine.

📙 Türkçe: [README.md](./README.md)

---

## Why It Exists

The lessons are written by someone learning alone, together with an AI. The
learner and the AI can both find the same wrong sentence "reasonable". So the rule
is: **the referee is not the writer, not the AI, and not a second AI. The referee
is the game and the simulation.**

The tools here are the part of that refereeing that can be done on a machine.
Claims about the game itself (does it allow a connection, how many nands does it
count for a part) can only be tested in the game. Those were tried by hand, in the
game, and settled with screenshots.

---

## Setup

| tool | used for | setup |
|---|---|---|
| **Python 3** | every `.py` file; standard library only | ready on most systems |
| **gcc** or **clang** | the `.c` files in `08-09_c/` | Arch: `pacman -S gcc clang` · Debian/Ubuntu: `apt install gcc clang` |
| **iverilog** (Icarus Verilog) | `16-17_latch/verilog/` | Arch: `pacman -S iverilog` · Debian/Ubuntu: `apt install iverilog` |
| **Digital** | only `15_condition/digital/` | Java + [Digital](https://github.com/hneemann/Digital); the path to `Digital.jar` can be given with `DIGITAL_JAR` |
| **yosys** | not used yet | installed; why it is waiting is written below |

---

## Which Lesson, Which Claim, Which Tool

| lesson | claim tested | file | result | effect on the lesson |
|---|---|---|---|---|
| 06 · Full Adder | "The OR and XOR solutions behave identically"; "the two carries can never be 1 at the same time" | `06_full_adder/fa_gecis.py` | true in the stable state; but in the `abc` 011 → 111 and 101 → 111 transitions `h1 = h2 = 1` lasts three ticks: the OR output stays 1, the XOR output drops to 0 for three ticks | "in the stable state" qualifier and a transition note; the same note for the `xor` in 15 (`X` 0000 → 8000) |
| 08 · Increment · CWE-680 | With `n = 65535`, does `malloc(n + 1)` wrap? | `08-09_c/c_iddialar.c` | it doesn't: C widens the 16-bit `n` to `int`, `n + 1 = 65536`; the wrap happens when the result is put into a 16-bit variable | the example is written with `uint16_t boyut = n + 1` |
| 08.5 · When the Counter Wraps | "`a + b > MAX` never fires" | `08-09_c/c_iddialar.c` | with 16-bit types it fires in C (widening to `int`); with a 32-bit `unsigned int` it never fires | `MAX` defined, a C note added |
| 09 · Subtraction · CWE-195 · 196 · 839 | How many bytes does a signed `−1` become in `memcpy`? Is `−1 > MAX` always false? | `08-09_c/c_iddialar.c` | 18446744073709551615 (2⁶⁴ − 1), not 65535; if `MAX` is unsigned (`sizeof`) the check holds by accident | the example and the chain tables fixed, a note on unsigned `MAX` in 839 |
| CWE-190 | "The compiler deletes the overflow check" | `08-09_c/ub_silme.c` | `a + 1 < a` is deleted, the function always returns 0; `a + b < a` is not deleted, it becomes `b < 0` | the example became `a + 1 < a`, a note for `a + b` |
| CWE-191 | "Asking afterwards is useless" | `08-09_c/c_iddialar.c` | `a − b < 0` is useless; `r = a − b; r > a` catches the wrap | the sentence narrowed to the `a − b < 0` question |
| CWE-787 | What happens when 65536 bytes are written after `malloc(0)`? | `08-09_c/malloc_sifir.c` | glibc 2.44: gives an address (24 bytes), the writes pass silently, the next `malloc` stops with "corrupted top size"; AddressSanitizer catches it at the first overflowing byte | the "The damage is only noticed later" paragraph |
| 08.5 · When the Counter Wraps · CWE-190 · 191 | "Overflowing an addition needs two large numbers"; "the error set is narrow" | `08.5_sayac/tasma_kumesi.py` | in 16 bits 49.9992% of the pairs overflow; if both are below 32768 none do, `65535 + 1` does; 99.98% for multiplication; no overflow at all with numbers from 0 to 1000 | "at least one large number"; "the set is half of the pairs, tests are written with small numbers" |
| CWE-190 | "The clock goes 137 years back" | `08.5_sayac/tasma_kumesi.py` | 2038-01-19 03:14:07 → 1901-12-13 20:45:52: 136.1 years | 136 years |
| CWE-1261 | "A deviation of a power of two = a single bit flip" | `08.5_sayac/tasma_kumesi.py` | a single bit flip always changes the number by exactly 2ᵏ; but +4096 changes a single bit in only half of the numbers (4096 + 4096 = 8192: two bits) | direction fixed: the deviation is a trace, not proof |
| 11 · Selector and Switch | "Exactly one is open at any moment"; "they can never both be full" | `16-17_latch/verilog/mitre_1298.v` | MITRE's 1298 example is exactly the selector from 11: as `s` falls from 1 to 0 with `d0 = d1 = 1`, the output is 0 for one tick | a "stable state" qualifier and a gate-delay note |
| 12 · Logic Unit | Which operations give `ffff` on the `X=0, Y=ffff` row; can the input `X=Y=6553` tell the four operations apart? | `14_alu/alu_sayim.py` | `or`, `xor` **and `inv X`**; at `6553`, `xor` gives 0 and the experiment cannot tell them apart | `inv X` added to the list, the experiment input became `00FF`/`0F0F` ([13bf01e](https://github.com/waitaseC137/nand2shell/commit/13bf01e), [f4eb49c](https://github.com/waitaseC137/nand2shell/commit/f4eb49c)) |
| 14 · ALU | How many distinct operations do the 32 combinations give, and how many does the documentation list? | `14_alu/alu_sayim.py` | 19 operations · 11 documented · 8 unlisted | the lesson said "8 documented"; fixed ([5d7c451](https://github.com/waitaseC137/nand2shell/commit/5d7c451)) |
| 14 · ALU | What does the "zero on the wrong flag" trap look like? | `14_alu/sifir_tuzagi.py` | 60 setups give the same symptom; the `X=5, Y=3` table | the trap rewritten with its full setup ([f4eb49c](https://github.com/waitaseC137/nand2shell/commit/f4eb49c)) |
| 15 · Condition | "If Never and Always hold, the six rows in between hold too" | `15_condition/never_always.py` · `15_condition/digital/` | both wrong circuits pass both tests and are wrong in 8 of 24 rows | the test section rewritten around single-permission rows ([5d7c451](https://github.com/waitaseC137/nand2shell/commit/5d7c451)) |
| 15 · Condition | The OF rule: signs differ **and** the result's sign differs from `a`'s | `15_condition/of_kurali.py` | 0 mismatches in 256 pairs | the "How does OF know?" section ([f4eb49c](https://github.com/waitaseC137/nand2shell/commit/f4eb49c)) |
| 15 · Condition | The subtractor's carry is the inverse of x86's CF; on the `inc` path from 09 the carry is lost when `B = 0` | `15_condition/cf_borc.py` | 0/256 mismatches in one pass; 16 rows on the `inc` path, all with `B = 0` | the "Do not take CF for the carry from 09" box was written ([7b94374](https://github.com/waitaseC137/nand2shell/commit/7b94374)), then left to x86's own turn and removed from the lesson; the test remains |
| 16 · SR Latch | Who wins when leaving `0 0`; when the parity rule holds; `and+and`; `or(s, q)`; why cross-coupling | `16-17_latch/sr_latch_16.py` | the command of the one rising last wins; the rule only at `1 1`; `and+and` cannot write 1 | inversion rule and race ([dc754b6](https://github.com/waitaseC137/nand2shell/commit/dc754b6)); cross-coupling derivation ([7552a3b](https://github.com/waitaseC137/nand2shell/commit/7552a3b)) |
| 17 · D Latch | "The forbidden row is physically impossible"; the test table; the `select` latch | `16-17_latch/d_latch_17.py` | a one-tick `s = r = 0` spike; `st` falling 1 tick after `d` makes it oscillate; flipping `d` first makes a correct circuit look broken | "A spike that lasts an instant", a one-switch-per-step test table ([271d06f](https://github.com/waitaseC137/nand2shell/commit/271d06f)) |
| 17 · D Latch | What does the `select` latch do under different delays; does the SR solution hold under every delay; why did the game's black box pass? | `16-17_latch/verilog/select_latch.v` · `sr_dlatch_delays.v` · `kutu_vs_kapi.v` | three outcomes (lost bit · oscillation · fine); the SR solution has no error in 8 patterns; a box that decides in one step holds the bit | "Why Not Select?" ([282fdbf](https://github.com/waitaseC137/nand2shell/commit/282fdbf)) |
| 17 · D Latch · CWE-1271 | Does waiting for the first write close the window; a latch with a reset input | `16-17_latch/reset_latch_17.py` · `verilog/reset_latch.v` | without reset the circuit shows `x` until the first write; with a reset input it is 1 on every power-on | reset explained correctly ([144d061](https://github.com/waitaseC137/nand2shell/commit/144d061)) |
| CWE-1298 | Does MITRE's example code really produce a spike; does the fix line work? | `16-17_latch/verilog/mitre_1298.v` | a one-tick 0 in the buggy code; the fix line is not valid Verilog as written, its valid form works | the [CWE-1298](../docs/eng/konu_anlatimlari/cwe/cwe_1298.md) page ([877b16e](https://github.com/waitaseC137/nand2shell/commit/877b16e)) |
| 18 · Data Flip-Flop | Does opening the `d latch` boxes into bare nands bring out a race? | `18_dff/dff_sim.py` | 1–3 tick delay per nand, 400 runs: in the 9,851 steps after the first showing (the first fall after a store), 0 wrong and 0 unstable; instability only before the first showing | "When the Boxes Are Opened" and "Undefined at Power-On Again" |

The top of every file states the claim it tests, the expected output and the
command to run it. The comments and output are in Turkish.

---

## Why These Tools

**Python — "try them all".** Claims about numbers ("how many of the 32
combinations are distinct?", "does it hold for all 256 pairs?") are tested the
shortest way: by trying every input one by one. No proof needed; you count.

**Python — a unit-delay gate simulator** (`16-17_latch/kapi_sim.py`). With latches
the question is no longer "which value?" but "in which **order**?". When every
gate's output changes one tick later, oscillation in loops and instant spikes
become visible. Its limit: every gate has the **same** speed. On a real chip that
is not the case.

**Digital — a second referee, and eyes.** The test claim in 15 was first tested in
Python. But we wrote the Python simulator ourselves; its bugs could be ours. The
same three circuits were built gate by gate in
[Digital](https://github.com/hneemann/Digital) and run with Digital's own test
engine. The result was the same. And the `.dig` files can be opened to see the
circuit.

**iverilog — different delays, and "undefined".** The Python simulator's limit
mattered in 17: the outcome of the `select` latch depended on the **relative**
speed of the gates. iverilog lets every gate have its own delay, and the same
circuit gave three different outcomes. Its second feature is four-state logic: a
wire whose value is not known shows `x`. That is how the "window" from 1271 became
visible in the output. Third, MITRE's example code is written in Verilog. Running
the code directly showed that the fix line is not valid Verilog.

**gcc and clang — what does C really do?** The C examples in the lessons were
written with a 16-bit machine in mind. But C is not that machine: it widens 16-bit
numbers to `int` before adding them, it widens a signed number to 64 bits when
converting it to `size_t`, and it treats signed overflow as undefined. So every
example was compiled and run, and where needed the code the compiler produced was
inspected.

**NandGame — everything about the game.** What the game does can only be tested
in the game, and that was done by hand. It has no file in this folder but it left
its mark in the lessons: how a 1-bit wire is widened to 16 bits, the carry output
of `add 16`, the order of leaving `0 0` in the SR Latch, and the black-box and
opened-up `select` were all settled this way.

**yosys — installed, not used yet.** The planned job: reduce a circuit to `nand`
gates only, count them, and compare with NandGame's "this many nands". The nand
count mistake in 17 was found by measuring in the game, so it was not needed. It
will be added here the day it is.

---

## To Be Honest

- These simulators show **simple delay models**, not physics. A result means "in
  this model, this happens". The lessons say so too.
- None of them shows a latch hanging between two values for a while.
- "The game computes the box in a single step" is an **inference**. The game's
  code was not read. `kutu_vs_kapi.v` only shows that this inference agrees with
  what was seen in the game.
- The C results depend on the compiler, the library and the machine: gcc 16.2,
  clang 22.1, glibc 2.44, x86-64 (`int` is 32 bits, `size_t` 64 bits). On an old or
  embedded system where `int` is 16 bits, `malloc(n + 1)` really does wrap.

---

## Folder Layout

```
araclar/
├── 06_full_adder/           fa_gecis.py
├── 08-09_c/                 c_iddialar.c · ub_silme.c · malloc_sifir.c
├── 08.5_sayac/              tasma_kumesi.py
├── 14_alu/                  alu_sayim.py (12's two rows are here too) · sifir_tuzagi.py
├── 15_condition/            never_always.py · of_kurali.py · cf_borc.py
│   └── digital/             uret.py · dig_uretici.py · 15_condition_*.dig
├── 16-17_latch/             kapi_sim.py (shared) · sr_latch_16.py · d_latch_17.py · reset_latch_17.py
│   └── verilog/             select_latch.v · sr_dlatch_delays.v · kutu_vs_kapi.v · reset_latch.v · mitre_1298.v
└── 18_dff/                  dff_sim.py
```

The Python files are run from inside their own folder
(`cd 16-17_latch && python3 d_latch_17.py`), because they look for `kapi_sim.py`
next to them.

---

## Pitfalls

- **Digital** turns `_` in labels into a subscript; spaces were used in names.
- **Digital**'s test table does not read negative numbers: `65533` was written for
  `−3` in 16 bits.
- **Digital** gives a `sun.misc.Unsafe` warning on newer Java versions; harmless.
  The pin positions are at the top of `dig_uretici.py`, measured in Digital 0.31.
- **iverilog** gives a "procedural continuous assignments" warning on
  `reset_latch.v`. Harmless: `force` is used to set the power-on value.
- In `select_latch.v` and `kutu_vs_kapi.v`, the single value at the end of the
  output is a snapshot of that moment. To see an oscillating circuit, look at the
  tick-by-tick trace.

---

*This folder is part of the [From Switches to a Computer](../docs/eng/konu_anlatimlari/salterden_bilgisayara/) series. License: code MIT, text CC BY-SA 4.0 ([main README](../README.md)).*
