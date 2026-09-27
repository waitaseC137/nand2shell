# 📚 Topic Guides

> The lessons that go from switches to a computer with NandGame, and the catalogue of weaknesses you meet in them.

---

## 🔌 From Switches to a Computer (NAND to CPU)

> 🚧 **This course is still being written** — it grew out of the NandGame journey; the **arithmetic, routing and ALU units are complete, and the Memory unit is in progress** (21 files: 00–17, interludes included): from switch/relay up to the adder, the subtractor, the flags (ZF/SF), data routing (the multiplexer), the calculation core (ALU) and the first memory circuits (SR Latch, D Latch). The rest (the remainder of memory, clock, control unit) will be added as the journey continues.
>
> 🧭 **New to this?** → [00_buradan_basla.md](./salterden_bilgisayara/00_buradan_basla.md) — for people who want to learn the processor not by asking "what is it?" but by **building it from its parts**. Here you build the worker from transistors: the circuit underneath every order written in assembly.

| File | Topics |
|---|---|
| [00_buradan_basla.md](./salterden_bilgisayara/00_buradan_basla.md) | Course map; the journey from switches to a CPU |
| [01_akim_salter_role.md](./salterden_bilgisayara/01_akim_salter_role.md) | Current, switch, relay — the first "logic" |
| [01.5_yasak_bolge.md](./salterden_bilgisayara/01.5_yasak_bolge.md) | **Interlude:** voltage and the noise margin, the forbidden zone, MOSFET and CMOS, `P ≈ C·V²·f` |
| [02_nanddan_kapilar.md](./salterden_bilgisayara/02_nanddan_kapilar.md) | NAND is universal: deriving NOT/AND/OR/XOR |
| [03_xor_iki_fedai.md](./salterden_bilgisayara/03_xor_iki_fedai.md) | Building XOR — "the two workhorses" (OR + NAND + AND) |
| [03.5_soyutlama_merdiveni.md](./salterden_bilgisayara/03.5_soyutlama_merdiveni.md) | A gate = a closed box; climbing one floor up |
| [04_teller_sayi_olunca.md](./salterden_bilgisayara/04_teller_sayi_olunca.md) | Assigning value to wires; the token logic |
| [05_half_adder.md](./salterden_bilgisayara/05_half_adder.md) | XOR+AND = the seed of addition (sum + carry) |
| [06_full_adder.md](./salterden_bilgisayara/06_full_adder.md) | a+b+carry-in; two half adders = the skeleton of an ALU |
| [07_multibit_adder.md](./salterden_bilgisayara/07_multibit_adder.md) | Building the chain; carry-in and carry-out are **one wire** |
| [08_increment.md](./salterden_bilgisayara/08_increment.md) | The 16-bit bundle · overflow · the wire nobody reads (carry flag) |
| [08.5_sayac_basa_donunce.md](./salterden_bilgisayara/08.5_sayac_basa_donunce.md) | **Interlude:** modular arithmetic, `ℤ/2ⁿℤ` and **CWE-190** integer overflow |
| [09_subtraction.md](./salterden_bilgisayara/09_subtraction.md) | Two's complement; making an adder subtract |
| [10_bayraklar.md](./salterden_bilgisayara/10_bayraklar.md) | ZF and SF; how a machine says "if" — the circuit under `cmp` |
| [11_selector_switch.md](./salterden_bilgisayara/11_selector_switch.md) | Selector & Switch; data vs control wire, the multiplexer |
| [12_logic_unit.md](./salterden_bilgisayara/12_logic_unit.md) | Logic Unit; the order is a number, picking one of four operations |
| [13_arithmetic_unit.md](./salterden_bilgisayara/13_arithmetic_unit.md) | Arithmetic Unit; moving the selector to the input, manufacturing the constant |
| [14_alu.md](./salterden_bilgisayara/14_alu.md) | ALU; the control word, flags changing the operand |
| [15_condition.md](./salterden_bilgisayara/15_condition.md) | Condition; AND as a valve, trichotomy and closing the OF debt |
| [16_sr_latch.md](./salterden_bilgisayara/16_sr_latch.md) | SR Latch; feedback, the number of inversions: memory or oscillation |
| [17_d_latch.md](./salterden_bilgisayara/17_d_latch.md) | D Latch; a translator in front of the SR Latch, the forbidden row made impossible in the settled state and turned into a timing rule, why not select |

---
## 👾 CWE Map

> The page where the kinds of weakness you meet across the lessons are collected in one place. The **👾 For the curious** links in the lessons all lead here.

| File | Topics |
|---|---|
| [README.md](./cwe/README.md) | What a CWE is, what a CVE is, the difference · chains · the CWEs of the From Switches to a Computer lessons |

---
