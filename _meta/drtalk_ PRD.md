# **drtalk: Product Requirements Document**

Date: 2026-06-24

Status: Draft for stakeholder review

Prototype: [https://prototype.drtalk.com/](https://prototype.drtalk.com/)

# **Product Goals**

drtalk should:

* make practice onboarding fast and low-friction  
* allow practices to start setup before compliance and payment gates  
* provide meaningful distinction in experience for referring (dentist) and receiving practices (specialists)  
* make referral intake simple across app, referral links, email, and eFax  
* ensure PHI access is controlled by a verified licensed practice owner  
* give practices a single Activity Center for referral operations  
* provide clear, lightweight communication with patients and referring practices  
* allow all users participate in LearningHub, including consuming paid and private resources


# 

# **1\. Users And Roles**

## **User Roles**

* **Guest referral sender**  
* **Practice owner:**  
  * full access \+ access to billing \+ can remove users and adjust individual user toggles for PHI access  
  * must ID Verified (encouraged but not required to be a licensed doctor)  
  * ID Verification for this role must occur for the rest of the roles to be automatically verified  
  * *Only one Practice Owner allowed.*  
* **Practice admin:** full access \+ access to billing \+ can remove users and adjust individual user toggles for PHI access  
  * *Multiple Practice Admins allowed*  
* **Team member:** Defaults to full access, except:  
  * can’t control PHI toggle  
  * can’t remove users (can only invite)  
  * does not have access to billing


* **Individual Learner**  
  * This is a separate flow and shouldn’t be as prominent as create/join a practice   
  * ID verification is not required as a default, but may be required for them to join certain private channels (channel owner will designate if users who join must be ID verified)  
  * They have the option to go from an individual to a member of a practice (or create a practice) from their dashboard  
  * They should also be able to ID verify from their dashboard or they will get a hard stop if they try to join a private channel that requires ID verification

## **Role Rules**

* Each practice has exactly one Practice Owner at a time. Each practice can have multiple Practice Admins as well as multiple Team Members.  
* Team members may create the practice initially, but they cannot satisfy the owner requirement unless they are a verified responsible party who becomes owner.  
* The Practice Owner must be ID Verified and accept responsibility for their team’s access and use.  
* Ownership transfer is supported.

# 

# **2\. Onboarding And Practice Setup**

*drtalk should let users enter quickly, create or join a practice, and begin setup before hard compliance or payment barriers*

At entry, onboarding should support three top-level paths: create a practice, join an existing practice, or continue as an individual learner for Learning Hub access without a practice.

## **Account creation**

* Users create an account with first name, last name, email, and password.  
* Users create an account with Google and Microsoft SSO providers option.  
* Users make “passive agreement” to drtalk’s Terms & Conditions of Use, Business Associates Agreement, and Copyright Policy upon click of “Create Account” button.  
* Users verify email before continuing.

## **Email policy**

* Both corporate and personal emails are allowed.  
* Personal-email accounts must be flagged in the drtalk admin panel for potential review.  
* Personal-email accounts must not be blocked from registration, verification, practice setup, or subscription.  
* Personal-email review is an internal risk signal, not a user-facing blocker.  
* If a user with personal email completes Persona and professional verification – the flag is lifted.

## **Practice creation**

* A user can create a new practice or join an existing one.  
* Practice setup requires choosing practice type to determine dentist/specialist designation. Available types and their designations:  
  * Assigns ‘Dentist’ type:  
    * Dentist  
    * Pediatric Dentist  
    * Orthodontist  
  * Assigns ‘Specialist’ type:  
    * Endodontist  
    * Oral & Maxillofacial Surgeon  
    * Periodontist  
    * Prosthodontist  
    * Dental Anesthesiologist  
    * Oral Pathologist  
    * Dental Business Partner  
    * Dental Laboratory   
* Practice setup requires full address with zip code (this data will be used for network suggestions)  
* eFax numbers that aren’t in Documo will still need to be ported over (process that John manually handles the form shared in Slack). To help flag accounts with eFax numbers that need to be ported over (or created), we will ask about eFax at practice set up.  
  * If they don’t have an eFax, one will be automatically set up for them in Documo  
  * And if they do have an eFax, there will be a TBD flag for John that the manual port process needs to happen 

## **Role selection during setup**

* A user creating a practice can identify themselves as Practice Owner, Practice Admin, Team Member  
* It is possible for no Practice Owner to be selected upon set up. In that case, the practice exists without an owner and must show that owner assignment is still required.

## **Joining a practice**

Users may join through:

* invite link  
* invite code  
* search and request access

Join-request approval behavior:

* The Practice Owner must approve the first Practice Admin. Once a Practice Admin is approved for the account, they also have the ability to approve all other Team Members and other Practice Admins.  
* A practice admin can approve joining team members  
* PHI-sensitive access switches to “On” after practice owner verification  
* Email notifications are sent to the practice owner (can toggle off) and practice admin (required) when a join request requiring review is submitted. Additional notifications still TBD (e.g. will they see anything on their dashboard or in-platform notifications)  
* pending join requests visible in Team settings until resolved

# **3\. Ownership, Verification And Subscription**

The system needs strong PHI controls without creating unnecessary upfront friction.

## **Ownership and verification**

* Access to PHI, and therefore the ability to receive and process referrals, depends on Practice Owner verification.  
* Verification is delayed until the practice attempts a PHI-related workflow, including receiving referrals and documents or processing referrals.  
* The owner completes identity verification and accepts responsibility for the team’s access.  
* Once owner verification succeeds, PHI access can be enabled for the practice. All practice personnel receive PHI access by default after owner verification. Practice owner and practice admin can toggle PHI access off to any team member.

## **Practices without owners**

* A practice may exist without an owner temporarily.  
* Such a practice can perform setup and non-PHI tasks.  
* The product must clearly show that full clinical capability remains locked until a licensed owner is assigned and verified.  
* Note regarding “Guest Sender Practices”  
  * Each incoming and recognized item is assigned to a SenderPractice. If that practice isn't on a platform, an item is assigned to a GuestSenderPractice. If and when a GuestSenderPractice registers on the platform, all communication associated with their address is ported to the new account and regular channel section. The goal is to have this happen automatically (if that isn’t possible for MVP, current manual process will stay in place).

## **Ownership transfer**

* Ownership transfer is supported.  
* Every ownership transfer triggers a new personal and professional verification flow for the new practice owner. The practice is not locked out of general setup or non-PHI tasks during this transition, but processing new referrals and accessing existing PHI still require completed owner verification.

## **Subscription (Monetization)**

**Referral-Triggered Trial**  
Registration → Practice setup → Verification continuously nudged → Verification becomes mandatory before first referral receipt/execution → First referral triggers start of 30-day trial → CC details are deferred until trial expiration.

STILL TO BE DETERMINED: communication cadence outside of the platform (e.g. emails) that let them know to set up their credit card before their trial ends so there is no disruption to service/remind them that their trial is ending 

STILL TO BE DETERMINED: Can we move invoicing for Beacon and AZOMS to Stripe invoicing? DIAL finance/accounting support team looking at this; will try to change when the new product launches. 

# **4\. Referral Intake, Documents And Dashboards**

## **Core Model**

drtalk routes referrals, documents, and communication into one structured practice workflow. Referrals remain the primary user-facing object. Shared documents are first-class workflow objects that can exist before, during, or after a referral. Documents are also allowed to exist independent of a referral. Options exist to convert documents to a referral or attach a document to a referral but it is not required. Patients as object will be introduced in the system to connect all relevant information (referrals, documents, communication), but won’t be surfaced in UI until further expansion (e.g. EMR integration)

* Every referral should preserve sender context (sending practice, sending doctor), destination practice, patient context, source channel, attachments, status, and activity history.  
* Every shared document should preserve channel, sender context (sending practice, sending doctor), file name, file type, size, sent time, optional patient context, optional referral association, and note/message context.  
* The system should be able to relate each referral, document and communication message to a patient (if identified).

## **Entry Points**

* in-app referral submission  
* external referral link  
* direct intake email  
* eFax  
* standalone document upload from a connected practice  
* secure message attachment inside an inter-practice channel

*Note: Per Tom manual entry typically happens in the EMR and is not needed for the drtalk product at this time.*

## **Sender Identity**

* Senders may log in, sign up, or continue as guests where applicable.  
* Guest referral submission is allowed for low-friction intake.  
* The system should preserve sender context well enough to reconcile the sender if they later become a registered user.

## **Referral Form**

The structured referral form should support sender details, receiving practice, receiving doctor when applicable, patient details, case details, and attachments.

When the destination practice has only one receiving doctor, that doctor should be auto-selected rather than requiring manual selection.

The exact standard field set should be confirmed with stakeholders and may remain customizable per practice within approved limits. A pre-designed editable PDF (created either by the practice or with help from the drtalk team) can also be uploaded and used instead of the general referral fields that are in the platform. This document can be uploaded directly by the practice or by the drtalk team..

## **Shared Documents**

A shared document is a standalone workflow object, not only a referral attachment.

* A shared document can be received via platform, email or eFax, can be sent from a dashboard (via platform), attached to a channel message, uploaded from a channel, converted into a referral, or associated with an existing referral.  
* Supported document metadata should include file name, file type, file size, sender context, timestamp, channel, optional patient details, optional referral id, and optional note.  
* Documents shared through inter-practice channels should appear in the message history, the channel Documents tab, and the receiving dashboard Documents inbox.  
* Users should be able to search, preview, download, and send new shared documents from the inter-practice channel Documents tab.

## **Sending Documents To Non-Connected Practices**

Dentist and specialist users should be able to send documents to a practice that is not connected to them on drtalk by using a new secure email address or eFax number.

* The Send Document flow should offer two mutually exclusive destination modes: Network and New Secure Email / eFax.  
* Network should support selecting one or more existing practice connections, including external. New Secure Email / eFax should accept one custom destination per send.  
* The sender must select Secure Email or Secure Fax and provide the corresponding email address or fax number.  
* Secure Email must require a valid email address. Secure Fax must accept common phone-number formatting and require at least seven digits.  
* The Send Document action must remain disabled until the destination is valid and at least one document or document name is provided.  
* The sender should be able to include the same optional patient details, referral association, and note available when sending to a connected practice.  
* On send, drtalk should create or reuse an external inter-practice channel identified by the custom destination and selected transport.  
* The external channel should be marked as off-platform and unverified and should appear under External Practices in Communication.  
* The sent document and its contextual message should be saved to the external channel so the sending practice has a persistent record and can continue the conversation.

## **Document Processing**

* Opening a document should show sender, received time, file size, secure preview where supported, and download.  
* For channel-originated documents, the primary follow-up should route users to View & Discuss in Channel.  
* Specialist users should be able to convert an active document into a new referral or attach it to an existing referral.  
* Additional actions are: archive document or mark it as spam.  
* Dentist users should be able to review incoming documents and continue the discussion in the relevant specialist channel.  
* Both types of users should be able to forward a document to connected practices or to a new recipient via secure email.  
* Completing either action removes the document from the active inbox.

## **Dentist Dashboard**

The dentist dashboard is the referring practice command surface for immediate actions, alerts, and lightweight reporting.

* It should foreground quick actions: Send a Referral, Send Document, Recent Conversations, Suggested Connections  
* It should show summary reporting such as Patients Referred, Patients Scheduled, Patients Released (Specialty Care Complete), Number of drtalk Connections  
* It should show recent referrals (patients referred) as a short operational snapshot; complete tracking belongs on the Patients page.  
* Recently received Documents should be shown above “Patients Referred” and follow the document processing flow as outlined above  
* Referral-related dashboard cards should route to the relevant specialist channel when communication is the next action.

## **Specialist Dashboard**

The specialist dashboard is the receiving practice Activity Center for immediate action and reporting.

* It should foreground Send Document, and quick actions for recent conversations and suggested connections. It should also flag if they are still in their “free trial” period and how many days are left.  
* It should show summary reporting such as referrals received, referrals scheduled, referrals released, and number of drtalk connections.  
* It should separate inbound documents from referrals so documents can be triaged before they become case work. Referrals should be shown first on the dashboard.  
* Users should be able to convert an incoming document into a new referral or attach it to an existing referral.  
* Referral cards on the dashboard should represent urgent work queues, not complete historical tracking. It should surface new referrals requiring acceptance as well as referrals with newly received documents.

## **Referrals Page**

The Referrals page is the dedicated referral workspace, separate from the dashboards.

* Dentist view (shown as Patients): send and track outbound referrals by status, with tabs for Referred, Accepted, Scheduled, Released, and Archived.  
* Specialist view (shown as Referrals): receive, review, and process referrals by status, with tabs for Received (Review), Accepted, Scheduled, Released, and Archived.  
* It should provide referral-specific stats, status tabs, search, filters (including date filters), a full referral list, and links to referral detail or related channels.  
* The specialist view should expose the direct intake email and public referral URL with a simple explanation how that would work for the sending party (e.g. hover state description).  
* The dentist's view has a button to refer a patient.

## **Intake Processing**

* In-app and referral-link submissions are already structured.  
* Email and eFax inputs pass through an AI-assisted extraction layer.  
* Email, eFax, and secure-message attachments should auto-populate core patient fields such as patient name and date of birth whenever extraction confidence allows.  
* The intake pipeline should minimize unknown referrals by prefilling structured referral records as completely as possible from inbound messages and attachments.  
* Still unrecognized items that are not marked as spam should be surfaced for the user's manual triage.  
* Secure-email attachments should be openable directly inside drtalk rather than forcing users back to an inbox experience.

## **Referral States**

The product should distinguish inbound specialist operations from outbound dentist tracking.

* Inbound specialist states: Received (Review), Accepted, Scheduled, Released, Archived.  
* Outbound dentist states:Referred, Accepted, Scheduled, Released, Archived.  
* Distinct reroute and decline referral options remain out of scope.

## **Referral case statuses/Workflow stages**

| Dentist Status | Specialist Status | Next Step | Workflow Stage & Context |
| :---- | :---- | :---- | :---- |
| Referred | Received (Review) | Status moves to “Accepted” for both Dentist and Specialist automatically once Specialist opens the referral (patient sub-channel with automated message also triggered) | The referral is received via digital intake for the specialist to review. |
| Accepted | Accepted | Specialist manually changes status to “Scheduled” | The specialist starts working on the case and coordinates appointment scheduling. “Working On” will not be a stage but a dropdown for specialist internal use. |
| Scheduled | Scheduled | Specialist manually changes status to “Released” | The patient's appointment is confirmed, and treatment is underway at the specialist's office. |
| Released | Released | After the patient is released their status management is done separately by the Dentist and Specialist (manually). Final step is to Archive. | Clinical treatment by the specialist is complete. Post-op reports and files are sent back to the dentist for review. Dentist determines if “post-specialty restorative care” is needed. |
| Archived | Archived | Reopen Case using button OR if the other practice has not Archived on their end and posts a message or document in the patient channel the case will automatically reopen for the side that has Archived | The case is closed out of active pipelines. |

## **Referral List And Detail Views**

* Referral lists should support status tabs, search, date range, urgency, source, practice filters, sorting, and pagination.  
* Referral rows should show enough context to act quickly, including patient, urgency, source or REF number, referring or receiving practice, assigned doctor when available, and last activity date.  
* Referral detail should support status changes, assignment, internal notes, missing-data review, attached document viewing, and direct links to the related case chat and patient communication.

## 

## **Referral Detail Page (Specialist View Only)**

The referral detail page should serve as the full working view of a single referral and combine structured clinical data, documents, case actions, and activity history in one screen.

* It should include  
  * referral data and patient name,  
  * missing data warnings  
  * editable case information  
  * document preview  
  * status and ability to change,  
  * the option to specify a team member working on a case  
  * activity history, and internal notes.  
* It should serve as a gateway to inter-practice communication regarding related case.

# 

# 

# **5\. Communication**

## **Communication Model**

drtalk communication is organized around channels so practices can coordinate referrals, documents, patients, and internal work in one workspace.

* Internal practice channels should support coordination among all practice members or a selected subset.  
* Inter-practice channels should support dentist-specialist coordination at both the practice level and the individual referral-case level.  
* External-practice channels should allow communication with off-platform practices through secure email transport.  
* Patient communication channels should support email and SMS/text.  
* Group channels should allow selected users from one or more practices to coordinate outside a single referral case.

## **Channel Navigation And Case Conversations**

* Channels should be grouped into Internal, Connected Practices, External Practices, Patient Communication, and Group Chats.  
* The channel list should support unread counts, collapsed and expanded groups, and search by practice, channel, patient, or case (REF number).  
* When a receiving practice reviews a referral, drtalk should automatically create the related patient-specific case communication channel and change the status to Accepted upon first open.

* Connected and external practice channels should contain patient-specific case conversations for active referrals.  
* Users should be able to open the relevant practice, case, and Messages or Documents view directly from dashboards, referrals, documents, and Practice Network actions.  
* Case conversations should be archivable and reactivatable without deleting their message or document history.

## **Messages, Participants And Groups**

* Users should be able to send chat messages and document attachments within a channel.  
* Messages should preserve sender, timestamp, transport, channel, optional patient context, optional referral association, and optional document context.  
* Each practice should be able to manage which team members participate in an inter-practice channel, subject to role and PHI-access controls.  
* Group creation should require a group name and at least one participant.  
* Message actions should support reply, forward, pin or unpin, copy, delete, and reactions.  
* Pinned messages should remain visible at the top of the active channel until unpinned.  
* Practice-level channels may include user-created subchannels for focused coordination with the same connected or external practice.

## **Shared Documents**

* Inter-practice channels should expose Messages and Documents and Archived Conversations as separate tabs while also showing document attachments inline in message history.  
* The Documents tab should support channel-scoped search, preview, download, upload or send-new-document, pagination, and archive or restore actions.  
* Sending a document should create both a shared document record and a contextual channel message, as well as populate as a new document on the Dashboard.  
* Direct document sends may include patient details, referral association, and a note.  
* Direct document sends should support one or more recipients and should distinguish drtalk recipients from external recipients reached by secure email or fax where applicable.  
* Document sends should allow a referral association, patient details, and a short message when those details are available.

## **Patient Communication**

* Practice-to-Patient channels are created only when a user starts patient communication by clicking the “Message a Patient” button on a referral case page.

* When a patient channel is created, its first message reads:

  * Welcome to \[practice name\]\! By continuing this conversation, you consent to communicate with our office via text message. Message and data rates may apply.

    To best assist you, please reply with your:

    ·       Full Name

    ·       Date of Birth (MM/DD/YYYY)

    Please do not use text messaging for urgent matters. If you are experiencing a medical emergency, call 911 immediately or go to the nearest emergency room.

    We look forward to assisting you and will respond to your message as soon as possible during regular business hours.

    You may reply STOP at any time to opt out.

* Patient notifications should default to email plus SMS/text.  
* Practices should be able to choose email, SMS/text, or both where the workflow allows.  
* Referral status notifications to patients should be delayed by 5 to 15 minutes, configurable by practice.

## **Access And Verification**

* PHI sharing through any channel must respect Practice Owner verification, subscription state, user role, and individual PHI-access controls.  
* When a practice cannot receive PHI, the channel should clearly communicate the restriction to both sides before a message or document is sent.

# 

# **6\. Practice Network**

## **Core Model**

Practice Network is the relationship, discovery, and performance workspace for connected and prospective practice partners.

* Specialists should see referring dental practices in Practice Network.  
* Dentists should see specialist practices in the Specialist Network.  
* Both experiences should provide Analytics, My Network, and Connect & Grow views.

## **My Network**

* My Network should show connected practices (on drtalk platform as well as external contacts) and provide direct actions to start a conversation, send a referral where applicable, or open practice details.  
* The specialist view should distinguish on-platform practices from external practices reached through fax or secure email.  
* Users should be able to invite a practice that is not yet on drtalk and that should be given prominence as applicable.

## **Connect & Grow**

* Users should be able to search by practice name or specialty and filter results to all eligible practices or nearby suggestions.  
* Directory filters should support practice type, city, state, and distance or radius.  
* Connected practices should be removable from My Network, subject to confirmation.  
* Suggestions should combine practice designation, specialty, and location data.  
* Already connected practices and practices that declined or were dismissed as not interested should be excluded. Dismissed suggestions will not be hidden from the 'directory'; they will only be removed from the 'nearby/suggest' list but kept in 'all practices.' 

* Recommendations should prioritize practices within 100 miles of the practice zip code and should not exceed a 300-mile radius.  
* Interstate connections and communication should be allowed.  
* Pending or ignored invitations should remain visible until the receiving practice declines.

## **Practice Actions**

* Connected dentists should be able to Send Referral or Chat Now.  
* Dentists should be able to Connect with a directory result or Refer & Connect when initiating a referral to a practice outside their network.  
* Specialists should be able to open a connected-practice chat or send a secure message to an external practice.  
* Practice cards should show connection status, specialty, practice designation, location, verification status, and external-transport status where applicable.

## **Network Analytics**

* Analytics should support Today, Last 7 Days, Last 30 Days, Last 90 Days, and Last 12 Months   
* Each KPI should display a change value and a trend as a comparison of the selected period.  
* Dentist reporting should summarize patient sent, scheduled, released from specialty care, and conversion rate (sent to scheduled).  
* Specialist reporting should summarize referrals received, scheduled, released from specialty care, and conversion rate (received to scheduled).  
* Users should be able to review the same funnel by connected practice and export or print the report.

# 

# **7\. User Profiles & Practice Settings**

## **User Profile**

* Each user should be able to manage first name, last name, display name, email address, mobile number, and profile photo.  
* The display name should be used consistently across messages, referrals, activity history, and team management.  
* Users should be able to enable SMS reminders only when a valid mobile number is available. More detailed individual user notification preference settings TBD.

## **Practice Settings Core Model**

Practice Settings is the administrative workspace for practice identity, referral intake settings, notification preferences, team access, ownership, and subscription management.

* Settings should be available in both dentist and specialist experiences, with role-specific options where workflows differ.  
* Access to settings and administrative actions must follow the user roles and permissions defined in section 1\.  
* Dentist practice should manage only free features: Practice profile, Patient (Referral) Notification, and Team, Roles and Access control settings.  
* Settings should show only the options available to the current practice type and role.  
* Specialist practices should manage referral intake and subscription settings; dentist practices should be limited to the free settings needed for profile, patient referral notifications, and team access.

## **Practice Profile**

* Practice profile should support practice name, practice type or specialty designation, phone number, website, street address, city, state, and ZIP code.  
* Practice type should use a controlled list that includes general dentists, recognized dental specialties, and supported dental partner organizations.  
* Practice profile data should be used consistently in Practice Network discovery, referral routing, communication, and externally visible practice information.  
* The assigned eFax number should be shown when included in the practice subscription; otherwise the setting should explain the required plan upgrade.

## **Referral Intake**

* Receiving practices should be able to view and copy their dedicated intake email, eFax number, and public referral link.  
* Email and eFax sent to the assigned intake channels should enter the secure referral intake pipeline described in section 4\.  
* The public referral link should allow an external sender to submit securely without a drtalk account.  
* Practices should be able to upload, replace, download, or remove one current PDF referral sheet template for external referring offices.  
* Referral sheet upload should accept PDF files only and enforce the supported file-size limit. The PDF must have editable fields already created to work properly.  
* Availability of eFax and other premium intake channels should follow the active subscription plan.

## **Referral Notifications**

Patient notification settings should be organized around the two patient-facing case events: Case Sent and Case Accepted, with controls appropriate to the referring or receiving practice.

* Patient Case Sent and Case Accepted notifications should be enabled by default for both email and SMS/text, where the patient has a valid contact method.  
* Dentist and specialist practices should be able to configure patient notifications independently by event and select email, SMS/text, or both, subject to available patient contact information.  
* Dentist practices should configure the patient’s Case Sent notification, sent after a referral is successfully submitted.  
* Receiving practices should configure the patient’s Case Accepted notification, sent after the referral is automatically accepted when the receiving practice opens the case. Separately, specialist practices should configure registered-sender notifications by in-app message and email, non-user confirmation by secure email, and fax/email-sender confirmation by fax-back or secure email.  
* Receiving practices should be able to apply a configurable 5-to-15-minute delay before the Case Accepted notification is sent, allowing accidental case openings to be corrected.  
* Patients should not be notified about other referral case status changes. Patient notifications are limited to Case Sent and Case Accepted, when the related settings are enabled.

## **Internal notification**

* 

## **Team, Roles And Access Control**

* Practice owners and practice admins should be able to view the team roster, member role, PHI-access status, and join date.  
* Authorized users should be able to invite team members and review pending join requests.  
* All join requests should be confirmable or ignorable by Practice Admins and Practice Owner.  
* When approving a join request, authorized users should be able to adjust the requested role and PHI access before confirming the member.  
* Practice Owners and Practice Admins should be able to assign Practice Admin or Team Member roles and independently enable or restrict PHI access for each non-owner user.   
* Team Members should receive PHI access by default after Practice Owner verification, unless an authorized administrator restricts it.  
* Practice Owner PHI access is mandatory and cannot be disabled. It is only granted upon Persona verification.  
* When Practice Owner verification is incomplete, PHI must remain globally restricted regardless of individual member settings.  
* Authorized users should be able to remove team members, subject to ownership and role constraints.

## **Ownership Transfer**

* The Practice Owner should be able to transfer ownership to an existing team member.  
* The previous owner should become a Team Member after the transfer. If they need to be a Practice Admin, that can be changed by the new Practice Owner or another Practice Admin.  
* The new owner must complete personal and professional verification before PHI access and referral processing are restored, as defined in section 3\.

## **Subscription**

* Practice Settings should show the current subscription and provide access to subscription management.  
* Plan-gated settings should explain the restriction and route authorized users to upgrade or manage billing.

#  **8\. Learning Hub And Public/Educational Channels**

*drtalk should provide a central space for professional networking, clinical case sharing, and paid or free continuing dental education.*

## **Onboarding and User Roles**

* Onboarding must support an Individual Learning Hub path that allows educational-content access without requiring practice creation.  
* Individual Learners should be able to upgrade, create, or join a practice at any time from their dashboard.
* Individual Learners are not required to complete professional verification by default, unless attempting to access channels that mandate it.
* Practice Owners and Practice Admins should be able to create, configure, and host educational channels.

## **Channel Access and Settings**

* Any registered user should be able to access public Learning Hub content.
* Private channels may require invitation, payment subscription, membership approval, or identity verification depending on the channel creator settings.
* Channel creators should be able to define channel category tags (e.g., Study Group, Virtual MRP, Case Study) to organize and filter content.

## **Monetization and Stripe Setup**

* Channel creators should be able to charge a recurring subscription fee for premium educational channels.
* Channel creators must connect a payment processing account to receive subscription payouts.
* Monetized subscriptions must automatically calculate and deduct platform fees and transaction fees from the total charge before payout.
* Users must complete subscription payment workflows successfully before gaining access to monetized channel content.

## **Continuing Education (CE) Credits**

* Channel creators should be able to designate channels as eligible for Continuing Education (CE) credits and specify the number of credit hours.
* The system should track participation or completion status for users in CE-eligible channels to support certificate generation.

## **Channel Content and Discussions**

* Channel creators should be able to restrict posting permissions (e.g., host-only posts vs. all-member posts).
* Channel discussions must support creating topics, commenting, and attachment of clinical documents and media.
* Members should be able to view, like, and download shared files within channels they have joined.

# 

# **Open For Stakeholder Decision**

* Learning Hub creation, pricing, and private-channel verification rules  
* final notification timing defaults and practice-level overrides  
* A procedure to convert GuestSenderPractice to SenderPractice

# 

---

# **Post MVP**

* Unread messages  
* Link to reject patient communication  
* 

