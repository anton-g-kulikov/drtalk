# **drtalk Notifications**

# **1\. Email Notifications (External)**

## **1.1 Account, onboarding, and access**

| Trigger | Audience | Subject line (exact/current) | Content summary |
| ----- | ----- | ----- | ----- |
| Added to practice/team | New team member/patient user | “{Sender Full Name} has added you to drtalk” | Welcome and setup details template |
| Verify email | New or updating user | “Verify your email” | Verification prompt/link or verification code flow. |
| Password reset | Existing user | “Password Reset” and “Reset drtalk password” | Password reset instructions. |
| Setup team | Super admin / practice contact | “Setup My Team” | Team setup guidance. |
| End of onboarding | User | “Welcome to drtalk\!” | Onboarding completion/welcome message. |
| Identity verified confirmation | User | “Identity Verified” | Confirms successful ID verification and login CTA. |
| Account deletion confirmation | User | “Your drtalk account has been deleted” | Confirms account deletion completion. |

## 

## 

## **1.2 Practice connection and network**

| Trigger | Audience | Subject line (exact/current) | Content summary |
| ----- | ----- | ----- | ----- |
| Practice connection invite | External/target practice user | “Connect with {Practice Name}” | Invitation to connect practices with accept/decline actions. |
| New practice invitation | External recipient | “Invitation from {Practice Name} for drtalk” | Invitation to connect to a new practice. |
| Practice invite accepted | Requesting party | “drtalk invitation accepted” | Confirms connection acceptance. |
| Practice invite declined | Requesting party | “Declined: connection request” | Decline notification. |
| New-practice invite declined | Requesting party | “Declined: connection request for the new practice” | Decline notification for new-practice flow. |
| Person-to-person connection request | Individual recipient | “{First} {Last} wants to connect with you on drtalk” | Invite to connect individual users. |
| Person-to-person connection accepted | Request sender | “{First} {Last} accepted your connection request” | Acceptance confirmation. |

## 

## **1.3 Referral, document, and secure message flows**

| Trigger | Audience | Subject line (exact/current) | Content summary |
| ----- | ----- | ----- | ----- |
| Referral copy to patient | Patient | “{Practice Name} has sent you a copy of your Referral Letter” | Sends patient-facing referral copy details. |
| Secure document email | Recipient | “{Sender Practice} has sent you a secure email” | Secure document/message notice with access link/token. |
| Secure document verification code | Recipient | “Verification code to view secure email sent from {Sender Practice}” | One-time verification code to open secure content. |
| Referral sent confirmation | Recipient practice/contact | “Referral Confirmation” | Confirms referral/document has been sent. |
| Recipient document delivery (legacy methods still present) | Recipient | “{Sender Practice} has sent you a secure email” | Document delivery notice and secure access details. |

## **1.4 Billing, trial, and operational emails**

| Trigger | Audience | Subject line (exact/current) | Content summary |
| ----- | ----- | ----- | ----- |
| Invoice | Billing user | “Your invoice is attached” | Invoice delivery with attachment. |
| Invoice payment failure | Billing user | “Invoice Payment Failed” | Payment failure notice and follow-up action needed. |
| Trial ending soon | Billing user | “Subscription Trial Will End Soon” | Reminder that trial is nearing end. |
| Subscription changed | Billing user | “Subscription Has Been Changed” | Plan or billing-cycle change notice. |
| New user registered alert | Super admin/internal | “New User Registered for drtalk” | Internal administrative alert. |
| Service downtime notice | User/internal contact | “Update on drtalk Access Issues — Platform Secure and Fully Intact” | Incident/update communication. |
| ID verification program update | User/internal contact | “drtalk Product update \- Identity Verification” | Product/compliance update notice. |
| Manual verification support request | Admin/support | “drtalk request for a manual user verification request” | Plain-text request email with requester details and portal link. |

## 

## **1.5 Scheduled reporting emails**

| Trigger | Audience | Subject line (exact/current) | Content summary |
| ----- | ----- | ----- | ----- |
| Daily unread posts reminder | End user | “Unread posts in channels” | Reminder to check unread posts; links to web app. |
| Daily admin report (new users) | Configured admin recipients | “New users for the past 24 hours” | New-user summary with CSV attachment. |
| Weekly admin report (new users) | Configured admin recipients | “Weekly new users report” | Weekly new-user summary with CSV attachment. |

# **2\. SMS / Text Notifications (External)**

## **2.1 Scheduled unread reminders**

| Trigger | Audience | SMS text (exact/current) |
| ----- | ----- | ----- |
| Daily unread cross-office posts | User with unread cross-office posts | “You have {count} unread posts in your practice channels. Open the drtalk app to stay updated.” |
| Daily unread in-office posts | User with unread in-office posts | “You have {count} unread posts in your Daily Huddle. Open the drtalk app to stay updated.” |
| Daily unread learning hub posts | User with unread learning-hub posts | “You have {count} unread posts in your Learning Hub. Open the drtalk app to stay updated.” |
| Daily unread posts (aggregate command path) | User with unread posts | “You have {count} unread posts in your channels. Open the drtalk app to stay updated.” |

