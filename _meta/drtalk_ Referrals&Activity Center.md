# **Referral Process & Activity Center**

# **Open Questions**

* Can a dentist reroute a sent referral to a different practice?    
* Can referrals be forwarded between practices?    
* Can specialists send referrals to dentists (received from Dentist A, sent to Dentist B)?    
* Do we need to make a distinction between Patient and Referral?    
* Should all additional documents be accumulated or associated with a Patient or a Referral object?

---

# **Referral Process**

## **Entry Points**

Users can initiate a referral via:

* Platform ("Send referral")  
* External referral link (practice-specific)  
* Email / eFax 

**Key design principle:** All referrals are structured, unified into one system and processed in the Activity Center.

## **Sender Identity Layer**

Before submitting:

* User can:  
  * Log in  
  * Sign up  
  * Continue as guest

### **Guest Flow**

* Minimal friction (name \+ email)  
* Data stored for future account creation

### **Guest User Logic**

If the sender is not a *drtalk* user:

* System creates a "Guest User" profile (name \+ email), assigning all received referrals to it

If and when the a user with same email creates *drtalk* user, the system:

* Automatically connects previous referrals to that user account

**Key decision:** Frictionless submission first, identity for sender resolution later

## **Referral Form**

Standardized but customizable per practice:

* Sender details  
* Referred practice / doctor  
* Patient data (name, DOB, contact)  
* Case description  
* Attachments (e.g., X-rays)  
* Optional: send copy to patient

**Key principle:** Structured \+ flexible data capture

## **Intake & Data Processing**

### **Channel-Specific Behavior**

| Channel | Mechanism |
| :---- | :---- |
| In-App | Direct structured submission, platform verification |
| Referral Link | Direct structured submission, platform verification |
| Email | AI Processing Layer, user verification |
| E-Fax | AI Processing Layer, user verification |

### **AI Processing Layer**

For Email / eFax:

* AI extracts:  
  * Sender identity  
  * Patient name, DOB  
  * Clinical notes  
  * Attachments  
* Generates:  
  * Structured referral object  
  * Confidence score (High / Low)

**Key principle:** Normalize unstructured inputs into structured referrals

## **Submission & Routing**

After submission:

* Referral is:  
  * Sent to target practice  
  * Appears in Sent referrals (sender)  
  * Appears in Activity Center (receiver)  
* Patient Email is sent

Additional outcomes:

* A submission can be marked as Document and associated with an existing Referral

**Nudge System**

If referral is not opened within system set SLA (e.g. 4 hours): Specialist receives reminder: “You have a new referral — respond now”

## **Error Handling & Data Recovery**

If data is incomplete or low-confidence:

System:

* Flags missing fields  
* Assigns Low Confidence Score

Receiver can:

* Edit manually (Editor Mode)  
* Request missing info from sender (secure link/email)

**Key principle:** Recover incomplete data instead of blocking flow

---

# **Activity Center**

## **Core Role**

The Activity Center is a central command layer for referral lifecycle management

Combines:

* Intake  
* Processing  
* Communication  
* Analytics

## **Main Dashboard**

Key metrics for Specialist Practice (**Receiver**):

* Referrals received  
* Conversion rate (?)  
* Average response time (?)

Key metrics for Specialist Practice (**Sender**):

* Referrals sent  
* ?

### **Pipeline States**

* Received (Review)  
* Working on (In progress)  
* Processed  
* Archived

**Key concept:** CRM-like pipeline for referrals

## **Referral Inbox (Review tab)**

## Unified view across all channels:

Each referral includes:

* Date  
* Patient  
* Type (consultation, evaluation, emergency)  
* Source badge (Email / Fax / Link / App)  
* Confidence score  
* Status

Supports:

* Filtering  
* Sorting  
* Search

**Key principle:** Referral is a workflow object

## **Referral Detail View (Modal dialogue)**

Full case view:

* Patient data  
* Referral metadata  
* Original Referral Attachments  
* Additional Documents (received later, associated with Referral?)  
* Description  
* Source information  
* Status changes history  
* Comments

### **Actions**

* Change status  
* Process referral  
* Download (PDF / files)  
* Comment  
* Forward referral (?)

## **Processing & Collaboration**

Within referral:

* Status transitions:  
  * Review → In progress → Complete  
* Features:  
  * Internal/external comments  
  * Documents attachement  
  * File sharing  
  * Cross-practice communication

## **Data Quality Layer**

### **AI Confidence Score**

* **High:**  
  * Complete extraction  
  * One-click acceptance  
* **Low:**  
  * Missing / ambiguous data  
  * Requires intervention

### **Resolution Tools**

* Manual editor  
* Request missing info (email with secure link)

**Key principle:** AI-assisted, human-verified system

## **Outbound Layer**

Practices manage:

* Referral links  
* Referral email address

## **Closing the Loop**

### **Trigger: “Process Referral”**

System actions:

#### **Dentist (Sender):**

* DrTalk user:  
  * In-app message \+ email  
* Non-user:  
  * Secure email confirmation  
* Fax/email sender:  
  * Fax-back or secure email

#### **Specialist:**

* Analytics updated

**Safety Mechanism**

* Optional delay (5–10 min) before notifications  
* Allows undo / correction after accidental processing