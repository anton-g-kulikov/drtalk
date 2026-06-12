import type { UnifiedReferral, ReferralStatus } from './referrals';
import type { SharedDocument, MessageItem, Channel } from '@/app/channels/page';

// Simple seedable pseudo-random generator to ensure deterministic hydration
function getDeterministicRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Lists of names and procedures for realistic clinical data
const FIRST_NAMES = [
  "John", "Jane", "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Henry",
  "Ivy", "Jack", "Karl", "Lily", "Mary", "Ned", "Olivia", "Peter", "Quinn", "Rachel",
  "Sam", "Thomas", "Ursula", "Victor", "Wendy", "Xavier", "Yolanda", "Zach", "Arthur",
  "Beatrice", "Clara", "Daniel", "Emily", "George", "Helen", "Ian", "Julia", "Kevin",
  "Laura", "Michael", "Nora", "Oscar", "Patricia", "Richard", "Susan", "Timothy",
  "Valerie", "Walter"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Carter", "Roberts"
];

const ENDO_PROCEDURES = [
  "Endodontic Consultation",
  "Root Canal Therapy",
  "Endodontic Retreat",
  "Apicoectomy",
  "Apexification"
];

const OTHER_PROCEDURES = [
  "Dental Implant Eval",
  "Emergency Extraction",
  "Invisalign Evaluation",
  "Periodontal Surgery",
  "Crown Lengthening",
  "Wisdom Teeth Extraction"
];

// Define connected dentist practices (visible to Valley Endodontics) - 17 practices
export const dentistPractices = [
  { id: '6', name: 'Sunshine Dental' },
  { id: '7', name: 'Desert Bloom Dental' },
  { id: '10', name: 'Oakridge Dental' },
  { id: '11', name: 'Black Family Dental' },
  { id: '12', name: 'White Dental Group' },
  { id: '13', name: 'Miller & Associates' },
  { id: '14', name: 'Westside Pediatric Dentistry' },
  { id: '15', name: 'Aspen Crest Dental' },
  { id: '16', name: 'Boulder Valley Dental' },
  { id: '17', name: 'Canyon Creek Dental' },
  { id: '18', name: 'Foothills Family Dentistry' },
  { id: '19', name: 'Glacier Peak Dental' },
  { id: '20', name: 'Harbor Light Dental' },
  { id: '21', name: 'Meadowbrook Dental' },
  { id: '22', name: 'Pinecrest Dental Group' },
  { id: '23', name: 'Riverfront Dental Care' },
  { id: '24', name: 'Summit Ridge Dental' },
  { id: '25', name: 'Oakwood Family Dental' },
];


// Define connected specialist clinics (visible to Sunshine Dental / Dr. Taylor Reed) - 18 clinics
export const specialistClinics = [
  { id: '3', name: 'Valley Endodontics' },
  { id: '7', name: 'Downtown Oral Surgery' },
  { id: '8', name: 'Metro Orthodontics' },
  { id: '9', name: 'Arizona Periodontics' },
  { id: '6', name: 'Beverly Hills Dental' },
  { id: '30', name: 'Apex Pediatric Dentistry' },
  { id: '31', name: 'Boulder Oral Surgery' },
  { id: '32', name: 'Canyon View Orthodontics' },
  { id: '33', name: 'Desert Ridge Endodontics' },
  { id: '34', name: 'Evergreen Periodontics' },
  { id: '35', name: 'Foothills Oral Surgery' },
  { id: '36', name: 'Glacier Peak Endodontics' },
  { id: '37', name: 'Harbor Light Orthodontics' },
  { id: '38', name: 'Meadowbrook Prosthodontics' },
  { id: '39', name: 'Pinecrest Oral Surgery' },
  { id: '40', name: 'Riverfront Periodontics' },
  { id: '41', name: 'Summit Ridge Orthodontics' },
  { id: '42', name: 'Westside Endodontics' }
];

export interface DashboardDoc {
  id: string;
  name: string;
  sender: string;
  date: string;
  size: string;
  fromChannel?: boolean;
  channelName?: string;
  channelType?: 'practice' | 'case';
  caseId?: string;
  isExternal?: boolean;
  transport?: 'Email' | 'Fax' | 'App';
}