## 

## **2.2 Patient texting and EMR appointment texting**

| Trigger | Audience | SMS text content |
| ----- | ----- | ----- |
| Practice sends patient SMS chat (EMR flow) | Patient | User-authored message body, with appended sentence in one flow: “If you need to speak to a member of staff, please respond ‘C’.” |
| Patient texting direct send | Patient | User-authored message body (plus optional media/attachments depending on flow). |
| Inbound SMS callback handling | System/internal processing | Twilio webhook receives inbound content; status callbacks update message status and UI events. |

## 

## **2.3 SMS used as fallback for “email-like” destinations**

When recipient contact looks like a phone number, a number of invitation/connection flows send SMS instead of email.  
Current implementation notes:

* Several branches generate full invite SMS copy via SmsMessageBuilder.  
* Some branches still send placeholder text “Test message” (legacy/technical debt paths).

# 

# **3\. Internal Notifications (In-App / Desktop / Push)**

## **3.1 Mobile push notifications (user-visible text)**

### **Chat and channel push**

| Trigger | Audience | Push title/body (exact/current patterns) |
| ----- | ----- | ----- |
| New direct/group chat message | Channel member (not sender) | Title: sender name or group name; Body examples: “{User} sent a new message.”, message preview, or “{User} mentioned you in {Group}” |
| New post in room/channel | Member (not sender) | Body: “{User} posted a new thread.” |
| New edu-room comment/reply | Member | Body examples: “{User} commented on a post.”, “{User} replied to a comment.” |
| Mention in comment | Mentioned user | Body: “{User} mentioned you in a comment.” |
| Added to edu channel | Added member | Body: “You have been added to the channel” |
| Pinned edu post | Member | Body: “{User} pinned a post.” |

### **Network and referral-related push**

| Trigger | Audience | Push title/body (exact/current patterns) |
| ----- | ----- | ----- |
| New network/person connection request | Target user | Body: “{FirstName} would like to connect with you.” |
| Office file/shared inbox item | Receiving user(s) | Title: “New office file”; Body: “{FromPractice} sent you documents” |
| Practice invite (model exists) | Receiving user(s) | Title/body patterns: “New connection request”, “Accepted connection request” with practice name interpolation |

## 

## **3.2 In-app/desktop realtime notifications (SignalR)**

These are internal event notifications shown in-app (and desktop/web clients via realtime updates). Many are event-driven updates rather than standalone text messages.

### **High-impact user-facing event families**

* Practice and network  
  * PracticeInviteReceived  
  * PracticeInviteAccepted  
  * PracticeInviteDeleted  
  * PracticeInviteSent  
  * PersonConnectionRequested  
  * PersonConnectionAccepted  
  * PersonConnectionRejected  
  * PersonConnectionDeleted  
  * MyNetworkInvitesRead  
* Referral/document operations  
  * SharedDocumentCreated  
  * SharedDocumentUpdated  
  * SharedDocumentAccepted  
  * SharedDocumentRejected  
  * SharedDocumentWorkedOn  
  * DocumentOpened  
  * SecureEmailOpened  
  * IncomingEmailUnreadCleared  
  * OfficeFileCommentCreated  
* Messaging and channel updates  
  * MessageCreated/Updated/Deleted  
  * ChannelUpdated  
  * RoomUpdated  
  * EduRoomUpdated  
  * UnreadCountUpdated  
* Patient texting updates  
  * PatientTextUpdateSmsStatus  
  * PatientTextSmsSent  
  * PatientTextSmsMarkAsRead  
* Account/session controls  
  * UserForceLogout  
  * MobileUserForceLogout  
  * UserDeleted  
  * ContactUpdated  
  * UpdateProfileImage

### **Notes on internal notification content**

* Some internal notifications render directly from payload data (for example, updated referral/document objects) rather than static text strings.  
* User-facing labels/copy for these events are often client-side presentation decisions based on event name \+ payload.

# 

# **4\. Client-Ready Summary For PRD Inclusion**

Use this summary in stakeholder conversations:

* drtalk currently sends lifecycle emails across onboarding, invites/connections, referrals/documents, billing/trial, and compliance/verification.  
* SMS is used for unread engagement reminders, patient messaging workflows, and invite fallbacks when a phone number is supplied.  
* Internal notifications are delivered via mobile push and realtime in-app events, with rich coverage for referral/document lifecycle, channel activity, and network collaboration.  
* Notification content is already highly dynamic (names, practices, counts, referral context), and can be tuned further for PRD-aligned cadence and tone.

# 

# **5\. Known Product/Content Gaps (Important For PRD)**

* Some invite/fallback SMS paths still use placeholder “Test message” copy and should be replaced before launch.  
* A subset of internal notifications are event-label driven with client-side rendering, so final user-visible copy can vary by app surface.  
* Several template-driven emails are implementation-complete but should be reviewed against final PRD wording, role language, and compliance tone.

