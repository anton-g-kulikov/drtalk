# drtalk: PRD

- Document ID: 1I2Z9-bT9CWaAs4NYJQuG5LVhXCMmuWVLRx0O5NWGGOg
- Revision ID: AIroW37DzYe7zRIuvvI9J0SLVQtlwsQMVh1CnhXnCKbWaMvBL3TXQx1YZdpqdAr0_wAEgoO1bq-sneK3FnwxaOUKshr4jb1XcX74TvNaMGs
- Selected tab: all
- Protected controls: 0
- Opaque controls: 0
- Authoritative dropdowns: 0

Protected-control annotations are preservation instructions. Do not insert their displayed placeholder text to recreate a native control.

## Tab 1 (t.0)

[P00001 | 1:39 | TITLE]
drtalk: Product Requirements Document

[P00002 | 39:40 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00003 | 40:57 | NORMAL_TEXT]
Date: 2026-06-24

[P00004 | 57:94 | NORMAL_TEXT]
Status: Draft for stakeholder review

[P00005 | 94:135 | NORMAL_TEXT]
Prototype: [https://prototype.drtalk.com/](https://prototype.drtalk.com/)

[P00006 | 135:136 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00007 | 136:150 | HEADING_1]
Product Goals

[P00008 | 150:165 | NORMAL_TEXT]
drtalk should:

[P00009 | 165:212 | NORMAL_TEXT | LIST id=kix.u0as7xunwzco level=0]
make practice onboarding fast and low-friction

[P00010 | 212:279 | NORMAL_TEXT | LIST id=kix.u0as7xunwzco level=0]
allow practices to start setup before compliance and payment gates

[P00011 | 279:386 | NORMAL_TEXT | LIST id=kix.u0as7xunwzco level=0]
provide meaningful distinction in experience for referring (dentist) and receiving practices (specialists)

[P00012 | 386:458 | NORMAL_TEXT | LIST id=kix.u0as7xunwzco level=0]
make referral intake simple across app, referral links, email, and eFax

[P00013 | 458:528 | NORMAL_TEXT | LIST id=kix.u0as7xunwzco level=0]
ensure PHI access is controlled by a verified licensed practice owner

[P00014 | 528:592 | NORMAL_TEXT | LIST id=kix.u0as7xunwzco level=0]
give practices a single Activity Center for referral operations

[P00015 | 592:671 | NORMAL_TEXT | LIST id=kix.u0as7xunwzco level=0]
provide clear, lightweight communication with patients and referring practices

[P00016 | 671:762 | NORMAL_TEXT | LIST id=kix.u0as7xunwzco level=0]
allow all users participate in LearningHub, including consuming paid and private resources

[P00017 | 762:763 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00018 | 763:764 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00019 | 764:765 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00020 | 765:766 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00021 | 766:767 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00022 | 767:769 | HEADING_1]
⟦EMPTY PARAGRAPH⟧

[P00023 | 769:788 | HEADING_1]
1. Users And Roles

[P00024 | 788:799 | HEADING_2]
User Roles

[P00025 | 799:821 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=0]
Guest referral sender

[P00026 | 821:837 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=0]
Practice owner:

[P00027 | 837:938 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
full access + access to billing + can remove users and adjust individual user toggles for PHI access

[P00028 | 938:1009 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
must ID Verified (encouraged but not required to be a licensed doctor)

[P00029 | 1009:1105 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
ID Verification for this role must occur for the rest of the roles to be automatically verified

[P00030 | 1105:1138 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
Only one Practice Owner allowed.

[P00031 | 1138:1255 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=0]
Practice admin: full access + access to billing + can remove users and adjust individual user toggles for PHI access

[P00032 | 1255:1288 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
Multiple Practice Admins allowed

[P00033 | 1288:1334 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=0]
Team member: Defaults to full access, except:

[P00034 | 1334:1359 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
can’t control PHI toggle

[P00035 | 1359:1396 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
can’t remove users (can only invite)

[P00036 | 1396:1428 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
does not have access to billing

[P00037 | 1428:1429 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00038 | 1429:1448 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=0]
Individual Learner

[P00039 | 1448:1529 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
This is a separate flow and shouldn’t be as prominent as create/join a practice 

[P00040 | 1529:1706 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
ID verification is not required as a default, but may be required for them to join certain private channels (channel owner will designate if users who join must be ID verified)

[P00041 | 1706:1822 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
They have the option to go from an individual to a member of a practice (or create a practice) from their dashboard

[P00042 | 1822:1978 | NORMAL_TEXT | LIST id=kix.rvmsbx9nq8yc level=1]
They should also be able to ID verify from their dashboard or they will get a hard stop if they try to join a private channel that requires ID verification

[P00043 | 1978:1989 | HEADING_2]
Role Rules

[P00044 | 1989:2127 | NORMAL_TEXT | LIST id=kix.j5u0c3jmp4an level=0]
Each practice has exactly one Practice Owner at a time. Each practice can have multiple Practice Admins as well as multiple Team Members.

[P00045 | 2127:2285 | NORMAL_TEXT | LIST id=kix.j5u0c3jmp4an level=0]
Team members may create the practice initially, but they cannot satisfy the owner requirement unless they are a verified responsible party who becomes owner.

[P00046 | 2285:2383 | NORMAL_TEXT | LIST id=kix.j5u0c3jmp4an level=0]
The Practice Owner must be ID Verified and accept responsibility for their team’s access and use.

[P00047 | 2383:2416 | NORMAL_TEXT | LIST id=kix.j5u0c3jmp4an level=0]
Ownership transfer is supported.

[P00048 | 2416:2418 | HEADING_1]
⟦EMPTY PARAGRAPH⟧

[P00049 | 2418:2451 | HEADING_1]
2. Onboarding And Practice Setup

[P00050 | 2451:2576 | NORMAL_TEXT]
drtalk should let users enter quickly, create or join a practice, and begin setup before hard compliance or payment barriers

[P00051 | 2576:2577 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00052 | 2577:2763 | NORMAL_TEXT]
At entry, onboarding should support three top-level paths: create a practice, join an existing practice, or continue as an individual learner for Learning Hub access without a practice.

[P00053 | 2763:2780 | HEADING_2]
Account creation

[P00054 | 2780:2853 | NORMAL_TEXT | LIST id=kix.ngt91fx22bhp level=0]
Users create an account with first name, last name, email, and password.

[P00055 | 2853:2925 | NORMAL_TEXT | LIST id=kix.ngt91fx22bhp level=0]
Users create an account with Google and Microsoft SSO providers option.

[P00056 | 2925:3086 | NORMAL_TEXT | LIST id=kix.ngt91fx22bhp level=0]
Users make “passive agreement” to drtalk’s Terms & Conditions of Use, Business Associates Agreement, and Copyright Policy upon click of “Create Account” button.

[P00057 | 3086:3124 | NORMAL_TEXT | LIST id=kix.ngt91fx22bhp level=0]
Users verify email before continuing.

[P00058 | 3124:3137 | HEADING_2]
Email policy

[P00059 | 3137:3185 | NORMAL_TEXT | LIST id=kix.78nyfz194yis level=0]
Both corporate and personal emails are allowed.

[P00060 | 3185:3273 | NORMAL_TEXT | LIST id=kix.78nyfz194yis level=0]
Personal-email accounts must be flagged in the drtalk admin panel for potential review.

[P00061 | 3273:3383 | NORMAL_TEXT | LIST id=kix.78nyfz194yis level=0]
Personal-email accounts must not be blocked from registration, verification, practice setup, or subscription.

[P00062 | 3383:3460 | NORMAL_TEXT | LIST id=kix.78nyfz194yis level=0]
Personal-email review is an internal risk signal, not a user-facing blocker.

[P00063 | 3460:3560 | NORMAL_TEXT | LIST id=kix.oy1jaxtdglv9 level=0]
If a user with personal email completes Persona and professional verification – the flag is lifted.

[P00064 | 3560:3578 | HEADING_2]
Practice creation

[P00065 | 3578:3636 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=0]
A user can create a new practice or join an existing one.

[P00066 | 3636:3768 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=0]
Practice setup requires choosing practice type to determine dentist/specialist designation. Available types and their designations:

[P00067 | 3768:3792 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=1]
Assigns ‘Dentist’ type:

[P00068 | 3792:3800 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Dentist

[P00069 | 3800:3818 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Pediatric Dentist

[P00070 | 3818:3831 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Orthodontist

[P00071 | 3831:3858 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=1]
Assigns ‘Specialist’ type:

[P00072 | 3858:3870 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Endodontist

[P00073 | 3870:3899 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Oral & Maxillofacial Surgeon

[P00074 | 3899:3912 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Periodontist

[P00075 | 3912:3927 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Prosthodontist

[P00076 | 3927:3951 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Dental Anesthesiologist

[P00077 | 3951:3968 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Oral Pathologist

[P00078 | 3968:3992 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Dental Business Partner

[P00079 | 3992:4011 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=2]
Dental Laboratory 

[P00080 | 4011:4111 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=0]
Practice setup requires full address with zip code (this data will be used for network suggestions)

[P00081 | 4111:4368 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=0]
eFax numbers that aren’t in Documo will still need to be ported over (process that John manually handles the form shared in Slack). To help flag accounts with eFax numbers that need to be ported over (or created), we will ask about eFax at practice set up.

[P00082 | 4368:4448 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=1]
If they don’t have an eFax, one will be automatically set up for them in Documo

[P00083 | 4448:4557 | NORMAL_TEXT | LIST id=kix.bwbgwzli3463 level=1]
And if they do have an eFax, there will be a TBD flag for John that the manual port process needs to happen 

[P00084 | 4557:4585 | HEADING_2]
Role selection during setup

[P00085 | 4585:4683 | NORMAL_TEXT | LIST id=kix.vy4mcl33ogb7 level=0]
A user creating a practice can identify themselves as Practice Owner, Practice Admin, Team Member

[P00086 | 4683:4854 | NORMAL_TEXT | LIST id=kix.vy4mcl33ogb7 level=0]
It is possible for no Practice Owner to be selected upon set up. In that case, the practice exists without an owner and must show that owner assignment is still required.

[P00087 | 4854:4873 | HEADING_2]
Joining a practice

[P00088 | 4873:4897 | NORMAL_TEXT]
Users may join through:

[P00089 | 4897:4909 | NORMAL_TEXT | LIST id=kix.2tfxxt25ryni level=0]
invite link

[P00090 | 4909:4921 | NORMAL_TEXT | LIST id=kix.2tfxxt25ryni level=0]
invite code

[P00091 | 4921:4947 | NORMAL_TEXT | LIST id=kix.2tfxxt25ryni level=0]
search and request access

[P00092 | 4947:4948 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00093 | 4948:4980 | NORMAL_TEXT]
Join-request approval behavior:

[P00094 | 4980:5177 | NORMAL_TEXT | LIST id=kix.azkwvt3k8p6k level=0]
The Practice Owner must approve the first Practice Admin. Once a Practice Admin is approved for the account, they also have the ability to approve all other Team Members and other Practice Admins.

[P00095 | 5177:5227 | NORMAL_TEXT | LIST id=kix.azkwvt3k8p6k level=0]
A practice admin can approve joining team members

[P00096 | 5227:5299 | NORMAL_TEXT | LIST id=kix.azkwvt3k8p6k level=0]
PHI-sensitive access switches to “On” after practice owner verification

[P00097 | 5299:5561 | NORMAL_TEXT | LIST id=kix.rco45proys4l level=0]
Email notifications are sent to the practice owner (can toggle off) and practice admin (required) when a join request requiring review is submitted. Additional notifications still TBD (e.g. will they see anything on their dashboard or in-platform notifications)

[P00098 | 5561:5623 | NORMAL_TEXT | LIST id=kix.rco45proys4l level=0]
pending join requests visible in Team settings until resolved

[P00099 | 5623:5667 | HEADING_1]
3. Ownership, Verification And Subscription

[P00100 | 5667:5751 | NORMAL_TEXT]
The system needs strong PHI controls without creating unnecessary upfront friction.

[P00101 | 5751:5778 | HEADING_2]
Ownership and verification

[P00102 | 5778:5893 | NORMAL_TEXT | LIST id=kix.5g1nbya2cgj level=0]
Access to PHI, and therefore the ability to receive and process referrals, depends on Practice Owner verification.

[P00103 | 5893:6038 | NORMAL_TEXT | LIST id=kix.5g1nbya2cgj level=0]
Verification is delayed until the practice attempts a PHI-related workflow, including receiving referrals and documents or processing referrals.

[P00104 | 6038:6130 | NORMAL_TEXT | LIST id=kix.5g1nbya2cgj level=0]
The owner completes identity verification and accepts responsibility for the team’s access.

[P00105 | 6130:6367 | NORMAL_TEXT | LIST id=kix.5g1nbya2cgj level=0]
Once owner verification succeeds, PHI access can be enabled for the practice. All practice personnel receive PHI access by default after owner verification. Practice owner and practice admin can toggle PHI access off to any team member.

[P00106 | 6367:6392 | HEADING_2]
Practices without owners

[P00107 | 6392:6443 | NORMAL_TEXT | LIST id=kix.hx4880h8gh8q level=0]
A practice may exist without an owner temporarily.

[P00108 | 6443:6496 | NORMAL_TEXT | LIST id=kix.hx4880h8gh8q level=0]
Such a practice can perform setup and non-PHI tasks.

[P00109 | 6496:6620 | NORMAL_TEXT | LIST id=kix.hx4880h8gh8q level=0]
The product must clearly show that full clinical capability remains locked until a licensed owner is assigned and verified.

[P00110 | 6620:6660 | NORMAL_TEXT | LIST id=kix.hx4880h8gh8q level=0]
Note regarding “Guest Sender Practices”

[P00111 | 6660:7101 | NORMAL_TEXT | LIST id=kix.hx4880h8gh8q level=1]
Each incoming and recognized item is assigned to a SenderPractice. If that practice isn't on a platform, an item is assigned to a GuestSenderPractice. If and when a GuestSenderPractice registers on the platform, all communication associated with their address is ported to the new account and regular channel section. The goal is to have this happen automatically (if that isn’t possible for MVP, current manual process will stay in place).

[P00112 | 7101:7120 | HEADING_2]
Ownership transfer

[P00113 | 7120:7153 | NORMAL_TEXT | LIST id=kix.c933e21rrnp level=0]
Ownership transfer is supported.

[P00114 | 7153:7454 | NORMAL_TEXT | LIST id=kix.c933e21rrnp level=0]
Every ownership transfer triggers a new personal and professional verification flow for the new practice owner. The practice is not locked out of general setup or non-PHI tasks during this transition, but processing new referrals and accessing existing PHI still require completed owner verification.

[P00115 | 7454:7482 | HEADING_2]
Subscription (Monetization)

[P00116 | 7482:7743 | NORMAL_TEXT]
Referral-Triggered TrialRegistration → Practice setup → Verification continuously nudged → Verification becomes mandatory before first referral receipt/execution → First referral triggers start of 30-day trial → CC details are deferred until trial expiration.

[P00117 | 7743:7975 | NORMAL_TEXT]
STILL TO BE DETERMINED: communication cadence outside of the platform (e.g. emails) that let them know to set up their credit card before their trial ends so there is no disruption to service/remind them that their trial is ending 

[P00118 | 7975:8169 | NORMAL_TEXT]
STILL TO BE DETERMINED: Can we move invoicing for Beacon and AZOMS to Stripe invoicing? DIAL finance/accounting support team looking at this; will try to change when the new product launches. 

[P00119 | 8169:8214 | HEADING_1]
4. Referral Intake, Documents And Dashboards

[P00120 | 8214:8225 | HEADING_2]
Core Model

[P00121 | 8225:8842 | NORMAL_TEXT]
drtalk routes referrals, documents, and communication into one structured practice workflow. Referrals remain the primary user-facing object. Shared documents are first-class workflow objects that can exist before, during, or after a referral. Documents are also allowed to exist independent of a referral. Options exist to convert documents to a referral or attach a document to a referral but it is not required. Patients as object will be introduced in the system to connect all relevant information (referrals, documents, communication), but won’t be surfaced in UI until further expansion (e.g. EMR integration)

[P00122 | 8842:9022 | NORMAL_TEXT | LIST id=kix.jxcd92ys2rh0 level=0]
Every referral should preserve sender context (sending practice, sending doctor), destination practice, patient context, source channel, attachments, status, and activity history.

[P00123 | 9022:9242 | NORMAL_TEXT | LIST id=kix.jxcd92ys2rh0 level=0]
Every shared document should preserve channel, sender context (sending practice, sending doctor), file name, file type, size, sent time, optional patient context, optional referral association, and note/message context.

[P00124 | 9242:9358 | NORMAL_TEXT | LIST id=kix.jxcd92ys2rh0 level=0]
The system should be able to relate each referral, document and communication message to a patient (if identified).

[P00125 | 9358:9371 | HEADING_2]
Entry Points

[P00126 | 9371:9398 | NORMAL_TEXT | LIST id=kix.raf4ura0lja0 level=0]
in-app referral submission

[P00127 | 9398:9421 | NORMAL_TEXT | LIST id=kix.raf4ura0lja0 level=0]
external referral link

[P00128 | 9421:9441 | NORMAL_TEXT | LIST id=kix.raf4ura0lja0 level=0]
direct intake email

[P00129 | 9441:9446 | NORMAL_TEXT | LIST id=kix.raf4ura0lja0 level=0]
eFax

[P00130 | 9446:9499 | NORMAL_TEXT | LIST id=kix.raf4ura0lja0 level=0]
standalone document upload from a connected practice

[P00131 | 9499:9558 | NORMAL_TEXT | LIST id=kix.raf4ura0lja0 level=0]
secure message attachment inside an inter-practice channel

[P00132 | 9558:9669 | NORMAL_TEXT]
Note: Per Tom manual entry typically happens in the EMR and is not needed for the drtalk product at this time.

[P00133 | 9669:9685 | HEADING_2]
Sender Identity

[P00134 | 9685:9754 | NORMAL_TEXT | LIST id=kix.pahv7abyka35 level=0]
Senders may log in, sign up, or continue as guests where applicable.

[P00135 | 9754:9816 | NORMAL_TEXT | LIST id=kix.pahv7abyka35 level=0]
Guest referral submission is allowed for low-friction intake.

[P00136 | 9816:9934 | NORMAL_TEXT | LIST id=kix.pahv7abyka35 level=0]
The system should preserve sender context well enough to reconcile the sender if they later become a registered user.

[P00137 | 9934:9948 | HEADING_2]
Referral Form

[P00138 | 9948:10110 | NORMAL_TEXT]
The structured referral form should support sender details, receiving practice, receiving doctor when applicable, patient details, case details, and attachments.

[P00139 | 10110:10247 | NORMAL_TEXT]
When the destination practice has only one receiving doctor, that doctor should be auto-selected rather than requiring manual selection.

[P00140 | 10247:10648 | NORMAL_TEXT]
The exact standard field set should be confirmed with stakeholders and may remain customizable per practice within approved limits. A pre-designed editable PDF (created either by the practice or with help from the drtalk team) can also be uploaded and used instead of the general referral fields that are in the platform. This document can be uploaded directly by the practice or by the drtalk team..

[P00141 | 10648:10665 | HEADING_2]
Shared Documents

[P00142 | 10665:10748 | NORMAL_TEXT]
A shared document is a standalone workflow object, not only a referral attachment.

[P00143 | 10748:10980 | NORMAL_TEXT | LIST id=kix.kxwz1cb7ty2p level=0]
A shared document can be received via platform, email or eFax, can be sent from a dashboard (via platform), attached to a channel message, uploaded from a channel, converted into a referral, or associated with an existing referral.

[P00144 | 10980:11159 | NORMAL_TEXT | LIST id=kix.kxwz1cb7ty2p level=0]
Supported document metadata should include file name, file type, file size, sender context, timestamp, channel, optional patient details, optional referral id, and optional note.

[P00145 | 11159:11318 | NORMAL_TEXT | LIST id=kix.kxwz1cb7ty2p level=0]
Documents shared through inter-practice channels should appear in the message history, the channel Documents tab, and the receiving dashboard Documents inbox.

[P00146 | 11318:11446 | NORMAL_TEXT | LIST id=kix.kxwz1cb7ty2p level=0]
Users should be able to search, preview, download, and send new shared documents from the inter-practice channel Documents tab.

[P00147 | 11446:11491 | HEADING_2]
Sending Documents To Non-Connected Practices

[P00148 | 11491:11659 | NORMAL_TEXT]
Dentist and specialist users should be able to send documents to a practice that is not connected to them on drtalk by using a new secure email address or eFax number.

[P00149 | 11659:11774 | NORMAL_TEXT | LIST id=kix.hah1j5q2y3nb level=0]
The Send Document flow should offer two mutually exclusive destination modes: Network and New Secure Email / eFax.

[P00150 | 11774:11941 | NORMAL_TEXT | LIST id=kix.hah1j5q2y3nb level=0]
Network should support selecting one or more existing practice connections, including external. New Secure Email / eFax should accept one custom destination per send.

[P00151 | 11941:12050 | NORMAL_TEXT | LIST id=kix.hah1j5q2y3nb level=0]
The sender must select Secure Email or Secure Fax and provide the corresponding email address or fax number.

[P00152 | 12050:12188 | NORMAL_TEXT | LIST id=kix.hah1j5q2y3nb level=0]
Secure Email must require a valid email address. Secure Fax must accept common phone-number formatting and require at least seven digits.

[P00153 | 12188:12321 | NORMAL_TEXT | LIST id=kix.hah1j5q2y3nb level=0]
The Send Document action must remain disabled until the destination is valid and at least one document or document name is provided.

[P00154 | 12321:12472 | NORMAL_TEXT | LIST id=kix.hah1j5q2y3nb level=0]
The sender should be able to include the same optional patient details, referral association, and note available when sending to a connected practice.

[P00155 | 12472:12607 | NORMAL_TEXT | LIST id=kix.hah1j5q2y3nb level=0]
On send, drtalk should create or reuse an external inter-practice channel identified by the custom destination and selected transport.

[P00156 | 12607:12737 | NORMAL_TEXT | LIST id=kix.hah1j5q2y3nb level=0]
The external channel should be marked as off-platform and unverified and should appear under External Practices in Communication.

[P00157 | 12737:12905 | NORMAL_TEXT | LIST id=kix.hah1j5q2y3nb level=0]
The sent document and its contextual message should be saved to the external channel so the sending practice has a persistent record and can continue the conversation.

[P00158 | 12905:12925 | HEADING_2]
Document Processing

[P00159 | 12925:13036 | NORMAL_TEXT | LIST id=kix.aos4xxfi12qg level=0]
Opening a document should show sender, received time, file size, secure preview where supported, and download.

[P00160 | 13036:13141 | NORMAL_TEXT | LIST id=kix.aos4xxfi12qg level=0]
For channel-originated documents, the primary follow-up should route users to View & Discuss in Channel.

[P00161 | 13141:13261 | NORMAL_TEXT | LIST id=kix.aos4xxfi12qg level=0]
Specialist users should be able to convert an active document into a new referral or attach it to an existing referral.

[P00162 | 13261:13322 | NORMAL_TEXT | LIST id=kix.aos4xxfi12qg level=0]
Additional actions are: archive document or mark it as spam.

[P00163 | 13322:13444 | NORMAL_TEXT | LIST id=kix.aos4xxfi12qg level=0]
Dentist users should be able to review incoming documents and continue the discussion in the relevant specialist channel.

[P00164 | 13444:13564 | NORMAL_TEXT | LIST id=kix.aos4xxfi12qg level=0]
Both types of users should be able to forward a document to connected practices or to a new recipient via secure email.

[P00165 | 13564:13633 | NORMAL_TEXT | LIST id=kix.aos4xxfi12qg level=0]
Completing either action removes the document from the active inbox.

[P00166 | 13633:13651 | HEADING_2]
Dentist Dashboard

[P00167 | 13651:13773 | NORMAL_TEXT]
The dentist dashboard is the referring practice command surface for immediate actions, alerts, and lightweight reporting.

[P00168 | 13773:13885 | NORMAL_TEXT | LIST id=kix.yjw32ehzrpxd level=0]
It should foreground quick actions: Send a Referral, Send Document, Recent Conversations, Suggested Connections

[P00169 | 13885:14039 | NORMAL_TEXT | LIST id=kix.yjw32ehzrpxd level=0]
It should show summary reporting such as Patients Referred, Patients Scheduled, Patients Released (Specialty Care Complete), Number of drtalk Connections

[P00170 | 14039:14172 | NORMAL_TEXT | LIST id=kix.yjw32ehzrpxd level=0]
It should show recent referrals (patients referred) as a short operational snapshot; complete tracking belongs on the Patients page.

[P00171 | 14172:14300 | NORMAL_TEXT | LIST id=kix.yjw32ehzrpxd level=0]
Recently received Documents should be shown above “Patients Referred” and follow the document processing flow as outlined above

[P00172 | 14300:14420 | NORMAL_TEXT | LIST id=kix.yjw32ehzrpxd level=0]
Referral-related dashboard cards should route to the relevant specialist channel when communication is the next action.

[P00173 | 14420:14441 | HEADING_2]
Specialist Dashboard

[P00174 | 14441:14544 | NORMAL_TEXT]
The specialist dashboard is the receiving practice Activity Center for immediate action and reporting.

[P00175 | 14544:14745 | NORMAL_TEXT | LIST id=kix.mko973c0r51u level=0]
It should foreground Send Document, and quick actions for recent conversations and suggested connections. It should also flag if they are still in their “free trial” period and how many days are left.

[P00176 | 14745:14881 | NORMAL_TEXT | LIST id=kix.mko973c0r51u level=0]
It should show summary reporting such as referrals received, referrals scheduled, referrals released, and number of drtalk connections.

[P00177 | 14881:15041 | NORMAL_TEXT | LIST id=kix.mko973c0r51u level=0]
It should separate inbound documents from referrals so documents can be triaged before they become case work. Referrals should be shown first on the dashboard.

[P00178 | 15041:15152 | NORMAL_TEXT | LIST id=kix.mko973c0r51u level=0]
Users should be able to convert an incoming document into a new referral or attach it to an existing referral.

[P00179 | 15152:15360 | NORMAL_TEXT | LIST id=kix.mko973c0r51u level=0]
Referral cards on the dashboard should represent urgent work queues, not complete historical tracking. It should surface new referrals requiring acceptance as well as referrals with newly received documents.

[P00180 | 15360:15375 | HEADING_2]
Referrals Page

[P00181 | 15375:15461 | NORMAL_TEXT]
The Referrals page is the dedicated referral workspace, separate from the dashboards.

[P00182 | 15461:15609 | NORMAL_TEXT | LIST id=kix.rnt3p7xd09fz level=0]
Dentist view (shown as Patients): send and track outbound referrals by status, with tabs for Referred, Accepted, Scheduled, Released, and Archived.

[P00183 | 15609:15775 | NORMAL_TEXT | LIST id=kix.rnt3p7xd09fz level=0]
Specialist view (shown as Referrals): receive, review, and process referrals by status, with tabs for Received (Review), Accepted, Scheduled, Released, and Archived.

[P00184 | 15775:15945 | NORMAL_TEXT | LIST id=kix.rnt3p7xd09fz level=0]
It should provide referral-specific stats, status tabs, search, filters (including date filters), a full referral list, and links to referral detail or related channels.

[P00185 | 15945:16127 | NORMAL_TEXT | LIST id=kix.rnt3p7xd09fz level=0]
The specialist view should expose the direct intake email and public referral URL with a simple explanation how that would work for the sending party (e.g. hover state description).

[P00186 | 16127:16179 | NORMAL_TEXT | LIST id=kix.rnt3p7xd09fz level=0]
The dentist's view has a button to refer a patient.

[P00187 | 16179:16180 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00188 | 16180:16198 | HEADING_2]
Intake Processing

[P00189 | 16198:16259 | NORMAL_TEXT | LIST id=kix.f4txsxeodfed level=0]
In-app and referral-link submissions are already structured.

[P00190 | 16259:16327 | NORMAL_TEXT | LIST id=kix.f4txsxeodfed level=0]
Email and eFax inputs pass through an AI-assisted extraction layer.

[P00191 | 16327:16490 | NORMAL_TEXT | LIST id=kix.f4txsxeodfed level=0]
Email, eFax, and secure-message attachments should auto-populate core patient fields such as patient name and date of birth whenever extraction confidence allows.

[P00192 | 16490:16651 | NORMAL_TEXT | LIST id=kix.f4txsxeodfed level=0]
The intake pipeline should minimize unknown referrals by prefilling structured referral records as completely as possible from inbound messages and attachments.

[P00193 | 16651:16753 | NORMAL_TEXT | LIST id=kix.f4txsxeodfed level=0]
Still unrecognized items that are not marked as spam should be surfaced for the user's manual triage.

[P00194 | 16753:16875 | NORMAL_TEXT | LIST id=kix.f4txsxeodfed level=0]
Secure-email attachments should be openable directly inside drtalk rather than forcing users back to an inbox experience.

[P00195 | 16875:16891 | HEADING_2]
Referral States

[P00196 | 16891:16984 | NORMAL_TEXT]
The product should distinguish inbound specialist operations from outbound dentist tracking.

[P00197 | 16984:17071 | NORMAL_TEXT | LIST id=kix.gvc5map8x60z level=0]
Inbound specialist states: Received (Review), Accepted, Scheduled, Released, Archived.

[P00198 | 17071:17146 | NORMAL_TEXT | LIST id=kix.gvc5map8x60z level=0]
Outbound dentist states:Referred, Accepted, Scheduled, Released, Archived.

[P00199 | 17146:17213 | NORMAL_TEXT | LIST id=kix.gvc5map8x60z level=0]
Distinct reroute and decline referral options remain out of scope.

[P00200 | 17213:17214 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00201 | 17214:17253 | HEADING_2]
Referral case statuses/Workflow stages

[P00202 | 17256:17271 | NORMAL_TEXT | TABLE row=0 col=0]
Dentist Status

[P00203 | 17272:17290 | NORMAL_TEXT | TABLE row=0 col=1]
Specialist Status

[P00204 | 17291:17301 | NORMAL_TEXT | TABLE row=0 col=2]
Next Step

[P00205 | 17302:17327 | NORMAL_TEXT | TABLE row=0 col=3]
Workflow Stage & Context

[P00206 | 17329:17338 | NORMAL_TEXT | TABLE row=1 col=0]
Referred

[P00207 | 17339:17357 | NORMAL_TEXT | TABLE row=1 col=1]
Received (Review)

[P00208 | 17358:17526 | NORMAL_TEXT | TABLE row=1 col=2]
Status moves to “Accepted” for both Dentist and Specialist automatically once Specialist opens the referral (patient sub-channel with automated message also triggered)

[P00209 | 17527:17601 | NORMAL_TEXT | TABLE row=1 col=3]
The referral is received via digital intake for the specialist to review.

[P00210 | 17603:17612 | NORMAL_TEXT | TABLE row=2 col=0]
Accepted

[P00211 | 17613:17622 | NORMAL_TEXT | TABLE row=2 col=1]
Accepted

[P00212 | 17623:17673 | NORMAL_TEXT | TABLE row=2 col=2]
Specialist manually changes status to “Scheduled”

[P00213 | 17674:17833 | NORMAL_TEXT | TABLE row=2 col=3]
The specialist starts working on the case and coordinates appointment scheduling. “Working On” will not be a stage but a dropdown for specialist internal use.

[P00214 | 17835:17845 | NORMAL_TEXT | TABLE row=3 col=0]
Scheduled

[P00215 | 17846:17856 | NORMAL_TEXT | TABLE row=3 col=1]
Scheduled

[P00216 | 17857:17906 | NORMAL_TEXT | TABLE row=3 col=2]
Specialist manually changes status to “Released”

[P00217 | 17907:18001 | NORMAL_TEXT | TABLE row=3 col=3]
The patient's appointment is confirmed, and treatment is underway at the specialist's office.

[P00218 | 18003:18012 | NORMAL_TEXT | TABLE row=4 col=0]
Released

[P00219 | 18013:18022 | NORMAL_TEXT | TABLE row=4 col=1]
Released

[P00220 | 18023:18164 | NORMAL_TEXT | TABLE row=4 col=2]
After the patient is released their status management is done separately by the Dentist and Specialist (manually). Final step is to Archive.

[P00221 | 18165:18349 | NORMAL_TEXT | TABLE row=4 col=3]
Clinical treatment by the specialist is complete. Post-op reports and files are sent back to the dentist for review. Dentist determines if “post-specialty restorative care” is needed.

[P00222 | 18351:18360 | NORMAL_TEXT | TABLE row=5 col=0]
Archived

[P00223 | 18361:18370 | NORMAL_TEXT | TABLE row=5 col=1]
Archived

[P00224 | 18371:18572 | NORMAL_TEXT | TABLE row=5 col=2]
Reopen Case using button OR if the other practice has not Archived on their end and posts a message or document in the patient channel the case will automatically reopen for the side that has Archived

[P00225 | 18573:18617 | NORMAL_TEXT | TABLE row=5 col=3]
The case is closed out of active pipelines.

[P00226 | 18618:18619 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00227 | 18619:18620 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00228 | 18620:18651 | HEADING_2]
Referral List And Detail Views

[P00229 | 18651:18774 | NORMAL_TEXT | LIST id=kix.c28bty66nagy level=0]
Referral lists should support status tabs, search, date range, urgency, source, practice filters, sorting, and pagination.

[P00230 | 18774:18970 | NORMAL_TEXT | LIST id=kix.c28bty66nagy level=0]
Referral rows should show enough context to act quickly, including patient, urgency, source or REF number, referring or receiving practice, assigned doctor when available, and last activity date.

[P00231 | 18970:19162 | NORMAL_TEXT | LIST id=kix.c28bty66nagy level=0]
Referral detail should support status changes, assignment, internal notes, missing-data review, attached document viewing, and direct links to the related case chat and patient communication.

[P00232 | 19162:19163 | HEADING_2]
⟦EMPTY PARAGRAPH⟧

[P00233 | 19163:19207 | HEADING_2]
Referral Detail Page (Specialist View Only)

[P00234 | 19207:19390 | NORMAL_TEXT]
The referral detail page should serve as the full working view of a single referral and combine structured clinical data, documents, case actions, and activity history in one screen.

[P00235 | 19390:19408 | NORMAL_TEXT | LIST id=kix.oirazttnyomo level=0]
It should include

[P00236 | 19408:19440 | NORMAL_TEXT | LIST id=kix.oirazttnyomo level=1]
referral data and patient name,

[P00237 | 19440:19462 | NORMAL_TEXT | LIST id=kix.oirazttnyomo level=1]
missing data warnings

[P00238 | 19462:19488 | NORMAL_TEXT | LIST id=kix.oirazttnyomo level=1]
editable case information

[P00239 | 19488:19505 | NORMAL_TEXT | LIST id=kix.oirazttnyomo level=1]
document preview

[P00240 | 19505:19535 | NORMAL_TEXT | LIST id=kix.oirazttnyomo level=1]
status and ability to change,

[P00241 | 19535:19589 | NORMAL_TEXT | LIST id=kix.oirazttnyomo level=1]
the option to specify a team member working on a case

[P00242 | 19589:19627 | NORMAL_TEXT | LIST id=kix.oirazttnyomo level=1]
activity history, and internal notes.

[P00243 | 19627:19712 | NORMAL_TEXT | LIST id=kix.oirazttnyomo level=0]
It should serve as a gateway to inter-practice communication regarding related case.

[P00244 | 19712:19713 | HEADING_1]
⟦EMPTY PARAGRAPH⟧

[P00245 | 19713:19715 | HEADING_1]
⟦EMPTY PARAGRAPH⟧

[P00246 | 19715:19732 | HEADING_1]
5. Communication

[P00247 | 19732:19752 | HEADING_2]
Communication Model

[P00248 | 19752:19898 | NORMAL_TEXT]
drtalk communication is organized around channels so practices can coordinate referrals, documents, patients, and internal work in one workspace.

[P00249 | 19898:20002 | NORMAL_TEXT | LIST id=kix.9mtdkyysnrvx level=0]
Internal practice channels should support coordination among all practice members or a selected subset.

[P00250 | 20002:20140 | NORMAL_TEXT | LIST id=kix.9mtdkyysnrvx level=0]
Inter-practice channels should support dentist-specialist coordination at both the practice level and the individual referral-case level.

[P00251 | 20140:20254 | NORMAL_TEXT | LIST id=kix.9mtdkyysnrvx level=0]
External-practice channels should allow communication with off-platform practices through secure email transport.

[P00252 | 20254:20320 | NORMAL_TEXT | LIST id=kix.9mtdkyysnrvx level=0]
Patient communication channels should support email and SMS/text.

[P00253 | 20320:20436 | NORMAL_TEXT | LIST id=kix.9mtdkyysnrvx level=0]
Group channels should allow selected users from one or more practices to coordinate outside a single referral case.

[P00254 | 20436:20478 | HEADING_2]
Channel Navigation And Case Conversations

[P00255 | 20478:20601 | NORMAL_TEXT | LIST id=kix.itv9v5pj91bm level=0]
Channels should be grouped into Internal, Connected Practices, External Practices, Patient Communication, and Group Chats.

[P00256 | 20601:20743 | NORMAL_TEXT | LIST id=kix.itv9v5pj91bm level=0]
The channel list should support unread counts, collapsed and expanded groups, and search by practice, channel, patient, or case (REF number).

[P00257 | 20743:20931 | NORMAL_TEXT | LIST id=kix.itv9v5pj91bm level=0]
When a receiving practice reviews a referral, drtalk should automatically create the related patient-specific case communication channel and change the status to Accepted upon first open.

[P00258 | 20931:21045 | NORMAL_TEXT | LIST id=kix.itv9v5pj91bm level=0]
Connected and external practice channels should contain patient-specific case conversations for active referrals.

[P00259 | 21045:21212 | NORMAL_TEXT | LIST id=kix.itv9v5pj91bm level=0]
Users should be able to open the relevant practice, case, and Messages or Documents view directly from dashboards, referrals, documents, and Practice Network actions.

[P00260 | 21212:21322 | NORMAL_TEXT | LIST id=kix.itv9v5pj91bm level=0]
Case conversations should be archivable and reactivatable without deleting their message or document history.

[P00261 | 21322:21356 | HEADING_2]
Messages, Participants And Groups

[P00262 | 21356:21442 | NORMAL_TEXT | LIST id=kix.hu94oxk0fxp2 level=0]
Users should be able to send chat messages and document attachments within a channel.

[P00263 | 21442:21594 | NORMAL_TEXT | LIST id=kix.hu94oxk0fxp2 level=0]
Messages should preserve sender, timestamp, transport, channel, optional patient context, optional referral association, and optional document context.

[P00264 | 21594:21735 | NORMAL_TEXT | LIST id=kix.hu94oxk0fxp2 level=0]
Each practice should be able to manage which team members participate in an inter-practice channel, subject to role and PHI-access controls.

[P00265 | 21735:21808 | NORMAL_TEXT | LIST id=kix.hu94oxk0fxp2 level=0]
Group creation should require a group name and at least one participant.

[P00266 | 21808:21898 | NORMAL_TEXT | LIST id=kix.hu94oxk0fxp2 level=0]
Message actions should support reply, forward, pin or unpin, copy, delete, and reactions.

[P00267 | 21898:21985 | NORMAL_TEXT | LIST id=kix.hu94oxk0fxp2 level=0]
Pinned messages should remain visible at the top of the active channel until unpinned.

[P00268 | 21985:22117 | NORMAL_TEXT | LIST id=kix.hu94oxk0fxp2 level=0]
Practice-level channels may include user-created subchannels for focused coordination with the same connected or external practice.

[P00269 | 22117:22134 | HEADING_2]
Shared Documents

[P00270 | 22134:22306 | NORMAL_TEXT | LIST id=kix.g9k83isq8uxf level=0]
Inter-practice channels should expose Messages and Documents and Archived Conversations as separate tabs while also showing document attachments inline in message history.

[P00271 | 22306:22454 | NORMAL_TEXT | LIST id=kix.g9k83isq8uxf level=0]
The Documents tab should support channel-scoped search, preview, download, upload or send-new-document, pagination, and archive or restore actions.

[P00272 | 22454:22607 | NORMAL_TEXT | LIST id=kix.g9k83isq8uxf level=0]
Sending a document should create both a shared document record and a contextual channel message, as well as populate as a new document on the Dashboard.

[P00273 | 22607:22692 | NORMAL_TEXT | LIST id=kix.g9k83isq8uxf level=0]
Direct document sends may include patient details, referral association, and a note.

[P00274 | 22692:22867 | NORMAL_TEXT | LIST id=kix.g9k83isq8uxf level=0]
Direct document sends should support one or more recipients and should distinguish drtalk recipients from external recipients reached by secure email or fax where applicable.

[P00275 | 22867:22990 | NORMAL_TEXT | LIST id=kix.g9k83isq8uxf level=0]
Document sends should allow a referral association, patient details, and a short message when those details are available.

[P00276 | 22990:23012 | HEADING_2]
Patient Communication

[P00277 | 23012:23167 | NORMAL_TEXT | LIST id=kix.1ihfpiyil0ov level=0]
Practice-to-Patient channels are created only when a user starts patient communication by clicking the “Message a Patient” button on a referral case page.

[P00278 | 23167:23227 | NORMAL_TEXT | LIST id=kix.1ihfpiyil0ov level=0]
When a patient channel is created, its first message reads:

[P00279 | 23227:23383 | NORMAL_TEXT | LIST id=kix.1ihfpiyil0ov level=1]
Welcome to [practice name]! By continuing this conversation, you consent to communicate with our office via text message. Message and data rates may apply.

[P00280 | 23383:23427 | NORMAL_TEXT]
To best assist you, please reply with your:

[P00281 | 23427:23445 | NORMAL_TEXT]
·       Full Name

[P00282 | 23445:23480 | NORMAL_TEXT]
·       Date of Birth (MM/DD/YYYY)

[P00283 | 23480:23636 | NORMAL_TEXT]
Please do not use text messaging for urgent matters. If you are experiencing a medical emergency, call 911 immediately or go to the nearest emergency room.

[P00284 | 23636:23753 | NORMAL_TEXT]
We look forward to assisting you and will respond to your message as soon as possible during regular business hours.

[P00285 | 23753:23796 | NORMAL_TEXT]
You may reply STOP at any time to opt out.

[P00286 | 23796:23857 | NORMAL_TEXT | LIST id=kix.1ihfpiyil0ov level=0]
Patient notifications should default to email plus SMS/text.

[P00287 | 23857:23944 | NORMAL_TEXT | LIST id=kix.1ihfpiyil0ov level=0]
Practices should be able to choose email, SMS/text, or both where the workflow allows.

[P00288 | 23944:24050 | NORMAL_TEXT | LIST id=kix.1ihfpiyil0ov level=0]
Referral status notifications to patients should be delayed by 5 to 15 minutes, configurable by practice.

[P00289 | 24050:24074 | HEADING_2]
Access And Verification

[P00290 | 24074:24215 | NORMAL_TEXT | LIST id=kix.ub4n4nbgo0ub level=0]
PHI sharing through any channel must respect Practice Owner verification, subscription state, user role, and individual PHI-access controls.

[P00291 | 24215:24358 | NORMAL_TEXT | LIST id=kix.ub4n4nbgo0ub level=0]
When a practice cannot receive PHI, the channel should clearly communicate the restriction to both sides before a message or document is sent.

[P00292 | 24358:24360 | HEADING_1]
⟦EMPTY PARAGRAPH⟧

[P00293 | 24360:24380 | HEADING_1]
6. Practice Network

[P00294 | 24380:24391 | HEADING_2]
Core Model

[P00295 | 24391:24515 | NORMAL_TEXT]
Practice Network is the relationship, discovery, and performance workspace for connected and prospective practice partners.

[P00296 | 24515:24586 | NORMAL_TEXT | LIST id=kix.eidyvejll4zq level=0]
Specialists should see referring dental practices in Practice Network.

[P00297 | 24586:24654 | NORMAL_TEXT | LIST id=kix.eidyvejll4zq level=0]
Dentists should see specialist practices in the Specialist Network.

[P00298 | 24654:24735 | NORMAL_TEXT | LIST id=kix.eidyvejll4zq level=0]
Both experiences should provide Analytics, My Network, and Connect & Grow views.

[P00299 | 24735:24746 | HEADING_2]
My Network

[P00300 | 24746:24951 | NORMAL_TEXT | LIST id=kix.n96h3cq3jsnk level=0]
My Network should show connected practices (on drtalk platform as well as external contacts) and provide direct actions to start a conversation, send a referral where applicable, or open practice details.

[P00301 | 24951:25073 | NORMAL_TEXT | LIST id=kix.n96h3cq3jsnk level=0]
The specialist view should distinguish on-platform practices from external practices reached through fax or secure email.

[P00302 | 25073:25192 | NORMAL_TEXT | LIST id=kix.n96h3cq3jsnk level=0]
Users should be able to invite a practice that is not yet on drtalk and that should be given prominence as applicable.

[P00303 | 25192:25207 | HEADING_2]
Connect & Grow

[P00304 | 25207:25336 | NORMAL_TEXT | LIST id=kix.osnwl14nbar4 level=0]
Users should be able to search by practice name or specialty and filter results to all eligible practices or nearby suggestions.

[P00305 | 25336:25421 | NORMAL_TEXT | LIST id=kix.osnwl14nbar4 level=0]
Directory filters should support practice type, city, state, and distance or radius.

[P00306 | 25421:25503 | NORMAL_TEXT | LIST id=kix.osnwl14nbar4 level=0]
Connected practices should be removable from My Network, subject to confirmation.

[P00307 | 25503:25582 | NORMAL_TEXT | LIST id=kix.osnwl14nbar4 level=0]
Suggestions should combine practice designation, specialty, and location data.

[P00308 | 25582:25844 | NORMAL_TEXT | LIST id=kix.osnwl14nbar4 level=0]
Already connected practices and practices that declined or were dismissed as not interested should be excluded. Dismissed suggestions will not be hidden from the 'directory'; they will only be removed from the 'nearby/suggest' list but kept in 'all practices.' 

[P00309 | 25844:25971 | NORMAL_TEXT | LIST id=kix.osnwl14nbar4 level=0]
Recommendations should prioritize practices within 100 miles of the practice zip code and should not exceed a 300-mile radius.

[P00310 | 25971:26031 | NORMAL_TEXT | LIST id=kix.osnwl14nbar4 level=0]
Interstate connections and communication should be allowed.

[P00311 | 26031:26123 | NORMAL_TEXT | LIST id=kix.osnwl14nbar4 level=0]
Pending or ignored invitations should remain visible until the receiving practice declines.

[P00312 | 26123:26140 | HEADING_2]
Practice Actions

[P00313 | 26140:26204 | NORMAL_TEXT | LIST id=kix.k2kw3r20q3gl level=0]
Connected dentists should be able to Send Referral or Chat Now.

[P00314 | 26204:26346 | NORMAL_TEXT | LIST id=kix.k2kw3r20q3gl level=0]
Dentists should be able to Connect with a directory result or Refer & Connect when initiating a referral to a practice outside their network.

[P00315 | 26346:26457 | NORMAL_TEXT | LIST id=kix.k2kw3r20q3gl level=0]
Specialists should be able to open a connected-practice chat or send a secure message to an external practice.

[P00316 | 26457:26615 | NORMAL_TEXT | LIST id=kix.k2kw3r20q3gl level=0]
Practice cards should show connection status, specialty, practice designation, location, verification status, and external-transport status where applicable.

[P00317 | 26615:26633 | HEADING_2]
Network Analytics

[P00318 | 26633:26726 | NORMAL_TEXT | LIST id=kix.sruzl7a0ir5g level=0]
Analytics should support Today, Last 7 Days, Last 30 Days, Last 90 Days, and Last 12 Months 

[P00319 | 26726:26817 | NORMAL_TEXT | LIST id=kix.sruzl7a0ir5g level=0]
Each KPI should display a change value and a trend as a comparison of the selected period.

[P00320 | 26817:26948 | NORMAL_TEXT | LIST id=kix.sruzl7a0ir5g level=0]
Dentist reporting should summarize patient sent, scheduled, released from specialty care, and conversion rate (sent to scheduled).

[P00321 | 26948:27092 | NORMAL_TEXT | LIST id=kix.sruzl7a0ir5g level=0]
Specialist reporting should summarize referrals received, scheduled, released from specialty care, and conversion rate (received to scheduled).

[P00322 | 27092:27193 | NORMAL_TEXT | LIST id=kix.sruzl7a0ir5g level=0]
Users should be able to review the same funnel by connected practice and export or print the report.

[P00323 | 27193:27195 | HEADING_1]
⟦EMPTY PARAGRAPH⟧

[P00324 | 27195:27232 | HEADING_1]
7. User Profiles & Practice Settings

[P00325 | 27232:27245 | HEADING_2]
User Profile

[P00326 | 27245:27366 | NORMAL_TEXT | LIST id=kix.x17jng6h5bju level=0]
Each user should be able to manage first name, last name, display name, email address, mobile number, and profile photo.

[P00327 | 27366:27478 | NORMAL_TEXT | LIST id=kix.x17jng6h5bju level=0]
The display name should be used consistently across messages, referrals, activity history, and team management.

[P00328 | 27478:27637 | NORMAL_TEXT | LIST id=kix.x17jng6h5bju level=0]
Users should be able to enable SMS reminders only when a valid mobile number is available. More detailed individual user notification preference settings TBD.

[P00329 | 27637:27666 | HEADING_2]
Practice Settings Core Model

[P00330 | 27666:27844 | NORMAL_TEXT]
Practice Settings is the administrative workspace for practice identity, referral intake settings, notification preferences, team access, ownership, and subscription management.

[P00331 | 27844:27968 | NORMAL_TEXT | LIST id=kix.wos9qknjx6ws level=0]
Settings should be available in both dentist and specialist experiences, with role-specific options where workflows differ.

[P00332 | 27968:28079 | NORMAL_TEXT | LIST id=kix.wos9qknjx6ws level=0]
Access to settings and administrative actions must follow the user roles and permissions defined in section 1.

[P00333 | 28079:28226 | NORMAL_TEXT | LIST id=kix.wos9qknjx6ws level=0]
Dentist practice should manage only free features: Practice profile, Patient (Referral) Notification, and Team, Roles and Access control settings.

[P00334 | 28226:28313 | NORMAL_TEXT | LIST id=kix.wos9qknjx6ws level=0]
Settings should show only the options available to the current practice type and role.

[P00335 | 28313:28517 | NORMAL_TEXT | LIST id=kix.wos9qknjx6ws level=0]
Specialist practices should manage referral intake and subscription settings; dentist practices should be limited to the free settings needed for profile, patient referral notifications, and team access.

[P00336 | 28517:28534 | HEADING_2]
Practice Profile

[P00337 | 28534:28687 | NORMAL_TEXT | LIST id=kix.m1eldakxzzmj level=0]
Practice profile should support practice name, practice type or specialty designation, phone number, website, street address, city, state, and ZIP code.

[P00338 | 28687:28837 | NORMAL_TEXT | LIST id=kix.m1eldakxzzmj level=0]
Practice type should use a controlled list that includes general dentists, recognized dental specialties, and supported dental partner organizations.

[P00339 | 28837:28996 | NORMAL_TEXT | LIST id=kix.m1eldakxzzmj level=0]
Practice profile data should be used consistently in Practice Network discovery, referral routing, communication, and externally visible practice information.

[P00340 | 28996:29145 | NORMAL_TEXT | LIST id=kix.m1eldakxzzmj level=0]
The assigned eFax number should be shown when included in the practice subscription; otherwise the setting should explain the required plan upgrade.

[P00341 | 29145:29146 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00342 | 29146:29162 | HEADING_2]
Referral Intake

[P00343 | 29162:29283 | NORMAL_TEXT | LIST id=kix.xiopjxo5wfnu level=0]
Receiving practices should be able to view and copy their dedicated intake email, eFax number, and public referral link.

[P00344 | 29283:29408 | NORMAL_TEXT | LIST id=kix.xiopjxo5wfnu level=0]
Email and eFax sent to the assigned intake channels should enter the secure referral intake pipeline described in section 4.

[P00345 | 29408:29510 | NORMAL_TEXT | LIST id=kix.xiopjxo5wfnu level=0]
The public referral link should allow an external sender to submit securely without a drtalk account.

[P00346 | 29510:29647 | NORMAL_TEXT | LIST id=kix.xiopjxo5wfnu level=0]
Practices should be able to upload, replace, download, or remove one current PDF referral sheet template for external referring offices.

[P00347 | 29647:29809 | NORMAL_TEXT | LIST id=kix.xiopjxo5wfnu level=0]
Referral sheet upload should accept PDF files only and enforce the supported file-size limit. The PDF must have editable fields already created to work properly.

[P00348 | 29809:29908 | NORMAL_TEXT | LIST id=kix.xiopjxo5wfnu level=0]
Availability of eFax and other premium intake channels should follow the active subscription plan.

[P00349 | 29908:29931 | HEADING_2]
Referral Notifications

[P00350 | 29931:30119 | NORMAL_TEXT]
Patient notification settings should be organized around the two patient-facing case events: Case Sent and Case Accepted, with controls appropriate to the referring or receiving practice.

[P00351 | 30119:30273 | NORMAL_TEXT | LIST id=kix.7suffs4t4w01 level=0]
Patient Case Sent and Case Accepted notifications should be enabled by default for both email and SMS/text, where the patient has a valid contact method.

[P00352 | 30273:30466 | NORMAL_TEXT | LIST id=kix.7suffs4t4w01 level=0]
Dentist and specialist practices should be able to configure patient notifications independently by event and select email, SMS/text, or both, subject to available patient contact information.

[P00353 | 30466:30588 | NORMAL_TEXT | LIST id=kix.7suffs4t4w01 level=0]
Dentist practices should configure the patient’s Case Sent notification, sent after a referral is successfully submitted.

[P00354 | 30588:30974 | NORMAL_TEXT | LIST id=kix.7suffs4t4w01 level=0]
Receiving practices should configure the patient’s Case Accepted notification, sent after the referral is automatically accepted when the receiving practice opens the case. Separately, specialist practices should configure registered-sender notifications by in-app message and email, non-user confirmation by secure email, and fax/email-sender confirmation by fax-back or secure email.

[P00355 | 30974:31152 | NORMAL_TEXT | LIST id=kix.7suffs4t4w01 level=0]
Receiving practices should be able to apply a configurable 5-to-15-minute delay before the Case Accepted notification is sent, allowing accidental case openings to be corrected.

[P00356 | 31152:31331 | NORMAL_TEXT | LIST id=kix.7suffs4t4w01 level=0]
Patients should not be notified about other referral case status changes. Patient notifications are limited to Case Sent and Case Accepted, when the related settings are enabled.

[P00357 | 31331:31353 | HEADING_2]
Internal notification

[P00358 | 31353:31354 | NORMAL_TEXT | LIST id=kix.338vt2vv9p4k level=0]
⟦EMPTY PARAGRAPH⟧

[P00359 | 31354:31355 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00360 | 31355:31386 | HEADING_2]
Team, Roles And Access Control

[P00361 | 31386:31509 | NORMAL_TEXT | LIST id=kix.k0ublzr23s4v level=0]
Practice owners and practice admins should be able to view the team roster, member role, PHI-access status, and join date.

[P00362 | 31509:31598 | NORMAL_TEXT | LIST id=kix.k0ublzr23s4v level=0]
Authorized users should be able to invite team members and review pending join requests.

[P00363 | 31598:31690 | NORMAL_TEXT | LIST id=kix.k0ublzr23s4v level=0]
All join requests should be confirmable or ignorable by Practice Admins and Practice Owner.

[P00364 | 31690:31827 | NORMAL_TEXT | LIST id=kix.k0ublzr23s4v level=0]
When approving a join request, authorized users should be able to adjust the requested role and PHI access before confirming the member.

[P00365 | 31827:31998 | NORMAL_TEXT | LIST id=kix.k0ublzr23s4v level=0]
Practice Owners and Practice Admins should be able to assign Practice Admin or Team Member roles and independently enable or restrict PHI access for each non-owner user. 

[P00366 | 31998:32132 | NORMAL_TEXT | LIST id=kix.k0ublzr23s4v level=0]
Team Members should receive PHI access by default after Practice Owner verification, unless an authorized administrator restricts it.

[P00367 | 32132:32241 | NORMAL_TEXT | LIST id=kix.k0ublzr23s4v level=0]
Practice Owner PHI access is mandatory and cannot be disabled. It is only granted upon Persona verification.

[P00368 | 32241:32367 | NORMAL_TEXT | LIST id=kix.k0ublzr23s4v level=0]
When Practice Owner verification is incomplete, PHI must remain globally restricted regardless of individual member settings.

[P00369 | 32367:32466 | NORMAL_TEXT | LIST id=kix.k0ublzr23s4v level=0]
Authorized users should be able to remove team members, subject to ownership and role constraints.

[P00370 | 32466:32485 | HEADING_2]
Ownership Transfer

[P00371 | 32485:32569 | NORMAL_TEXT | LIST id=kix.mtiwbqr5i8dv level=0]
The Practice Owner should be able to transfer ownership to an existing team member.

[P00372 | 32569:32746 | NORMAL_TEXT | LIST id=kix.mtiwbqr5i8dv level=0]
The previous owner should become a Team Member after the transfer. If they need to be a Practice Admin, that can be changed by the new Practice Owner or another Practice Admin.

[P00373 | 32746:32894 | NORMAL_TEXT | LIST id=kix.mtiwbqr5i8dv level=0]
The new owner must complete personal and professional verification before PHI access and referral processing are restored, as defined in section 3.

[P00374 | 32894:32907 | HEADING_2]
Subscription

[P00375 | 32907:33009 | NORMAL_TEXT | LIST id=kix.5tpyww5dj6b6 level=0]
Practice Settings should show the current subscription and provide access to subscription management.

[P00376 | 33009:33117 | NORMAL_TEXT | LIST id=kix.5tpyww5dj6b6 level=0]
Plan-gated settings should explain the restriction and route authorized users to upgrade or manage billing.

[P00377 | 33117:33165 | HEADING_1]
8. Learning Hub and Public/Educational Channels

[P00378 | 33165:33312 | NORMAL_TEXT]
drtalk provides a central space for professional networking, clinical case sharing, and continuing dental education (CE) through the Learning Hub.

[P00379 | 33312:33338 | HEADING_2]
Onboarding and User Roles

[P00380 | 33338:33523 | NORMAL_TEXT]
Individual learners can access educational content without needing to create a practice and retain the flexibility to upgrade, create, or join a practice directly from their dashboard.

[P00381 | 33523:33624 | NORMAL_TEXT]
While professional verification is not required by default, certain private channels may mandate it.

[P00382 | 33624:33714 | NORMAL_TEXT]
Practice owners and admins manage the creation and configuration of educational channels.

[P00383 | 33714:33742 | HEADING_2]
Channel Access and Settings

[P00384 | 33742:33929 | NORMAL_TEXT]
Any registered user can access public Learning Hub content. Access to private channels may be restricted based on invitation, subscription, membership approval, or identity verification.

[P00385 | 33929:34061 | NORMAL_TEXT]
Channel creators can define category tags, such as "Study Group" or "Case Study," to facilitate content organization and discovery.

[P00386 | 34061:34089 | HEADING_2]
Monetization and CE Credits

[P00387 | 34089:34224 | NORMAL_TEXT]
Channel creators can monetize premium educational channels through recurring subscriptions, which require a connected payment account.

[P00388 | 34224:34288 | NORMAL_TEXT]
The system automatically handles fee calculation and deduction.

[P00389 | 34288:34433 | NORMAL_TEXT]
Additionally, channels can be designated as eligible for CE credits, with the platform tracking participation to support certificate generation.

[P00390 | 34433:34465 | HEADING_2]
Channel Content and Discussions

[P00391 | 34465:34594 | NORMAL_TEXT]
Channel hosts have control over posting permissions, such as limiting posts to hosts only or allowing all members to contribute.

[P00392 | 34594:34763 | NORMAL_TEXT]
Discussions support topics, comments, and the attachment of clinical documents and media, enabling members to collaborate and interact with shared resources seamlessly.

[P00393 | 34763:34765 | HEADING_1]
⟦EMPTY PARAGRAPH⟧

[P00394 | 34765:34795 | HEADING_1]
Open For Stakeholder Decision

[P00395 | 34795:34796 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00396 | 34796:34860 | NORMAL_TEXT | LIST id=kix.vb6fb0iaot99 level=0]
Final notification timing defaults and practice-level overrides

[P00397 | 34860:34921 | NORMAL_TEXT | LIST id=kix.vb6fb0iaot99 level=0]
A procedure to convert GuestSenderPractice to SenderPractice

[P00398 | 34921:34922 | HEADING_1]
⟦EMPTY PARAGRAPH⟧

[P00399 | 34922:34923 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00400 | 34923:34925 | NORMAL_TEXT]
[HORIZONTAL_RULE]

[P00401 | 34925:34934 | HEADING_1]
Post MVP

[P00402 | 34934:34950 | NORMAL_TEXT | LIST id=kix.40ub0phnrbxh level=0]
Unread messages

[P00403 | 34950:34987 | NORMAL_TEXT | LIST id=kix.40ub0phnrbxh level=0]
Link to reject patient communication

[P00404 | 34987:34988 | NORMAL_TEXT | LIST id=kix.40ub0phnrbxh level=0]
⟦EMPTY PARAGRAPH⟧

[P00405 | 34988:34989 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

