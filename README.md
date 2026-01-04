# 📘 Core Product Idea — Grant Execution Infrastructure for Open Source

## 1. Problem Statement

Open-source ecosystems regularly allocate **grant funding** to support critical projects and contributors.  
However, today’s grant execution model has major gaps:

- Grant money is often distributed **off-chain**
- Project maintainers manually manage funds
- Contributor payments are delayed, subjective, or opaque
- Ecosystems lack verifiable proof of how grants translate into real work
- Contributors must trust maintainers or platforms to be paid fairly

Platforms like OnlyDust solve **grant discovery and community coordination**,  
but **grant execution and payout automation remain largely manual**.

---

## 2. Our Core Idea (One Sentence)

> **We build a grant execution layer that converts ecosystem funding into automated, verifiable payments for open-source contributions.**

---

## 3. High-Level Concept

Our platform sits **between ecosystems and contributors**, ensuring that:

1. Ecosystems fund **programs**
2. Programs fund **projects**
3. Projects fund **contributors**
4. All payouts are:
   - escrow-backed
   - rule-based
   - cryptographically verifiable
   - automated on real work completion

---

## 4. System Roles

### Ecosystems (Casper, Cronos, etc.)
- Provide grant capital
- Define program goals and scope
- Gain transparent visibility into outcomes

### Platform (Us)
- Operates grant programs (monthly hacks, quests)
- Selects and allocates grants to projects
- Enforces execution rules
- Automates payouts

### Project Maintainers
- Receive grant allocations
- Lock grants into on-chain escrow
- Create bounties linked to GitHub issues

### Contributors
- Work normally on GitHub
- Submit PRs
- Get paid automatically on successful merges

---

## 5. End-to-End Grant Flow

### Step 1 — Ecosystem Funds a Program
- Ecosystem commits capital to a grant program
- Funds are earmarked for a defined period (e.g. monthly hack)

---

### Step 2 — Program Runs (Hackathon / Quest)
- Projects apply to participate
- Contributors work on eligible projects
- Activity metrics are tracked

---

### Step 3 — Project Selection & Grant Allocation
- Top-performing projects are selected
- Each project receives a grant allocation

> Up to this point, this mirrors existing grant platforms.

---

### Step 4 — Grant Moves into On-Chain Escrow (Key Differentiator)
- Project maintainer locks grant funds into an escrow smart contract
- Funds become:
  - non-custodial
  - transparent
  - rule-bound

---

### Step 5 — Bounty Creation
- Maintainer splits grant into bounties
- Each bounty:
  - is linked to a GitHub issue
  - has a defined reward and deadline
  - is fully escrow-backed

---

### Step 6 — Contribution & Verification
- Contributor submits PR
- PR is reviewed and merged on GitHub
- Backend verifies:
  - merge status
  - issue linkage
  - contributor identity

---

### Step 7 — Automated Payout
- Backend triggers escrow release
- Smart contract pays contributor directly
- Proof of payout is generated and stored

---

## 6. Why This Model Works

### For Ecosystems
- Full transparency into grant usage
- Objective, verifiable impact metrics
- Reduced grant misuse risk

### For Maintainers
- No manual fund management
- Clear budget controls
- Reduced admin overhead

### For Contributors
- Guaranteed payouts
- Fast settlement
- Merit-based rewards

---

## 7. Key Differentiation

| Feature | Traditional Grant Platforms | Our Platform |
|------|----------------------------|-------------|
| Grant discovery | ✅ | ✅ |
| Program management | ✅ | ✅ |
| On-chain escrow | ❌ | ✅ |
| PR-based automation | ❌ | ✅ |
| Merge-triggered payouts | ❌ | ✅ |
| Verifiable proofs | ❌ | ✅ |

---

## 8. Design Principles

- **Escrow-first**: funds are locked before work begins
- **Automation over trust**: payouts triggered by objective signals
- **Minimal on-chain logic**: contracts act as vaults
- **Off-chain intelligence**: verification and logic handled in backend
- **Chain-agnostic**: same execution model across ecosystems

---

## 9. What We Are (and Are Not)

### We Are:
- A grant execution infrastructure
- A payout automation layer
- A coordination system for OSS funding

### We Are Not:
- A DAO
- A marketplace
- A replacement for GitHub
- A centralized custodian

---

## 10. Vision

Our long-term vision is to become the **default execution layer for open-source grants**, enabling ecosystems to move from:

> *“We funded projects”*  
to  
> *“We verifiably paid for real work.”*

---

## 11. One-Line Summary

> **We turn ecosystem grants into automatic, verifiable payments for open-source contributions.**
