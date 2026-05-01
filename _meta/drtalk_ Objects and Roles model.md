## **User**

Represents an individual system actor (global identity).

### **Properties**

* user\_id  
* name  
* email  
* phone  
* verification\_status (unverified / verified)  
* profile\_status (incomplete / complete)

---

## **Practice (Organization)**

Represents a dental or specialist practice.

### **Properties**

* practice\_id  
* name  
* address (state, city, zip)  
* type (dentist / specialist)  
* category  
* contact\_person  
* verification\_status  
* subscription\_status  
* subscription\_plan  
* billing\_info

---

## **PracticeMembership**

Represents a user’s membership within a practice.

### **Properties**

* membership\_id  
* user\_id  
* practice\_id  
* role (owner / medical\_staff / admin\_staff)  
* status (invited / pending / active / suspended)  
* phi\_access\_status (none / pending / granted / revoked)

### **Notes**

* A user may belong to multiple practices  
* Role and permissions are scoped to practice

---

## **PracticePatient**

Represents a patient scoped to a specific practice.

### **Properties**

* practice\_patient\_id  
* practice\_id  
* name  
* phone  
* email  
* consent\_status (true / false)  
* created\_at

### **Notes**

* Patients are NOT shared across practices  
* Same real-world patient may exist in multiple practices

---

## **Referral**

Represents a patient case referred from one practice to another.

### **Properties**

* referral\_id  
* practice\_patient\_id  
* source\_practice\_id  
* target\_practice\_id  
* created\_by\_user\_id  
* status (new / viewed / accepted / processed / completed)  
* origin (email / efax / web / manual)  
* created\_at

### **Rules**

* Referral belongs to the receiving practice  
* Forwarding creates a NEW referral and patient context

---

## **Document**

Represents files and artifacts associated with a patient or referral.

### **Properties**

* document\_id  
* practice\_patient\_id  
* referral\_id (nullable)  
* type  
* file\_url  
* source (upload / email / efax / generated)  
* created\_at

### **Rules**

* Documents belong to PracticePatient first  
* Referral linkage is optional

---

## **Channel**

Represents a communication container.

### **Properties**

* channel\_id  
* type (internal / inter\_practice / public / patient)  
* owner\_practice\_id  
* practice\_patient\_id (required for patient channels)  
* counterparty\_practice\_id (for inter-practice channels)  
* parent\_channel\_id (for sub-channels)  
* created\_at

---

### **Channel Types**

#### **Internal**

* Communication within a practice

#### **Inter-practice**

* Communication between practices  
* Not tied to a patient

#### **Patient**

* One channel per patient per receiving practice  
* Created when referral is created  
* Used for patient communication (SMS / secure email)

#### **Public**

* Owned by practices  
* Open to all users  
* No PHI allowed

---

## **ChannelParticipant**

Represents users participating in a channel.

### **Properties**

* channel\_id  
* user\_id  
* role (member / admin)

---

## **Message**

Represents communication within a channel.

### **Properties**

* message\_id  
* channel\_id  
* sender\_user\_id (nullable for system messages)  
* transport (in\_app / sms / secure\_email)  
* content  
* created\_at

---

### **Rules**

* SMS requires patient consent  
* Public channels allow only in-app messages  
* Patient communication happens only in patient channels

---

# **Key Constraints**

* Channels are owned by the receiving practice  
* One patient channel per (practice\_patient\_id, owner\_practice\_id)  
* Patients are scoped per practice (no global patient identity)  
* Referral and communication systems are independent  
* PHI is restricted to internal, inter-practice, and patient channels