// Generate the master mock dataset
export function generateMockData() {
  const referrals: UnifiedReferral[] = [];
  const documents: SharedDocument[] = [];
  const messages: Record<string, MessageItem[]> = {};
  
  const dashboardDocsSpecialist: DashboardDoc[] = [
    {
      id: 'doc-ext-1',
      name: 'SECURE_REFERRAL_SMITH_DOE.PDF',
      sender: 'Pinecrest Dental Group (Dentist)',
      date: '10:15 AM 06/30/2026',
      size: '1.4 MB',
      fromChannel: false,
      isExternal: true,
      transport: 'Email'
    },
    {
      id: 'doc-ext-2',
      name: 'EFAX_CBCT_MANDIBLE_PATEL.ZIP',
      sender: 'Oakwood Family Dental (Dentist)',
      date: '08:45 AM 06/30/2026',
      size: '12.8 MB',
      fromChannel: false,
      isExternal: true,
      transport: 'Fax'
    }
  ];
  const dashboardDocsSpecialistArchived: DashboardDoc[] = [];
  
  const dashboardDocsDentist: DashboardDoc[] = [];
  const dashboardDocsDentistArchived: DashboardDoc[] = [];

  // Add the base/original referrals to keep the existing prototype demos working
  const baseReferrals: UnifiedReferral[] = [
    { id: '1', patientName: 'Alice Cooper', type: 'Endodontic Consultation', source: 'Email', completion: 55, status: 'Scheduled', receivedAt: '08:20 AM\n06/05/2026', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Sunshine Dental', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
    { id: '2', patientName: 'Bob Marley', type: 'Dental Implant', source: 'Fax', completion: 45, status: 'Received', receivedAt: '06:20 AM\n06/08/2026', dentist: 'Dr. Jones', specialist: 'Downtown Oral Surgery', specialistDoctor: 'Dr. Bob Wilson', practice: 'Desert Bloom Dental', urgency: 'Urgent' },
    { id: '3', patientName: 'Charlie Brown', type: 'Emergency Extraction', source: 'App', completion: 100, status: 'Scheduled', receivedAt: '10:20 AM\n06/07/2026', dentist: 'Dr. Miller', specialist: 'Metro Orthodontics', specialistDoctor: 'Dr. Carol Danvers', practice: 'Miller & Associates', urgency: 'Emergency' },
    { id: '5', patientName: 'Eve Online', type: 'Periodontal Surgery', source: 'Email', completion: 30, status: 'Scheduled', receivedAt: '09:20 AM\n05/11/2026', dentist: 'Dr. Black', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Black Family Dental', urgency: 'Routine' },
    { id: '6', patientName: 'Frank Sinatra', type: 'Endodontic Root Canal', source: 'Web', completion: 95, status: 'Completed', receivedAt: '02:15 PM\n05/20/2026', dentist: 'Dr. Smith', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Sunshine Dental', urgency: 'Routine' },
    { id: '4', patientName: 'David Bowie', type: 'Invisalign Eval', source: 'Web', completion: 88, status: 'Completed', receivedAt: '10:20 AM\n02/09/2026', dentist: 'Dr. White', specialist: 'Arizona Periodontics', specialistDoctor: 'Dr. Carol Danvers', practice: 'White Dental Group', urgency: 'Routine' },
    { id: '7', patientName: 'Grace Kelly', type: 'Apexification', source: 'App', completion: 100, status: 'Completed', receivedAt: '11:30 AM\n02/14/2026', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Sunshine Dental', urgency: 'Routine' },
    { id: '8', patientName: 'Elvis Presley', type: 'Endodontic Retreat', source: 'Fax', completion: 100, status: 'Completed', receivedAt: '09:10 AM\n10/12/2025', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Sunshine Dental', urgency: 'Routine' },
    { id: '9', patientName: 'Marilyn Monroe', type: 'Consultation', source: 'Email', completion: 45, status: 'Received', receivedAt: '03:40 PM\n11/05/2025', dentist: 'Dr. Smith', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Sunshine Dental', urgency: 'Urgent' },
    { id: 'ext-ref-1', patientName: 'Jane Doe', type: 'Endodontic Evaluation', source: 'Email', completion: 35, status: 'Received', receivedAt: '10:15 AM\n06/30/2026', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Pinecrest Dental Group', urgency: 'Urgent' },
    { id: 'ext-ref-2', patientName: 'Kunal Patel', type: 'Dental Implant', source: 'Fax', completion: 65, status: 'Received', receivedAt: '08:45 AM\n06/29/2026', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Bob Wilson', practice: 'Oakwood Family Dental', urgency: 'Emergency' },
    
    // Dentist dashboard referrals
    { id: 'D-1002', patientName: 'Marco Reyes', type: 'Extraction Evaluation', source: 'Fax', completion: 45, status: 'Sent' as any, receivedAt: '08:20 AM\n06/08/2026', lastUpdate: '08:20 AM\n06/08/2026', nextStep: 'Waiting for specialist review', dentist: 'Dr. Taylor Reed', specialist: 'Downtown Oral Surgery', specialistDoctor: 'Dr. Bob Wilson', practice: 'Sunshine Dental', urgency: 'Urgent', sender: 'Dr. Taylor Reed' },
    { id: 'D-1003', patientName: 'Nina Patel', type: 'Periodontal Surgery', source: 'Web', completion: 80, status: 'Scheduled', receivedAt: '10:20 AM\n06/07/2026', lastUpdate: '10:20 AM\n06/07/2026', nextStep: 'Appointment confirmed for Tuesday', dentist: 'Dr. Taylor Reed', specialist: 'Arizona Periodontics', specialistDoctor: 'Dr. Carol Danvers', practice: 'Sunshine Dental', urgency: 'Emergency', sender: 'Dr. Taylor Reed' },
    { id: 'D-1005', patientName: 'Sarah Jenkins', type: 'Endodontic Consultation', source: 'Email', completion: 60, status: 'Sent' as any, receivedAt: '10:05 AM\n05/11/2026', lastUpdate: '10:05 AM\n05/11/2026', nextStep: 'Waiting for specialist review', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Sunshine Dental', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
    { id: 'D-1006', patientName: 'James Dean', type: 'Dental Implant', source: 'Web', completion: 100, status: 'Completed', receivedAt: '01:30 PM\n05/15/2026', lastUpdate: '01:30 PM\n05/15/2026', nextStep: 'Treatment complete', dentist: 'Dr. Taylor Reed', specialist: 'Downtown Oral Surgery', specialistDoctor: 'Dr. Bob Wilson', practice: 'Sunshine Dental', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
    { id: 'D-1004', patientName: 'Sarah Jenkins', type: 'Consultation', source: 'App', completion: 20, status: 'Draft', receivedAt: '03:14 PM\n02/11/2026', lastUpdate: '03:14 PM\n02/11/2026', nextStep: 'Draft saved', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Sunshine Dental', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
    { id: 'D-1007', patientName: 'Humphrey Bogart', type: 'Root Canal', source: 'Email', completion: 100, status: 'Completed', receivedAt: '09:00 AM\n02/20/2026', lastUpdate: '09:00 AM\n02/20/2026', nextStep: 'Follow-up done', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Sunshine Dental', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
    { id: 'D-1008', patientName: 'Audrey Hepburn', type: 'Consultation', source: 'App', completion: 100, status: 'Completed', receivedAt: '11:00 AM\n10/10/2025', lastUpdate: '11:00 AM\n10/10/2025', nextStep: 'Case closed', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', specialistDoctor: 'Dr. Emma Smith', practice: 'Sunshine Dental', urgency: 'Routine', sender: 'Dr. Taylor Reed' }
  ];

  referrals.push(...baseReferrals);

  // Original base documents to keep things working
  const baseDocuments: SharedDocument[] = [
    { id: 'd1', channelId: 'case_1', name: 'PANO_ALICE_COOPER.PNG', size: '2.4 MB', type: 'image', sentBy: 'Valley Endodontics', sentAt: 'Today, 10:24 AM' },
    { id: 'd2', channelId: 'case_1', name: 'REFERRAL_FORM_SIGNED.PDF', size: '1.1 MB', type: 'pdf', sentBy: 'Me', sentAt: 'Today, 11:05 AM' },
    { id: 'd7_1', channelId: 'case_D-1002', name: 'REFERRAL_MARCO_REYES.PDF', size: '1.3 MB', type: 'pdf', sentBy: 'Me', sentAt: '06/08/2026, 08:20 AM' },
    { id: 'd7_2', channelId: 'case_D-1002', name: 'IMPLANT_SCAN_REYES.ZIP', size: '15.2 MB', type: 'zip', sentBy: 'Me', sentAt: '06/08/2026, 08:20 AM' },
    { id: 'd8_1', channelId: 'case_D-1003', name: 'REFERRAL_NINA_PATEL.PDF', size: '1.2 MB', type: 'pdf', sentBy: 'Me', sentAt: '06/07/2026, 10:20 AM' },
    { id: 'd9_1', channelId: 'case_D-1005', name: 'REFERRAL_SARAH_JENKINS.PDF', size: '1.4 MB', type: 'pdf', sentBy: 'Me', sentAt: '05/11/2026, 10:05 AM' },
    { id: 'd3', channelId: '6', name: 'PRACTICE_CREDENTIALS.PDF', size: '3.2 MB', type: 'pdf', sentBy: 'Beverly Hills Dental', sentAt: 'Yesterday, 04:15 PM' },
    { id: 'd_gen3', channelId: '3', name: 'VALLEY_ENDO_FEE_SCHEDULE_2026.PDF', size: '1.5 MB', type: 'pdf', sentBy: 'Valley Endodontics', sentAt: 'Yesterday, 02:30 PM' },
    { id: 'd_gen7', channelId: '7', name: 'DOWNTOWN_CONSENT_FORMS.ZIP', size: '4.8 MB', type: 'zip', sentBy: 'Downtown Oral Surgery', sentAt: 'Yesterday, 04:00 PM' }
  ];
  documents.push(...baseDocuments);

  // Generate specialist referrals (Valley Endodontics) and dentist referrals (sent by Dr. Taylor Reed)
  // We distribute them exactly on work days (Monday to Friday, ~20 days a month).
  // Each work day receives 4-5 referrals per side, and weekends receive 0.
  // This averages ~4.5 referrals per work day per side, which is ~90 a month (~540 in 6 months).
  let i = 20;
  for (let dayDiff = 0; dayDiff < 180; dayDiff++) {
    const refDate = new Date('2026-06-30T18:00:00');
    refDate.setDate(refDate.getDate() - dayDiff);
    const dayOfWeek = refDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Determine daily counts
    let numSpecialist = 0;
    let numDentist = 0;

    if (!isWeekend) {
      // 4 or 5 referrals on work days
      numSpecialist = dayDiff % 2 === 0 ? 4 : 5;
      numDentist = (dayDiff + 1) % 2 === 0 ? 4 : 5;
    }

    // Combine them into a single list to generate
    const dailyList: { isDentistSide: boolean }[] = [];
    for (let k = 0; k < numDentist; k++) dailyList.push({ isDentistSide: true });
    for (let k = 0; k < numSpecialist; k++) dailyList.push({ isDentistSide: false });

    for (const item of dailyList) {
      const isDentistSide = item.isDentistSide;
      const r1 = getDeterministicRandom(i);
      const r2 = getDeterministicRandom(i + 100);
      const r3 = getDeterministicRandom(i + 200);
      const r4 = getDeterministicRandom(i + 300);

      // Status assignment based on how old the referral is (dayDiff)
      let status: ReferralStatus = 'Completed';
      if (dayDiff === 0) {
        // Today's incoming referrals: 90% Received (Review), 10% Scheduled
        status = r4 < 0.90 ? 'Received' : 'Scheduled';
      } else if (dayDiff === 1) {
        // Yesterday's referrals: 60% Received (Review), 40% Scheduled
        status = r4 < 0.60 ? 'Received' : 'Scheduled';
      } else if (dayDiff < 5) {
        // Less than 5 days ago: 30% Received, 50% Scheduled, 20% Completed
        status = r4 < 0.30 ? 'Received' : r4 < 0.80 ? 'Scheduled' : 'Completed';
      } else if (dayDiff < 30) {
        // 5 to 30 days ago: 20% Scheduled, 70% Completed, 10% Archived
        status = r4 < 0.20 ? 'Scheduled' : r4 < 0.90 ? 'Completed' : 'Archived';
      } else {
        // More than 30 days ago: 70% Completed, 30% Archived
        status = r4 < 0.70 ? 'Completed' : 'Archived';
      }

      // Dentist side drafts: some dentist referrals can be drafts (e.g. if dayDiff <= 2 and random is high)
      if (isDentistSide && dayDiff <= 2 && r4 > 0.92) {
        status = 'Draft';
      }

      // For specialist side, force Received/Scheduled/Completed/Archived (no drafts)
      if (!isDentistSide && status === 'Draft') {
        status = r4 < 0.5 ? 'Received' : 'Scheduled';
      }

      const pFirst = FIRST_NAMES[Math.floor(r1 * FIRST_NAMES.length)];
      const pLast = LAST_NAMES[Math.floor(r2 * LAST_NAMES.length)];
      const patientName = `${pFirst} ${pLast}`;

      const urgency: 'Routine' | 'Urgent' | 'Emergency' = r3 < 0.65 ? 'Routine' : r3 < 0.88 ? 'Urgent' : 'Emergency';

      let refId = '';
      let dentist = '';
      let specialist = '';
      let practice = '';
      let sender = '';
      let type = '';

      if (isDentistSide) {
        // Sent by dentist Dr. Taylor Reed to various specialist clinics
        refId = `D-${1000 + i}`;
        dentist = 'Dr. Taylor Reed';
        sender = 'Dr. Taylor Reed';
        practice = 'Sunshine Dental';
        
        const clinic = specialistClinics[Math.floor(r2 * specialistClinics.length)];
        specialist = clinic.name;

        // Choose procedure
        type = clinic.name.includes('Endodontics') || clinic.name.includes('Endodontic')
          ? ENDO_PROCEDURES[Math.floor(r3 * ENDO_PROCEDURES.length)]
          : OTHER_PROCEDURES[Math.floor(r3 * OTHER_PROCEDURES.length)];
      } else {
        // Received by specialist Valley Endodontics from various referring dentists
        refId = `${i}`;
        specialist = 'Valley Endodontics';
        
        const dentistPractice = dentistPractices[Math.floor(r2 * dentistPractices.length)];
        practice = dentistPractice.name;
        dentist = `Dr. ${LAST_NAMES[Math.floor(r3 * LAST_NAMES.length)]}`;
        sender = dentist;
        type = ENDO_PROCEDURES[Math.floor(r3 * ENDO_PROCEDURES.length)];
      }

      // Determine completion
      let completion = 100;
      if (status === 'Completed') completion = 100;
      else if (status === 'Scheduled') completion = Math.floor(45 + r1 * 45); // 45-90%
      else if (status === 'Received') completion = Math.floor(15 + r1 * 40); // 15-55%
      else if (status === 'Archived') completion = 100;
      else if (status === 'Draft') completion = Math.floor(r1 * 25); // 0-25%

      const refDate = new Date('2026-06-30T18:00:00');
      refDate.setDate(refDate.getDate() - dayDiff);
      
      const doubleDigits = (n: number) => n.toString().padStart(2, '0');
      const month = doubleDigits(refDate.getMonth() + 1);
      const dayStr = doubleDigits(refDate.getDate());
      const year = refDate.getFullYear();
      const hour = Math.floor(r2 * 12) + 1;
      const minute = doubleDigits(Math.floor(r3 * 60));
      const ampm = r4 > 0.5 ? 'PM' : 'AM';

      const receivedAt = `${doubleDigits(hour)}:${minute} ${ampm}\n${month}/${dayStr}/${year}`;
      const dateOnly = `${month}/${dayStr}/${year}`;
      const dateTimeSingleLine = `${month}/${dayStr}/${year}, ${doubleDigits(hour)}:${minute} ${ampm}`;

      let lastUpdate = dateTimeSingleLine;
      let nextStep = 'Waiting for specialist review';
      if (status === 'Scheduled') {
        nextStep = 'Appointment confirmed';
      } else if (status === 'Completed') {
        nextStep = 'Treatment complete';
      } else if (status === 'Archived') {
        nextStep = 'Case closed';
      } else if (status === 'Draft') {
        nextStep = 'Draft saved';
      }

      const referralItem: UnifiedReferral = {
        id: refId,
        patientName,
        type,
        source: ['Email', 'Fax', 'App', 'Web'][Math.floor(r3 * 4)],
        completion,
        status,
        receivedAt,
        lastUpdate,
        nextStep,
        dentist,
        specialist,
        practice,
        urgency,
        sender
      };

      referrals.push(referralItem);

      // Generate 2-3 case documents for this referral (unless it's a draft)
      if (status !== 'Draft') {
        const numDocs = r2 > 0.5 ? 3 : 2;
        const patientNameUnderscored = patientName.replace(/\s+/g, '_').toUpperCase();

        for (let j = 1; j <= numDocs; j++) {
          const docRand = getDeterministicRandom(i * 10 + j);
          const docId = `d_case_${refId}_${j}`;
          
          let docName = '';
          let docType: 'pdf' | 'image' | 'zip' | 'doc' = 'pdf';
          let size = '1.2 MB';

          if (j === 1) {
            docName = `REFERRAL_FORM_${patientNameUnderscored}.PDF`;
            docType = 'pdf';
            size = `${(0.8 + docRand * 0.9).toFixed(1)} MB`;
          } else if (j === 2) {
            docName = docRand < 0.4 
              ? `PANO_IMAGE_${patientNameUnderscored}.PNG`
              : docRand < 0.8
              ? `CBCT_SCAN_${patientNameUnderscored}.DCM`
              : `XRAY_MOUTH_${patientNameUnderscored}.JPG`;
            docType = docName.endsWith('.PNG') || docName.endsWith('.JPG') ? 'image' : 'doc';
            size = docName.endsWith('.DCM') ? `${(10.2 + docRand * 12).toFixed(1)} MB` : `${(2.1 + docRand * 2.5).toFixed(1)} MB`;
          } else {
            docName = docRand < 0.5 
              ? `CLINICAL_HISTORY_${patientNameUnderscored}.PDF` 
              : `PATIENT_CONSENT_${patientNameUnderscored}.PDF`;
            docType = 'pdf';
            size = `${(350 + docRand * 500).toFixed(0)} KB`;
          }

          const sharedDoc: SharedDocument = {
            id: docId,
            channelId: `case_${refId}`,
            name: docName,
            size,
            type: docType,
            sentBy: isDentistSide ? 'Me' : dentist,
            sentAt: `${dateOnly}, ${doubleDigits(hour)}:${minute} ${ampm}`
          };

          documents.push(sharedDoc);
        }

        // Generate messages inside case channel case_${refId}
        const channelId = `case_${refId}`;
        const msgSender = isDentistSide ? 'Me' : dentist;
        const msgRecipient = isDentistSide ? specialist : 'Me';

        const messagesList: MessageItem[] = [
          {
            id: `m_case_${refId}_1`,
            user: msgSender === 'Me' ? 'Me' : msgSender,
            text: `Hi ${msgRecipient}, referring patient ${patientName} for ${type}. Attached are the referral form and initial radiograph. Please coordinate care and update scheduling status.`,
            time: `${doubleDigits(hour)}:${minute} ${ampm}`,
            type: msgSender === 'Me' ? 'self' : 'other',
            transport: 'App',
            document: documents.find(d => d.id === `d_case_${refId}_1`)
          },
          {
            id: `m_case_${refId}_2`,
            user: msgRecipient === 'Me' ? 'Me' : msgRecipient,
            text: `Hi Dr. ${msgSender.split(' ').pop()}, clinical files received. We are processing the records and reaching out to the patient now.`,
            time: `${doubleDigits((hour + 1) % 12 || 12)}:${minute} ${ampm}`,
            type: msgRecipient === 'Me' ? 'self' : 'other',
            transport: 'App'
          }
        ];

        if (status === 'Scheduled') {
          messagesList.push({
            id: `m_case_${refId}_3`,
            user: msgRecipient === 'Me' ? 'Me' : msgRecipient,
            text: `Patient has been scheduled for appointment on ${month}/${doubleDigits(refDate.getDate() + 3)}/${year}.`,
            time: `02:00 PM`,
            type: msgRecipient === 'Me' ? 'self' : 'other',
            transport: 'App'
          });
        } else if (status === 'Completed' || status === 'Archived') {
          messagesList.push({
            id: `m_case_${refId}_3`,
            user: msgRecipient === 'Me' ? 'Me' : msgRecipient,
            text: `Treatment completed successfully. Post-op report attached for your records.`,
            time: `04:30 PM`,
            type: msgRecipient === 'Me' ? 'self' : 'other',
            transport: 'App',
            document: documents.find(d => d.id === `d_case_${refId}_2`)
          });
        }

        messages[channelId] = messagesList;
      }

      i++;
    }
  }

  // Generate 45 non-case related documents (practice documents, fee schedules, clinical policies)
  const nonCaseDocsNames = [
    "VALLEY_ENDO_FEE_SCHEDULE_2026.PDF", "CLINICAL_GUIDELINES_ENDODONTICS.PDF", "OFFICE_POLICY_REVISION_MAY26.PDF",
    "PRACTICE_CREDENTIALS_DR_SMITH.PDF", "DENTAL_IMPLANT_BROCHURE_V2.PDF", "COMPLIANCE_REPORT_Q1_2026.PDF",
    "SUPPLY_ORDER_LOG_APRIL.PDF", "EMERGENCY_PROTOCOLS_V3.PDF", "SUNSHINE_DENTAL_REFERRAL_GUIDELINES.PDF",
    "STAFF_TRAINING_MANUAL_2026.PDF", "PATIENT_INTAKE_TEMPLATE_EDITABLE.PDF", "DOWNTOWN_ORAL_SURGERY_FEE_SCHEDULE.PDF",
    "METRO_ORTHODONTICS_CONSENT_TEMPLATES.ZIP", "ARIZONA_PERIO_CLINICAL_POLICIES.PDF", "BEVERLY_HILLS_DENTAL_CREDENTIALS.PDF",
    "PANO_XRAY_MAINTENANCE_LOG.PDF", "HIPAA_COMPLIANCE_CHECKLIST_2026.PDF", "OSHA_SAFETY_GUIDELINES_POSTER.PDF",
    "MARKETING_COLLATERAL_DRTALK.ZIP", "INTEGRATION_STEPS_SUPABASE_DB.PDF", "FELLOWSHIP_CREDENTIALS_VALLEY.PDF",
    "PRACTICE_NEWSLETTER_SPRING26.PDF", "EQUIPMENT_WARRANTY_REGISTRY.ZIP", "DECAY_PREVENTION_PATIENT_HANDOUT.PDF",
    "POST_OP_CARE_INSTRUCTIONS_ROOT_CANAL.PDF", "POST_OP_CARE_WISDOM_TEETH.PDF", "IMPLANT_SURGERY_CONSENT_FORM.PDF",
    "ANESTHESIA_SAFETY_RECORD.PDF", "RESTORATIVE_DENTISTRY_JOURNAL_ART.PDF", "CBCT_CALIBRATION_CERTIFICATE.PDF",
    "NITROUS_OXIDE_LOG_BOOK.PDF", "DENTAL_UNIT_WATERLINE_TEST_REPORTS.ZIP", "STERILIZER_BIOLOGICAL_MONITORING.PDF",
    "LAB_SLIP_TEMPLATES_CROWN_BRIDGE.PDF", "INVISALIGN_CLINICAL_PREFERENCE_GUIDE.PDF", "ORTHODONTIC_BRACKET_INVENTORY.PDF",
    "SOFT_TISSUE_GRAFT_CARE_INSTRUCTIONS.PDF", "BONE_GRAFT_PATIENT_CONSENT.PDF", "DENTAL_HYGIENE_CLEANING_PROTOCOLS.PDF",
    "PERIODONTAL_CHARTING_SHORTCUTS.PDF", "CROWN_LENGTHENING_CASE_STUDIES.PDF", "APICOECTOMY_PROCEDURE_BRIEF.PDF",
    "APEXIFICATION_CLINICAL_TRIALS.PDF", "ENDODONTIC_RETREAT_INDICATIONS.PDF", "EMERGENCY_TRIAGE_PHONE_SCRIPT.PDF"
  ];

  for (let i = 0; i < nonCaseDocsNames.length; i++) {
    const docRand = getDeterministicRandom(i + 500);
    const docId = `doc-gen-noncase-${i}`;
    const name = nonCaseDocsNames[i];
    const extension = name.split('.').pop() || '';
    const type = extension === 'ZIP' ? 'zip' : extension === 'PNG' || extension === 'JPG' ? 'image' : 'pdf';
    
    // Size distribution
    const size = type === 'zip' 
      ? `${(5.2 + docRand * 15).toFixed(1)} MB` 
      : `${(0.9 + docRand * 3).toFixed(1)} MB`;

    // Sender distribution
    const senderPractices = ['Valley Endodontics', 'Sunshine Dental', 'Downtown Oral Surgery', 'Metro Orthodontics', 'Arizona Periodontics'];
    const sender = senderPractices[i % senderPractices.length];

    // Date distribution
    const dayDiff = Math.floor(docRand * 180);
    const docDate = new Date('2026-06-30T18:00:00');
    docDate.setDate(docDate.getDate() - dayDiff);
    const dateStr = `${docDate.getMonth() + 1}/${docDate.getDate()}/${docDate.getFullYear()}`;
    const timeStr = `${Math.floor(docRand * 12) + 1}:${docRand < 0.5 ? '15' : '45'} ${docRand < 0.5 ? 'AM' : 'PM'}`;

    // Create the SharedDocument item (for channel document tabs)
    const channelId = ['3', '6', '7', '8', '9'][i % 5];
    const sharedDoc: SharedDocument = {
      id: docId,
      channelId,
      name,
      size,
      type,
      sentBy: sender,
      sentAt: `${dateStr}, ${timeStr}`
    };
    documents.push(sharedDoc);

    // Create Dashboard Doc item
    const dashboardDoc: DashboardDoc = {
      id: docId,
      name,
      sender: sender.includes('Valley') || sender.includes('Downtown') || sender.includes('Metro') || sender.includes('Arizona')
        ? `${sender} (Specialist)`
        : `${sender} (Dentist)`,
      date: `${timeStr} ${dateStr}`,
      size,
      fromChannel: true,
      channelName: sender,
      channelType: 'practice'
    };

    // Partition dashboard docs for inbox / archived
    // Let's put 25 in active, 20 in archived
    if (i < 25) {
      // Specialist sees documents sent from dentists (Sunshine Dental etc.)
      if (sender.includes('Sunshine') || i % 2 === 0) {
        dashboardDocsSpecialist.push(dashboardDoc);
      } else {
        dashboardDocsDentist.push(dashboardDoc);
      }
    } else {
      if (sender.includes('Sunshine') || i % 2 === 0) {
        dashboardDocsSpecialistArchived.push(dashboardDoc);
      } else {
        dashboardDocsDentistArchived.push(dashboardDoc);
      }
    }
  }

  // Generate messages for all specialist clinics (inter-practice channels)
  specialistClinics.forEach((clinic) => {
    const messagesList: MessageItem[] = [
      {
        id: `m_clinic_${clinic.id}_1`,
        user: 'Dr. Taylor Reed',
        text: `Hello Team at ${clinic.name}, we are reviewing our referral protocols for the upcoming quarter. We will be sharing patient files directly through this channel.`,
        time: '09:30 AM',
        type: 'self'
      },
      {
        id: `m_clinic_${clinic.id}_2`,
        user: clinic.name,
        text: `Hi Dr. Reed! That sounds great. We have activated our secure connection and our front desk is ready to receive any incoming referrals.`,
        time: '10:15 AM',
        type: 'other'
      },
      {
        id: `m_clinic_${clinic.id}_3`,
        user: clinic.name,
        text: `We have also uploaded our latest specialty intake guidelines and fee schedule in the Documents tab of this channel for your convenience.`,
        time: '10:18 AM',
        type: 'other'
      }
    ];

    if (clinic.name === 'Valley Endodontics') {
      messagesList.push({
        id: `m_clinic_${clinic.id}_4`,
        user: clinic.name,
        text: `Pano image uploaded for Alice Cooper.`,
        time: '10:20 AM',
        type: 'other'
      });
    } else {
      messagesList.push({
        id: `m_clinic_${clinic.id}_4`,
        user: clinic.name,
        text: `Practice connection active.`,
        time: '10:20 AM',
        type: 'other'
      });
    }

    messages[clinic.id] = messagesList;
  });

  // Generate messages for all dentist practices (inter-practice channels)
  dentistPractices.forEach((practice) => {
    if (messages[practice.id]) {
      return; // already set by specialistClinics
    }
    messages[practice.id] = [
      {
        id: `m_practice_${practice.id}_1`,
        user: practice.name,
        text: `Hello Valley Endodontics, this is Dr. Taylor Reed's team at ${practice.name}. We wanted to check if our secure channel is active for patient referrals.`,
        time: '08:45 AM',
        type: 'other'
      },
      {
        id: `m_practice_${practice.id}_2`,
        user: 'Valley Endodontics',
        text: `Hi ${practice.name}! Yes, the connection is fully active. You can upload patient details, X-rays, and notes directly into individual case channels under this practice header.`,
        time: '09:12 AM',
        type: 'self'
      },
      {
        id: `m_practice_${practice.id}_3`,
        user: 'Valley Endodontics',
        text: `Let us know if you need any assistance setting up your staff credentials. Looking forward to working with you.`,
        time: '09:15 AM',
        type: 'self'
      },
      {
        id: `m_practice_${practice.id}_4`,
        user: 'Valley Endodontics',
        text: `Practice connection active.`,
        time: '09:20 AM',
        type: 'self'
      }
    ];
  });

  // Generate messages for internal and other default channels (team-members, admin-billing, Alice Cooper, general-updates)
  messages['1'] = [
    {
      id: 'm_internal_1_1',
      user: 'Dr. John Smith',
      text: 'Good morning everyone. Just a reminder that we have a staff meeting today at 1:00 PM.',
      time: '08:00 AM',
      type: 'other'
    },
    {
      id: 'm_internal_1_2',
      user: 'Jane Doe',
      text: 'Thanks for the reminder. Will we be discussing the new intake procedure?',
      time: '08:15 AM',
      type: 'other'
    },
    {
      id: 'm_internal_1_3',
      user: 'Dr. John Smith',
      text: "Yes, and we will also be reviewing tooth #14 endodontic record for Dr. Reed's referral.",
      time: '08:30 AM',
      type: 'other'
    },
    {
      id: 'm_internal_1_4',
      user: 'Jane Doe',
      text: 'Reviewing tooth #14...',
      time: '08:45 AM',
      type: 'other'
    }
  ];

  messages['2'] = [
    {
      id: 'm_internal_2_1',
      user: 'Sarah Wilson',
      text: 'Hi team, I am compiling the invoice summary for last month\'s referrals.',
      time: '09:00 AM',
      type: 'other'
    },
    {
      id: 'm_internal_2_2',
      user: 'Mike Johnson',
      text: 'Let me know if you need the detailed reports for Valley Endodontics.',
      time: '09:15 AM',
      type: 'other'
    },
    {
      id: 'm_internal_2_3',
      user: 'Sarah Wilson',
      text: 'Yes, please upload them here or in the general drive. I want to finalize the report today.',
      time: '09:30 AM',
      type: 'other'
    },
    {
      id: 'm_internal_2_4',
      user: 'Mike Johnson',
      text: 'March report ready.',
      time: '09:45 AM',
      type: 'other'
    }
  ];

  messages['4'] = [
    {
      id: 'm4_0',
      user: 'Me',
      text: 'Welcome to Sunshine Dental! To help us communicate about your care, appointments, and important health information, may we contact you via SMS/text message? Standard messaging rates may apply.\n\nPlease reply with:\n• Full Name:\n• Date of Birth (MM/DD/YYYY):\n\nReply YES to consent to SMS communication, or NO to decline.',
      time: '11:15 AM',
      type: 'self',
      transport: 'SMS'
    },
    {
      id: 'm4_1',
      user: 'Alice Cooper',
      text: 'YES\nAlice Cooper\n02/04/1948',
      time: '11:15 AM',
      type: 'other',
      transport: 'SMS'
    },
    {
      id: 'm4_2',
      user: 'Me',
      text: 'Just avoid eating 2 hours before the procedure. We will send a formal prep guide to your email shortly.',
      time: '11:20 AM',
      type: 'self',
      transport: 'Email'
    },
    {
      id: 'm4_3',
      user: 'Alice Cooper',
      text: 'Got it, thank you!',
      time: '11:25 AM',
      type: 'other',
      transport: 'SMS'
    }
  ];

  messages['5'] = [
    {
      id: 'm_public_5_1',
      user: 'System',
      text: 'Hello everyone, welcome to our new practice communication platform!',
      time: '08:00 AM',
      type: 'other'
    },
    {
      id: 'm_public_5_2',
      user: 'System',
      text: 'We can now communicate securely with referring offices and coordinate patient care in real time.',
      time: '08:05 AM',
      type: 'other'
    },
    {
      id: 'm_public_5_3',
      user: 'System',
      text: 'Feel free to invite other team members to join our channels.',
      time: '08:10 AM',
      type: 'other'
    },
    {
      id: 'm_public_5_4',
      user: 'System',
      text: 'Welcome to the network!',
      time: '08:15 AM',
      type: 'other'
    }
  ];

  // Ensure that each connected practice channel's last message is set to something clean
  return {
    referrals,
    documents,
    messages,
    dashboardDocsSpecialist,
    dashboardDocsSpecialistArchived,
    dashboardDocsDentist,
    dashboardDocsDentistArchived
  };
}

export function getInitialSpecialistDocs(): DashboardDoc[] {
  const mock = generateMockData();
  return mock.dashboardDocsSpecialist;
}

export function getInitialSpecialistArchivedDocs(): DashboardDoc[] {
  const mock = generateMockData();
  return mock.dashboardDocsSpecialistArchived;
}

export function getInitialDentistDocs(): DashboardDoc[] {
  const mock = generateMockData();
  return mock.dashboardDocsDentist;
}

export function getInitialDentistArchivedDocs(): DashboardDoc[] {
  const mock = generateMockData();
  return mock.dashboardDocsDentistArchived;
}
