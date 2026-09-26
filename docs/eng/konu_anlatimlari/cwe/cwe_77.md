# 👾 CWE-77 — Command Injection

> **Data and command travel down the same channel.** A program builds a command by
> putting input from outside into it. If the special characters in the input are
> not neutralised, what was sent as data **changes the command itself**.

| | |
|---|---|
| **Official name** | Improper Neutralization of Special Elements used in a Command ('Command Injection') |
| **Abstraction level** | *Class* |
| **Parent** | CWE-74 — Injection (general) |
| **Its child in the catalogue** | [78](./cwe_78.md) — operating system command |

---

## The Single-Channel Problem

The root of the whole injection family is a single sentence:

> **If data and instructions travel down the same road, the receiver has to tell
> them apart. Whoever knows the rule for telling them apart can turn data into an
> instruction.**

Think of a command line:

```
  intended:     ara  "the word the user typed"
  input:        kelime; başka_komut
  result:       ara kelime; başka_komut
                            └─ now a second COMMAND
```

The semicolon was not data — **it was a separator.** The moment the shell saw it,
it read "a command ends here, a new one starts".

> 🔑 The flaw is not in the input but **in the place where the input is put.** The
> same text written into a file would have been harmless; it gained meaning
> because it was put on a command line.

[Leviathan's lesson 3](../leviathan_komutlari/what_leviathan_teaches.md#lesson-3--command--argument-injection-system)
is the hands-on form of this: user input going into a `system()` call.

---

## Five Children, Five Different "Commands"

This class's children show how different the things called a "command" can be:

| CWE | Where the command runs |
|---|---|
| [**78**](./cwe_78.md) — OS Command Injection | In the operating system shell ✓ *you have it* |
| **88** — Argument Injection | The command stays the same, its **arguments** change |
| **917** — Expression Language Injection | In the application server's expression language |
| **624** — Executable Regular Expression | In the executable part of a regular expression |
| **1427** — LLM Prompting | Inside a language model's **prompt** |

The difference between **88 (argument injection)** and **78** is subtle but
important:

```
  78:  a new COMMAND is added          →  ara kelime; rm ...
  88:  a new FLAG on the same command  →  ara --output=/etc/...
```

In 88 the shell never gets involved. The program may be using `execv()` instead
of `system()` — and still be vulnerable, because the problem is not the shell but
**that the user can shape the argument list.** That is why the advice "do not
use the shell" closes 78 but does not close 88.

**1427 (LLM prompt)** is MITRE recognising the same pattern in a new channel. For
the model, instructions and data travel in the same stream of text; as long as
the rule for telling them apart is unclear, the pattern works exactly the same.
The same problem as the 1978 shell, a new receiver.

---

## Why It Says "Neutralisation"

The official name says *neutralization*, not "filtering". The difference matters:

- **Filtering:** delete whatever looks dangerous. Doomed to be incomplete — you
  can never fully know how many characters are special, and the receiver's rules
  can change.
- **Neutralisation:** **remove the special meaning** of the character — escape it,
  or never let it through that channel at all.

Its strongest form is separating the channel: never putting the data inside the
command text at all.

```
  weak:     system("ara " + girdi)              a single channel
  strong:   execv("/bin/ara", ["ara", girdi])   the data is a separate parameter
```

In the second, whatever the input is, it is an **argument**; there is no context
in which it could be read as a separator.

---

## Why It Has Its Own Page

You do not label a real vulnerability with 77; the most concrete tier is chosen
([the hierarchy rule](./README.md#the-hierarchy-between-cwes)). If it is an
operating system command, [78](./cwe_78.md); if it is an argument, 88.

The reason it has a page is the 78/88 split above: only 78 is written in your
catalogue, and its defence says *"take the shell out of the way"*. That is right
but **not enough** — 88 works without a shell too. Without seeing the umbrella,
that gap goes unnoticed.

---

## How to Prevent It

- **Separate the channel.** Never embed data in the command text; pass it as a
  separate parameter (the `execv` family, prepared statements, API calls).
- **Check the argument list too.** Removing the shell is not enough — if user
  input can turn into a flag, 88 is open. Use the `--` separator, do not let the
  input start with a dash.
- **Use an allow list.** If the expected input is limited (a file name, an ID
  number), define the pattern and reject anything outside it.
- **Drop privileges.** If the command still has to run, reduce the privilege it
  runs with to the minimum.
- **Know the receiver's rules.** Which characters are special depends **on the
  receiver**: the shell, SQL, an expression language, a language model — each has
  its own contract.

---

## Summary — Keep in Mind

```
☐ CWE-77 is a CLASS: input from outside is put inside a command, special characters are not neutralised.
☐ Its root is one sentence: if DATA AND INSTRUCTIONS SHARE A CHANNEL, the receiver has to tell them apart.
☐ The flaw is not in the input but in the PLACE it is put — the same text was harmless in a file.
☐ Its children: 78 (OS shell) · 88 (argument) · 917 (expression language) · 624 (regex) · 1427 (LLM prompt).
☐ The difference between 78 and 88: 78 adds a new COMMAND, 88 adds a new FLAG to the same command.
☐ ⚠️ The advice "do not use the shell" closes 78 but does NOT CLOSE 88 — you can be vulnerable with execv too.
☐ 1427: the same pattern in a language model's prompt. A new receiver, an old problem.
☐ "Neutralisation" ≠ "filtering": not deleting the dangerous part but removing its SPECIAL MEANING.
☐ The strongest defence is separating the channel: never putting the data in the command text.
☐ Which characters are special depends on the RECEIVER — the shell, SQL, an expression language, a model.
```

---

## 🔗 Related Topics

- [CWE-78](./cwe_78.md) — This class's child in the catalogue: OS command injection
- [CWE-706](./cwe_706.md) — A neighbouring pattern: a name resolving to something else
- [What Leviathan Teaches · Lesson 3](../leviathan_komutlari/what_leviathan_teaches.md#lesson-3--command--argument-injection-system) — The hands-on form
- [👾 CWE Map](./README.md) — The index of every CWE

---

*Numbers, official names and abstraction levels are taken from MITRE's CWE list: [cwe.mitre.org](https://cwe.mitre.org).*
