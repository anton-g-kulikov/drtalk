# **drTalk: Progressive Onboarding v.2**

Core principles:

* Learning capabilities are open to all users.    
* The practice setup (for both dentists and specialists) is as frictionless as possible.    
* Access to PHI is restricted by practice-owner verification and a paywall/monetization for specialist practices.

Key design decisions: 

* Delayed verification  
* Owner-centric trust  
* Delegated PHI control

# **Onboarding flow**

## **Step 1 — Account creation**

Input:

* First name  
* Last name  
* **corporate email** (personal emails are accepted but not encouraged; they are sent for manual verification by the admin)  
* password

→ Email verification

## **Step 2 — Immediate access**

User lands in dashboard:

Options:

* Discover channels (fully open)  
* Join practice  
* Create practice

## **Step 3 — Create practice**

User (future Practice Owner):

1. Finds existing practice OR creates new  
2. Enters **NPI**  
3. Fills or confirms  
   * personal details  
   * practice details

→ System:

* pulls data from registry  
* auto-fills fields

No verification yet

## **Step 4 — Ownership assignment**

If first member: → `role = owner`

Immediately allowed:

* invite members  
* configure roles  
* operate practice (including communication in internal channels)

Still no PHI access or personal verification

## **Step 5 — Team onboarding**

Owner invites:

* medical personnel → `phi_access = potential`  
* administrative staff → `phi_access = false`

Users join:

* via invite link: account created → auto-join  
* via code: enter code → join immediately  
* via search: request approval (optional fallback)

# **Verification flow (only for Practice Owner)**

## **Critical gate-1: PHI trigger**

Event: First attempt to send / receive referral (PHI)

System checks: IF practice.owner\_verified \== false→ trigger verification flow ELSE  → allow

At PHI trigger: Owner must complete:

* identity verification (Persona)  
* license validation (if needed)  
* NPI confirmation (already partially done)

After success:

* practice.owner\_verified \= true  
* practice.phi\_enabled \= true

# **Paywall timing**

Event: First real referral execution

Sequence:

1. Practice receives referral  
2. System detects PHI \+ external interaction  
3. Then: IF subscription \== false  → show paywall

This is optimised for:

* high intent  
* high perceived value  
* zero early friction

# **Risks**

## **Risk 1 — Fake practices**

Users can:

* create fake practice  
* invite others

Mitigation:

* harmless until PHI stage  
* acceptable tradeoff

## **Risk 2 — Owner bottleneck**

Everything depends on:

* single verified owner

Mitigation:

* This bottleneck is necessary to simplify onboarding across the entire organization while preserving HIPAA compliance.