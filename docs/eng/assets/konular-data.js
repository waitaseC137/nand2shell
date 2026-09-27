/* ============================================================
   Topic Guides — content tree (English)
   base: konu_anlatimlari/
   ============================================================ */
window.KONULAR = {
  base: "konu_anlatimlari/",
  rootLabel: "konu_anlatimlari",
  title: "Topic Guides",
  unit: "files",
  intro: "The lessons that go from switches to a computer with NandGame, and the weaknesses you meet in them. Start from a category — or jump to any topic from the tree / search on the left. All readable inside the site.",
  categories: [
    {
      id: "salterden_bilgisayara",
      label: "From Switches to a Computer (NAND to CPU)",
      accent: "var(--d-low)",
      tag: "21 lessons · 🚧 Memory unit in progress",
      blurb: "A course born from the NandGame journey — from switch/relay to NAND, from NAND to logic gates, from gates to the adder (half/full adder). Learn the processor not by asking 'what is it' but by building it from its parts yourself. The arithmetic, routing and ALU units are complete (00–15): adder, subtractor, flags, the multiplexer and the ALU. The Memory unit is in progress (16 SR Latch, 17 D Latch). The rest of memory and the CPU are next.",
      files: [
        { f: "salterden_bilgisayara/00_buradan_basla.md",        n: "→",    t: "Start Here",              h: "Course map; from switches to a CPU (🚧 in progress)" },
        { f: "salterden_bilgisayara/01_akim_salter_role.md",     n: "01",   t: "Current · Switch · Relay", h: "Electricity → switch → relay = the first logic" },
        { f: "salterden_bilgisayara/02_nanddan_kapilar.md",      n: "02",   t: "Gates from NAND",         h: "NAND is universal: derive NOT/AND/OR/XOR" },
        { f: "salterden_bilgisayara/03_xor_iki_fedai.md",        n: "03",   t: "XOR: The Two Workhorses", h: "Building XOR from OR+NAND+AND" },
        { f: "salterden_bilgisayara/03.5_soyutlama_merdiveni.md",n: "03.5", t: "The Ladder of Abstraction", h: "A gate = a closed box; climbing one floor up" },
        { f: "salterden_bilgisayara/04_teller_sayi_olunca.md",   n: "04",   t: "When Wires Become Numbers", h: "Assigning value to wires; the token logic" },
        { f: "salterden_bilgisayara/05_half_adder.md",           n: "05",   t: "Half Adder",              h: "XOR+AND = the seed of addition (sum/carry)" },
        { f: "salterden_bilgisayara/06_full_adder.md",           n: "06",   t: "Full Adder",              h: "a+b+carry-in; two half adders" },
        { f: "salterden_bilgisayara/07_multibit_adder.md",       n: "07",   t: "Multi-bit Adder",         h: "Building the chain; carry-in and carry-out are one wire" },
        { f: "salterden_bilgisayara/08_increment.md",            n: "08",   t: "Increment",               h: "16-bit bundle · overflow · the wire nobody reads" },
        { f: "salterden_bilgisayara/08.5_sayac_basa_donunce.md", n: "08.5", t: "When the Counter Wraps", h: "Interlude: modular arithmetic · ℤ/2ⁿℤ · CWE-190" },
        { f: "salterden_bilgisayara/09_subtraction.md",          n: "09",   t: "Subtraction",             h: "Two's complement; making an adder subtract" },
        { f: "salterden_bilgisayara/10_bayraklar.md",            n: "10",   t: "Flags (ZF/SF)",           h: "Zero and sign; how a machine says 'if'" },
        { f: "salterden_bilgisayara/11_selector_switch.md",     n: "11",   t: "Selector & Switch",       h: "The control wire · AND as a valve · the multiplexer" },
        { f: "salterden_bilgisayara/12_logic_unit.md",          n: "12",   t: "Logic Unit",              h: "The order is a number · all computed, one chosen" },
        { f: "salterden_bilgisayara/13_arithmetic_unit.md",     n: "13",   t: "Arithmetic Unit",         h: "Moving the selector to the input · manufacturing a 16-bit constant" },
        { f: "salterden_bilgisayara/14_alu.md",                 n: "14",   t: "ALU",                     h: "The control word · changing the material, not the operation" },
        { f: "salterden_bilgisayara/15_condition.md",           n: "15",   t: "Condition",               h: "AND as a valve · trichotomy · N XOR OF" },
        { f: "salterden_bilgisayara/16_sr_latch.md",            n: "16",   t: "SR Latch",                h: "Feedback · even inversions remember, odd ones oscillate" },
        { f: "salterden_bilgisayara/17_d_latch.md",             n: "17",   t: "D Latch",                 h: "The gatekeeper of memory · the forbidden row becomes a timing rule · why not select · transparent latch" }
      ]
    },
    {
      id: "cwe",
      label: "👾 CWE Map",
      accent: "var(--magenta)",
      tag: "for the curious",
      blurb: "The kinds of weakness you meet across the lessons: the difference between CWE and CVE, the chains, and a page for each weakness — what it is, which circuit it is born in, what it has done in the real world, how it is prevented.",
      files: [
        { f: "cwe/README.md",  n: "\u2192",   t: "CWE Map",            h: "What a CWE is, what a CVE is · which lesson has which CWE" },
        { f: "cwe/cwe_190.md", n: "190", t: "Integer Overflow",  h: "BEC Token · Y2038 · Boeing 787 · Pac-Man" },
        { f: "cwe/cwe_191.md", n: "191", t: "Integer Underflow", h: "0 \u2212 1 · MITRE cases · the Gandhi legend" },
        { f: "cwe/cwe_680.md", n: "680", t: "Overflow \u2192 Buffer Overflow", h: "the two-box model · Stagefright" },
        { f: "cwe/cwe_787.md", n: "787", t: "Out-of-bounds Write", h: "no floor in memory · allocate(0)" },
        { f: "cwe/cwe_681.md", n: "681", t: "Incorrect Numeric Conversion", h: "Ariane 5 · dead code" },
        { f: "cwe/cwe_196.md", n: "196", t: "Unsigned \u2192 Signed Conversion", h: "same pattern, new reader \u00b7 first link of the chain" },
        { f: "cwe/cwe_839.md", n: "839", t: "Range Check Without Minimum", h: "ceiling watched, floor empty \u00b7 negative order" },
        { f: "cwe/cwe_195.md", n: "195", t: "Signed \u2192 Unsigned Conversion", h: "an error value mistaken for a size \u00b7 CVE-2025-27363" },
        { f: "cwe/cwe_78.md",  n: "78",  t: "OS Command Injection", h: "data and command in one channel \u00b7 execv, not system()" },
        { f: "cwe/cwe_59.md",  n: "59",  t: "Link Following", h: "a name is not an identity \u00b7 container escape \u00b7 Zip Slip" },
        { f: "cwe/cwe_367.md", n: "367", t: "TOCTOU Race", h: "a check is a photograph \u00b7 narrowing the gap is no fix" },
        { f: "cwe/cwe_1300.md", n: "1300", t: "Physical Side Channel", h: "current · electromagnetic waves · sound" },
        { f: "cwe/cwe_1247.md", n: "1247", t: "Voltage & Clock Glitches", h: "fault attack · Xbox 360 reset glitch" },
        { f: "cwe/cwe_1261.md", n: "1261", t: "Single Event Upset", h: "bit flip · Belgium's 4096 · Mario 64" },
        { f: "cwe/cwe_480.md", n: "480", t: "Incorrect Operator", h: "& vs && · the 2003 kernel attempt · = vs ==" },
        { f: "cwe/cwe_193.md", n: "193", t: "Off-by-one", h: "fencepost · 10 gaps, 11 posts · one byte is enough" },
        { f: "cwe/cwe_194.md", n: "194", t: "Sign Extension", h: "narrow → wide · why 0xFF becomes −1" },
        { f: "cwe/cwe_197.md", n: "197", t: "Truncation", h: "wide → narrow · the upper bits vanish silently · Y2K" },
        { f: "cwe/cwe_682.md", n: "682", t: "Incorrect Calculation (pillar)", h: "the umbrella of 190/191/193 · Pillar → Class → Base → Variant" },
        { f: "cwe/cwe_1384.md", n: "1384", t: "Physical Conditions (class)", h: "the umbrella of 1247 + 1261 · deliberate glitch vs particle" },
        { f: "cwe/cwe_704.md", n: "704", t: "Type Conversion (class)", h: "above 681 · the Type Confusion branch" },
        { f: "cwe/cwe_706.md", n: "706", t: "Name Resolution (class)", h: "above 59 · ../ · equivalent spellings · letter case" },
        { f: "cwe/cwe_362.md", n: "362", t: "Race Condition (class)", h: "above 367 · where software and hardware meet" },
        { f: "cwe/cwe_1023.md", n: "1023", t: "Incomplete Comparison (class)", h: "above 839 · a check exists but its scope is incomplete" },
        { f: "cwe/cwe_670.md", n: "670", t: "Incorrect Control Flow (class)", h: "above 480 · the intent and the code drifting apart" },
        { f: "cwe/cwe_77.md", n: "77", t: "Command Injection (class)", h: "above 78 · 88 arguments · 1427 LLM prompts" },
        { f: "cwe/cwe_697.md", n: "697", t: "Incorrect Comparison (pillar)", h: "682's sibling · what · enough · how" },
        { f: "cwe/cwe_1242.md", n: "1242", t: "Chicken Bits", h: "documented space ⊂ real space · the back-down bit" },
        { f: "cwe/cwe_1254.md", n: "1254", t: "Comparison Granularity", h: "an early exit leaks the time · constant-time comparison" },
        { f: "cwe/cwe_119.md", n: "119", t: "Buffer Bounds (class)", h: "above 787 · four corners: read/write × before/after" },
        { f: "cwe/cwe_1245.md", n: "1245", t: "Improper State Machine", h: "a two-state state machine · the don't-care row · ① and ② as layers" },
        { f: "cwe/cwe_1271.md", n: "1271", t: "Undefined Lock on Reset", h: "waking up without anyone choosing · the first write ends the window" },
        { f: "cwe/cwe_1298.md", n: "1298", t: "Race in Hardware", h: "two paths from one wire · a temporary spike, a permanent fault · MITRE's selector" }
      ]
    }
  ]
};
