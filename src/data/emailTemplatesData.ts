export interface EmailTemplateItem {
  id: string;
  sectionNumber: string;
  category: '1.1' | '1.2' | '1.3' | '1.4' | '1.5';
  categoryLabel: string;
  trigger: string;
  audience: string;
  subject: string;
  templateFile: string;
  summary: string;
  plainText: string;
  htmlContent: string;
}

export const EMAIL_GROUPS = [
  { id: '1.1', title: '1.1 Account, onboarding, and access' },
  { id: '1.2', title: '1.2 Practice connection and network' },
  { id: '1.3', title: '1.3 Referral, document, and secure message flows' },
  { id: '1.4', title: '1.4 Billing, trial, and operational emails' },
  { id: '1.5', title: '1.5 Scheduled reporting emails' },
];

const COMMON_CSS = `
  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; color: #1e293b; }
  .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .header { background: #3A2382; padding: 32px 24px; text-align: center; color: #ffffff; }
  .header-logo { font-size: 28px; font-weight: 800; tracking: -0.03em; margin: 0; }
  .header-logo span.dr { color: #60A5FA; }
  .content { padding: 36px 32px; font-size: 15px; line-height: 1.6; color: #334155; }
  .title { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
  .blue { color: #4292F0; font-weight: 600; }
  .purple { color: #3A2382; font-weight: 600; }
  .btn-primary { display: inline-block; background-color: #3A2382; color: #ffffff !important; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin: 24px 0; font-size: 15px; text-align: center; }
  .btn-blue { display: inline-block; background-color: #4292F0; color: #ffffff !important; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin: 24px 0; font-size: 15px; text-align: center; }
  .btn-danger { display: inline-block; background-color: #DC2626; color: #ffffff !important; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin: 24px 0; font-size: 15px; text-align: center; }
  .info-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px 20px; margin: 20px 0; }
  .info-card p { margin: 4px 0; font-size: 14px; }
  .code-box { display: inline-block; background: #EEF2FF; border: 2px dashed #6366F1; color: #4338CA; font-family: monospace; font-size: 26px; font-weight: 800; letter-spacing: 4px; padding: 12px 24px; border-radius: 8px; margin: 16px 0; }
  .footer { background-color: #F1F5F9; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }
  .footer p { margin: 4px 0; }
  .app-badges { margin-top: 20px; }
  .app-badge { display: inline-block; background: #0f172a; color: #fff; padding: 8px 16px; border-radius: 6px; font-size: 11px; text-decoration: none; margin: 0 4px; font-weight: 600; }
`;

export const EMAIL_TEMPLATES: EmailTemplateItem[] = [
  // ==========================================
  // 1.1 Account, onboarding, and access
  // ==========================================
  {
    id: '1.1-1-team-invite',
    sectionNumber: '1.1.1',
    category: '1.1',
    categoryLabel: '1.1 Account, onboarding, and access',
    trigger: 'Added to practice/team',
    audience: 'New team member/patient user',
    subject: 'Dr. Sarah Jenkins has added you to drtalk',
    templateFile: 'EmailInvitationAsTeamMember.cshtml',
    summary: 'Welcome and setup details template containing temporary credentials and app download links.',
    plainText: `Hello Alex Morgan,\n\nDr. Sarah Jenkins has added you to Valley Dental Clinic on drtalk.\nYour temporary password is: TempPass2026!\n\nPlease log in to complete your setup: https://drtalk.com/login`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk</h1>
    </div>
    <div class="content">
      <h2 class="title">Welcome to drtalk, Alex Morgan!</h2>
      <p><strong>Dr. Sarah Jenkins</strong> has added you to the team at <span class="purple">Valley Dental Clinic</span> on drtalk.</p>
      <p>drtalk is your practice's HIPAA-compliant platform for instant team messaging, referrals, and secure document sharing.</p>
      
      <div class="info-card">
        <p><strong>Your Account Details:</strong></p>
        <p>Email: alex.morgan@valleydental.com</p>
        <p>Temporary Password: <strong style="color: #3A2382;">TempPass2026!</strong></p>
      </div>

      <div style="text-align: center;">
        <a href="https://drtalk.com/login" class="btn-primary">Log In & Set Password</a>
      </div>

      <p style="font-size: 13px; color: #64748B;">For security, please change your password upon your first sign-in.</p>
      
      <div class="app-badges" style="text-align: center; margin-top: 30px;">
        <p style="font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 10px;">GET THE DRTALK APP</p>
        <a href="#" class="app-badge">iOS App Store</a>
        <a href="#" class="app-badge">Google Play Store</a>
        <a href="#" class="app-badge">Windows Desktop</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Inc. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.1-2-verify-email',
    sectionNumber: '1.1.2',
    category: '1.1',
    categoryLabel: '1.1 Account, onboarding, and access',
    trigger: 'Verify email',
    audience: 'New or updating user',
    subject: 'Verify your email',
    templateFile: 'EmailVerification.cshtml',
    summary: 'Verification prompt/link or verification code flow to confirm user email address.',
    plainText: `Hello Alex Morgan,\n\nWe just need to confirm your email address to complete your drtalk account setup.\n\nPlease click here to verify: https://drtalk.com/verify?code=948123`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk</h1>
    </div>
    <div class="content">
      <h2 class="title">Hello Alex Morgan,</h2>
      <p>We just need to confirm your email address to complete your <span class="blue">drtalk</span> account setup for <strong>Valley Dental Clinic</strong>.</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="#" class="btn-blue">Verify Email Address</a>
      </div>

      <p>Once verified, please sign in to finish setting up your practice channels and inviting your staff.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.1-3a-password-reset-link',
    sectionNumber: '1.1.3a',
    category: '1.1',
    categoryLabel: '1.1 Account, onboarding, and access',
    trigger: 'Password reset (Request Link & Code)',
    audience: 'Existing user',
    subject: 'Password Reset',
    templateFile: 'EmailVerificationCodeContent.cshtml',
    summary: 'Password reset request verification link and code (Subject: "Password Reset").',
    plainText: `Hello Alex Morgan,\n\nWe received a request to reset your drtalk password.\nUse verification code 491029 or click your secure reset link:\nhttps://drtalk.com/reset-password/ref-941029`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk</h1>
    </div>
    <div class="content">
      <h2 class="title">Password Reset Request</h2>
      <p>Hello Alex Morgan,</p>
      <p>We received a request to reset the password for your drtalk account.</p>

      <div style="text-align: center; margin: 20px 0;">
        <div class="code-box">491 029</div>
      </div>

      <div style="text-align: center;">
        <a href="#" class="btn-primary">Click Here to Reset Password</a>
      </div>

      <p style="font-size: 13px; color: #64748B;">If you did not request a password reset, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.1-3b-password-reset-temp',
    sectionNumber: '1.1.3b',
    category: '1.1',
    categoryLabel: '1.1 Account, onboarding, and access',
    trigger: 'Password reset (Temporary Password Delivery)',
    audience: 'Existing user',
    subject: 'Reset drtalk password',
    templateFile: 'ResetPassword.cshtml',
    summary: 'Delivers a new temporary password directly in email body (Subject: "Reset drtalk password").',
    plainText: `Hello Alex Morgan,\n\nYour new password is: Res3tPass!99\n\nPlease log in and update your password under Account Settings.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk</h1>
    </div>
    <div class="content">
      <h2 class="title">Password Reset</h2>
      <p>Hello Alex Morgan,</p>
      <p>We received a request to reset your password for your drtalk account.</p>

      <div class="info-card" style="text-align: center;">
        <p style="font-size: 13px; color: #64748B;">Your new temporary password:</p>
        <p style="font-size: 20px; font-weight: 700; color: #3A2382; font-family: monospace;">Res3tPass!99</p>
      </div>

      <div style="text-align: center;">
        <a href="#" class="btn-primary">Log In to drtalk</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.1-4-setup-team',
    sectionNumber: '1.1.4',
    category: '1.1',
    categoryLabel: '1.1 Account, onboarding, and access',
    trigger: 'Setup team',
    audience: 'Super admin / practice contact',
    subject: 'Setup My Team',
    templateFile: 'EmailSetupMyTeam.cshtml',
    summary: 'Team setup guidance prompt to add clinical & office staff.',
    plainText: `Hello Dr. Jenkins,\n\nYour practice Valley Dental Clinic is ready! Next step: Add your clinical and administrative team to drtalk.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk</h1>
    </div>
    <div class="content">
      <h2 class="title">Setup Your Practice Team</h2>
      <p>Hello <strong>Dr. Sarah Jenkins</strong>,</p>
      <p>Your practice, <strong>Valley Dental Clinic</strong>, is now active on drtalk!</p>
      <p>To get the full power of HIPAA-compliant team messaging and instant patient file sharing, invite your hygienists, front desk staff, and associate doctors.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn-primary">Setup My Team</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.1-5-end-of-onboarding',
    sectionNumber: '1.1.5',
    category: '1.1',
    categoryLabel: '1.1 Account, onboarding, and access',
    trigger: 'End of onboarding',
    audience: 'User',
    subject: 'Welcome to drtalk!',
    templateFile: 'EmailEndOfOnboarding.cshtml',
    summary: 'Onboarding completion welcome message & feature summary.',
    plainText: `Welcome to drtalk!\nYour account setup is complete. You can now chat securely with staff, connect with partner practices, and send HIPAA-compliant patient referrals.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: linear-gradient(135deg, #3A2382 0%, #4292F0 100%);">
      <h1 class="header-logo"><span class="dr">dr</span>talk</h1>
    </div>
    <div class="content">
      <h2 class="title" style="color: #3A2382;">Welcome to drtalk!</h2>
      <p>Congratulations, Alex! Your onboarding is complete and your practice environment is active.</p>
      
      <div class="info-card">
        <p><strong>What you can do now:</strong></p>
        <ul style="margin: 8px 0; padding-left: 20px;">
          <li>Connect with local specialist & dentist practices</li>
          <li>Send & track HIPAA-secure referral letters with attachments</li>
          <li>Chat in real-time with internal practice staff</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="#" class="btn-blue">Launch Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.1-6-identity-verified',
    sectionNumber: '1.1.6',
    category: '1.1',
    categoryLabel: '1.1 Account, onboarding, and access',
    trigger: 'Identity verified confirmation',
    audience: 'User',
    subject: 'Identity Verified',
    templateFile: 'EmailIDVerification.cshtml',
    summary: 'Confirms successful ID verification and provides login CTA.',
    plainText: `Hello Dr. Jenkins,\nYour identity verification has been successfully verified by drtalk compliance.\nYour full referral permissions are now enabled.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #059669;">
      <h1 class="header-logo" style="color: white;">Identity Verified ✓</h1>
    </div>
    <div class="content">
      <h2 class="title">Identity Verified</h2>
      <p>Hello <strong>Dr. Sarah Jenkins</strong>,</p>
      <p>Your practitioner profile and NPI license have been successfully verified by our credentialing team.</p>

      <div style="text-align: center;">
        <a href="#" class="btn-primary" style="background-color: #059669;">Open drtalk App</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.1-7-account-deletion',
    sectionNumber: '1.1.7',
    category: '1.1',
    categoryLabel: '1.1 Account, onboarding, and access',
    trigger: 'Account deletion confirmation',
    audience: 'User',
    subject: 'Your drtalk account has been deleted',
    templateFile: 'AccountDeletionConfirmation.cshtml',
    summary: 'Confirms account deletion completion and removes user access.',
    plainText: `Hello Alex Morgan,\nYour drtalk account and associated access token data have been permanently deleted per your request.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #475569;">
      <h1 class="header-logo" style="color: white;">Account Deleted</h1>
    </div>
    <div class="content">
      <h2 class="title">Your drtalk account has been deleted</h2>
      <p>Hello Alex Morgan,</p>
      <p>This email confirms that your drtalk account for <strong>alex.morgan@valleydental.com</strong> has been permanently removed from our system.</p>
      <p>If this was done in error or you need support, please contact support@drtalk.com.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },

  // ==========================================
  // 1.2 Practice connection and network
  // ==========================================
  {
    id: '1.2-1-practice-connect-invite',
    sectionNumber: '1.2.1',
    category: '1.2',
    categoryLabel: '1.2 Practice connection and network',
    trigger: 'Practice connection invite',
    audience: 'External/target practice user',
    subject: 'Connect with Apex Endodontics',
    templateFile: 'ConnectPracticeRequest.cshtml',
    summary: 'Invitation to connect practices with accept/decline actions.',
    plainText: `Hello Valley Dental Clinic,\nDr. Mark Vance from Apex Endodontics wants to connect with your practice on drtalk to share referrals and patient care updates.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk Network</h1>
    </div>
    <div class="content">
      <h2 class="title">Connect with Apex Endodontics</h2>
      <p>Hello <strong>Valley Dental Clinic</strong>,</p>
      <p><strong>Dr. Mark Vance</strong> at <span class="purple">Apex Endodontics</span> has invited your office to connect on drtalk.</p>

      <div class="info-card">
        <p>Connecting allows instant inter-office chat, quick referral status updates, and direct X-ray/document sharing.</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn-blue">Accept Connection Request</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.2-2-new-practice-invite',
    sectionNumber: '1.2.2',
    category: '1.2',
    categoryLabel: '1.2 Practice connection and network',
    trigger: 'New practice invitation',
    audience: 'External recipient',
    subject: 'Invitation from Valley Dental Clinic for drtalk',
    templateFile: 'ConnectNewPracticeRequest.cshtml',
    summary: 'Invitation to connect to a new practice on drtalk.',
    plainText: `Hello,\nValley Dental Clinic has invited your practice to join drtalk and establish a secure inter-office connection.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk</h1>
    </div>
    <div class="content">
      <h2 class="title">Invitation from Valley Dental Clinic for drtalk</h2>
      <p>Hello,</p>
      <p><strong>Valley Dental Clinic</strong> uses drtalk for fast HIPAA-compliant referrals and instant specialist communication, and would like to invite your practice to connect.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn-primary">Accept & Create Account</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.2-3-practice-invite-accepted',
    sectionNumber: '1.2.3',
    category: '1.2',
    categoryLabel: '1.2 Practice connection and network',
    trigger: 'Practice invite accepted',
    audience: 'Requesting party',
    subject: 'drtalk invitation accepted',
    templateFile: 'ConnectedPracticeAccepted.cshtml',
    summary: 'Confirms connection acceptance from invited practice.',
    plainText: `Great news! Apex Endodontics accepted your connection request on drtalk. You can now send referrals and direct messages.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #2563EB;">
      <h1 class="header-logo">Connection Accepted</h1>
    </div>
    <div class="content">
      <h2 class="title">drtalk invitation accepted</h2>
      <p>Hello Dr. Sarah Jenkins,</p>
      <p><strong>Apex Endodontics</strong> has accepted your invitation to connect on drtalk.</p>

      <div style="text-align: center;">
        <a href="#" class="btn-primary">Send Referral Now</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.2-4-practice-invite-declined',
    sectionNumber: '1.2.4',
    category: '1.2',
    categoryLabel: '1.2 Practice connection and network',
    trigger: 'Practice invite declined',
    audience: 'Requesting party',
    subject: 'Declined: connection request',
    templateFile: 'ConnectedPracticeDeclined.cshtml',
    summary: 'Decline notification for practice connection invitation.',
    plainText: `Hello Dr. Jenkins,\nApex Endodontics has declined your connection request on drtalk.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #64748B;">
      <h1 class="header-logo">Connection Status</h1>
    </div>
    <div class="content">
      <h2 class="title">Declined: connection request</h2>
      <p>Hello Dr. Sarah Jenkins,</p>
      <p><strong>Apex Endodontics</strong> has declined your practice connection request on drtalk.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.2-5-new-practice-invite-declined',
    sectionNumber: '1.2.5',
    category: '1.2',
    categoryLabel: '1.2 Practice connection and network',
    trigger: 'New-practice invite declined',
    audience: 'Requesting party',
    subject: 'Declined: connection request for the new practice',
    templateFile: 'ConnectedNewPracticeDeclined.cshtml',
    summary: 'Decline notification for new-practice invite flow.',
    plainText: `Hello Dr. Jenkins,\nThe new practice connection invitation sent to Horizon Dental was declined.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #64748B;">
      <h1 class="header-logo">Connection Status</h1>
    </div>
    <div class="content">
      <h2 class="title">Declined: connection request for the new practice</h2>
      <p>Hello Dr. Sarah Jenkins,</p>
      <p>The invite to connect sent to <strong>Horizon Dental</strong> was declined.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.2-6-person-connect-request',
    sectionNumber: '1.2.6',
    category: '1.2',
    categoryLabel: '1.2 Practice connection and network',
    trigger: 'Person-to-person connection request',
    audience: 'Individual recipient',
    subject: 'Dr. Michael Chang wants to connect with you on drtalk',
    templateFile: 'PersonConnectionRequest.cshtml',
    summary: 'Invite to connect individual users.',
    plainText: `Hello Alex Morgan,\nDr. Michael Chang wants to connect with you on drtalk. Log in to accept.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk</h1>
    </div>
    <div class="content">
      <h2 class="title">Dr. Michael Chang wants to connect with you on drtalk</h2>
      <p>Hello Alex Morgan,</p>
      <p><strong>Dr. Michael Chang</strong> (Periodontics) wants to connect with you on drtalk.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn-blue">Accept Request</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.2-7-person-connect-accepted',
    sectionNumber: '1.2.7',
    category: '1.2',
    categoryLabel: '1.2 Practice connection and network',
    trigger: 'Person-to-person connection accepted',
    audience: 'Request sender',
    subject: 'Dr. Michael Chang accepted your connection request',
    templateFile: 'PersonConnectionAccepted.cshtml',
    summary: 'Acceptance confirmation for individual person connection.',
    plainText: `Hello Alex Morgan,\nDr. Michael Chang accepted your connection request on drtalk.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #2563EB;">
      <h1 class="header-logo">Request Accepted</h1>
    </div>
    <div class="content">
      <h2 class="title">Dr. Michael Chang accepted your connection request</h2>
      <p>Hello Alex Morgan,</p>
      <p><strong>Dr. Michael Chang</strong> has accepted your individual connection request on drtalk.</p>

      <div style="text-align: center;">
        <a href="#" class="btn-primary">Open Chat</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },

  // ==========================================
  // 1.3 Referral, document, and secure message flows
  // ==========================================
  {
    id: '1.3-1-referral-patient-copy',
    sectionNumber: '1.3.1',
    category: '1.3',
    categoryLabel: '1.3 Referral, document, and secure message flows',
    trigger: 'Referral copy to patient',
    audience: 'Patient',
    subject: 'Valley Dental Clinic has sent you a copy of your Referral Letter',
    templateFile: 'PatientReferralCopy.cshtml',
    summary: 'Sends patient-facing referral copy details securely.',
    plainText: `Dear John Doe,\nValley Dental Clinic has prepared your referral to Apex Endodontics.\nYou can view your referral summary online at: https://drtalk.com/patient/ref?token=xyz`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #3A2382;">
      <h1 class="header-logo"><span class="dr">dr</span>talk Patient Portal</h1>
    </div>
    <div class="content">
      <h2 class="title">Valley Dental Clinic has sent you a copy of your Referral Letter</h2>
      <p>Dear <strong>John Doe</strong>,</p>
      <p><strong>Valley Dental Clinic</strong> has forwarded your referral to specialist <strong>Apex Endodontics</strong>.</p>
      
      <div class="info-card">
        <p><strong>Specialist:</strong> Apex Endodontics (Dr. Mark Vance)</p>
        <p><strong>Reason:</strong> Tooth #14 Endodontic Consultation</p>
      </div>

      <div style="text-align: center;">
        <a href="#" class="btn-primary">View Referral Document</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. Secure Patient Communications.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.3-2-secure-email-notice',
    sectionNumber: '1.3.2',
    category: '1.3',
    categoryLabel: '1.3 Referral, document, and secure message flows',
    trigger: 'Secure document email',
    audience: 'Recipient',
    subject: 'Valley Dental Clinic has sent you a secure email',
    templateFile: 'SecureEmailNotice.cshtml',
    summary: 'Secure document/message notice with access link/token.',
    plainText: `You have received a secure email from Valley Dental Clinic via drtalk.\nClick link to access: https://drtalk.com/secure-view?id=99281`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #1E1B4B;">
      <h1 class="header-logo" style="color: #818CF8;">🔒 Secure Document Delivery</h1>
    </div>
    <div class="content">
      <h2 class="title">Valley Dental Clinic has sent you a secure email</h2>
      <p>Hello,</p>
      <p><strong>Valley Dental Clinic</strong> has transmitted a HIPAA-compliant secure document to you via drtalk.</p>

      <div class="info-card">
        <p><strong>Sender:</strong> Dr. Sarah Jenkins</p>
        <p><strong>Subject:</strong> Patient Referral & Radiographs (John Doe)</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn-primary" style="background-color: #4F46E5;">Access Secure Document</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Secure Messaging.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.3-3-secure-email-pin',
    sectionNumber: '1.3.3',
    category: '1.3',
    categoryLabel: '1.3 Referral, document, and secure message flows',
    trigger: 'Secure document verification code',
    audience: 'Recipient',
    subject: 'Verification code to view secure email sent from Valley Dental Clinic',
    templateFile: 'RecipientDocumentPin.cshtml',
    summary: 'One-time verification code to open secure content.',
    plainText: `Your verification code to view secure email from Valley Dental Clinic is: 739201`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk Security</h1>
    </div>
    <div class="content" style="text-align: center;">
      <h2 class="title">Verification code to view secure email sent from Valley Dental Clinic</h2>
      <p>Enter this verification PIN to view the secure message:</p>

      <div class="code-box">739 201</div>

      <p style="font-size: 13px; color: #64748B;">This code expires in 10 minutes.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.3-4-referral-sent-notice',
    sectionNumber: '1.3.4',
    category: '1.3',
    categoryLabel: '1.3 Referral, document, and secure message flows',
    trigger: 'Referral sent confirmation',
    audience: 'Recipient practice/contact',
    subject: 'Referral Confirmation',
    templateFile: 'ReferralSentNotice.cshtml',
    summary: 'Confirms referral/document has been sent to specialist practice.',
    plainText: `Referral Confirmation:\nValley Dental Clinic has submitted a new patient referral for John Doe.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk Referrals</h1>
    </div>
    <div class="content">
      <h2 class="title">Referral Confirmation</h2>
      <p>Hello <strong>Apex Endodontics</strong>,</p>
      <p>You have received a new patient referral from <strong>Dr. Sarah Jenkins</strong> at <strong>Valley Dental Clinic</strong>.</p>

      <div class="info-card">
        <p><strong>Patient Name:</strong> John Doe (DOB: 05/14/1982)</p>
        <p><strong>Chief Complaint:</strong> Severe pain tooth #14</p>
      </div>

      <div style="text-align: center;">
        <a href="#" class="btn-primary">View Full Referral Details</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.3-5-recipient-doc-delivery',
    sectionNumber: '1.3.5',
    category: '1.3',
    categoryLabel: '1.3 Referral, document, and secure message flows',
    trigger: 'Recipient document delivery (legacy methods still present)',
    audience: 'Recipient',
    subject: 'Valley Dental Clinic has sent you a secure email',
    templateFile: 'RecipientDocument.cshtml',
    summary: 'Document delivery notice and secure access details.',
    plainText: `Valley Dental Clinic has sent you a secure document via drtalk.\nView document: https://drtalk.com/doc-delivery?id=8831`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk</h1>
    </div>
    <div class="content">
      <h2 class="title">Valley Dental Clinic has sent you a secure email</h2>
      <p>Hello,</p>
      <p>You have a new document delivery from <strong>Valley Dental Clinic</strong>.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn-blue">Open Secure Document</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },

  // ==========================================
  // 1.4 Billing, trial, and operational emails
  // ==========================================
  {
    id: '1.4-1-invoice',
    sectionNumber: '1.4.1',
    category: '1.4',
    categoryLabel: '1.4 Billing, trial, and operational emails',
    trigger: 'Invoice',
    audience: 'Billing user',
    subject: 'Your invoice is attached',
    templateFile: 'EmailInvoice.cshtml',
    summary: 'Invoice delivery with attachment.',
    plainText: `Hello Valley Dental Clinic,\nYour invoice for drtalk subscription (INV-2026-081) is attached. Amount: $149.00.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #0F172A;">
      <h1 class="header-logo" style="color: white;">Invoice Delivery</h1>
    </div>
    <div class="content">
      <h2 class="title">Your invoice is attached</h2>
      <p>Hello <strong>Valley Dental Clinic</strong>,</p>
      <p>Your drtalk subscription invoice for this billing cycle is attached to this email.</p>

      <div class="info-card">
        <p><strong>Invoice #:</strong> INV-2026-081</p>
        <p><strong>Total Amount:</strong> $149.00 USD</p>
        <p><strong>Status:</strong> Paid</p>
      </div>

      <div style="text-align: center;">
        <a href="#" class="btn-blue">View Account Billing</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Billing Dept.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.4-2-payment-failure',
    sectionNumber: '1.4.2',
    category: '1.4',
    categoryLabel: '1.4 Billing, trial, and operational emails',
    trigger: 'Invoice payment failure',
    audience: 'Billing user',
    subject: 'Invoice Payment Failed',
    templateFile: 'EmailPaymentFailed.cshtml',
    summary: 'Payment failure notice and follow-up action needed.',
    plainText: `URGENT: Payment failed for your drtalk subscription invoice. Please update card details to avoid service disruption.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #DC2626;">
      <h1 class="header-logo" style="color: white;">Payment Failed</h1>
    </div>
    <div class="content">
      <h2 class="title" style="color: #DC2626;">Invoice Payment Failed</h2>
      <p>Hello Valley Dental Clinic,</p>
      <p>We were unable to process your monthly drtalk payment of <strong>$149.00</strong> on card ending in 4242.</p>

      <div style="text-align: center;">
        <a href="#" class="btn-danger">Update Billing Information</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Billing Support.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.4-3-trial-ending',
    sectionNumber: '1.4.3',
    category: '1.4',
    categoryLabel: '1.4 Billing, trial, and operational emails',
    trigger: 'Trial ending soon',
    audience: 'Billing user',
    subject: 'Subscription Trial Will End Soon',
    templateFile: 'EmailFreeTrailEnding.cshtml',
    summary: 'Reminder that subscription trial is nearing end.',
    plainText: `Your drtalk trial will end soon. Choose your plan to keep your practice connected.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);">
      <h1 class="header-logo">Trial Ending Soon</h1>
    </div>
    <div class="content">
      <h2 class="title">Subscription Trial Will End Soon</h2>
      <p>Hello Dr. Sarah Jenkins,</p>
      <p>Your 14-day free trial for <strong>Valley Dental Clinic</strong> ends in 3 days.</p>

      <div style="text-align: center;">
        <a href="#" class="btn-primary">Select Subscription Tier</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.4-4-subscription-changed',
    sectionNumber: '1.4.4',
    category: '1.4',
    categoryLabel: '1.4 Billing, trial, and operational emails',
    trigger: 'Subscription changed',
    audience: 'Billing user',
    subject: 'Subscription Has Been Changed',
    templateFile: 'EmailSubscriptionChanged.cshtml',
    summary: 'Plan or billing-cycle change notice.',
    plainText: `Hello Valley Dental Clinic,\nYour drtalk subscription has been updated to Practice Pro (10 seats).`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk</h1>
    </div>
    <div class="content">
      <h2 class="title">Subscription Has Been Changed</h2>
      <p>Hello <strong>Valley Dental Clinic</strong>,</p>
      <p>This email confirms that your subscription plan has been updated to <strong>Practice Pro (10 seats)</strong>.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Billing Team.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.4-5-new-user-alert',
    sectionNumber: '1.4.5',
    category: '1.4',
    categoryLabel: '1.4 Billing, trial, and operational emails',
    trigger: 'New user registered alert',
    audience: 'Super admin/internal',
    subject: 'New User Registered for drtalk',
    templateFile: 'EmailToSuperAdminAboutNewUserRegistered.cshtml',
    summary: 'Internal administrative alert for new user signup.',
    plainText: `Alert: New user Dr. Michael Chang (Periodontics) has registered for drtalk.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #0F172A;">
      <h1 class="header-logo">Admin Alert</h1>
    </div>
    <div class="content">
      <h2 class="title">New User Registered for drtalk</h2>
      <p>A new user has completed registration on drtalk:</p>

      <div class="info-card">
        <p><strong>Name:</strong> Dr. Michael Chang</p>
        <p><strong>Practice:</strong> Pacific Periodontics</p>
        <p><strong>Email:</strong> dr.chang@pacificperio.com</p>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Internal System.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.4-6-service-downtime',
    sectionNumber: '1.4.6',
    category: '1.4',
    categoryLabel: '1.4 Billing, trial, and operational emails',
    trigger: 'Service downtime notice',
    audience: 'User/internal contact',
    subject: 'Update on drtalk Access Issues — Platform Secure and Fully Intact',
    templateFile: 'DowntimeNotice.cshtml',
    summary: 'Incident/update communication notice.',
    plainText: `drtalk Incident Update: All services are fully operational following database maintenance.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #334155;">
      <h1 class="header-logo">System Status Update</h1>
    </div>
    <div class="content">
      <h2 class="title">Update on drtalk Access Issues — Platform Secure and Fully Intact</h2>
      <p>Dear drtalk Community,</p>
      <p>All core infrastructure services have returned to 100% operational status.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Engineering.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.4-7-id-verification-update',
    sectionNumber: '1.4.7',
    category: '1.4',
    categoryLabel: '1.4 Billing, trial, and operational emails',
    trigger: 'ID verification program update',
    audience: 'User/internal contact',
    subject: 'drtalk Product update - Identity Verification',
    templateFile: 'IdVerifictaion.cshtml',
    summary: 'Product/compliance update notice regarding identity verification.',
    plainText: `drtalk Product Update: Identity Verification requirements updated for external practice messaging.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk Product Update</h1>
    </div>
    <div class="content">
      <h2 class="title">drtalk Product update - Identity Verification</h2>
      <p>Hello drtalk Users,</p>
      <p>We are updating our practitioner identity verification workflows to align with updated HIPAA and state dental board guidelines.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Product Compliance.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.4-8-manual-verification-support',
    sectionNumber: '1.4.8',
    category: '1.4',
    categoryLabel: '1.4 Billing, trial, and operational emails',
    trigger: 'Manual verification support request',
    audience: 'Admin/support',
    subject: 'drtalk request for a manual user verification request',
    templateFile: 'ReportedReader.cshtml',
    summary: 'Plain-text request email with requester details and portal link.',
    plainText: `Support Request: Manual user verification requested for Dr. Sarah Jenkins (NPI #1982741928).\nPortal Link: https://admin.drtalk.com/verify/1982741928`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #0F172A;">
      <h1 class="header-logo">Support Ticket</h1>
    </div>
    <div class="content">
      <h2 class="title">drtalk request for a manual user verification request</h2>
      <p>A manual practitioner verification request has been submitted:</p>
      
      <div class="info-card">
        <p><strong>Practitioner:</strong> Dr. Sarah Jenkins</p>
        <p><strong>NPI:</strong> 1982741928</p>
        <p><strong>Reason:</strong> Automated NPI database lookup pending manual review.</p>
      </div>

      <div style="text-align: center;">
        <a href="#" class="btn-primary">Open Admin Review Portal</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Support Desk.</p>
    </div>
  </div>
</body>
</html>`
  },

  // ==========================================
  // 1.5 Scheduled reporting emails
  // ==========================================
  {
    id: '1.5-1-daily-unread-reminder',
    sectionNumber: '1.5.1',
    category: '1.5',
    categoryLabel: '1.5 Scheduled reporting emails',
    trigger: 'Daily unread posts reminder',
    audience: 'End user',
    subject: 'Unread posts in channels',
    templateFile: 'EmailUnopenedDocuments.cshtml',
    summary: 'Reminder to check unread posts; links to web app.',
    plainText: `Hello Alex Morgan,\nYou have 4 unread posts in Valley Dental Clinic channels.\nLog in to review: https://drtalk.com/channels`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo"><span class="dr">dr</span>talk Digest</h1>
    </div>
    <div class="content">
      <h2 class="title">Unread posts in channels</h2>
      <p>Hello Alex Morgan,</p>
      <p>You have unread activity waiting in your practice channels at <strong>Valley Dental Clinic</strong>.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn-blue">Open Channels in App</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Notifications.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.5-2-daily-admin-report',
    sectionNumber: '1.5.2',
    category: '1.5',
    categoryLabel: '1.5 Scheduled reporting emails',
    trigger: 'Daily admin report (new users)',
    audience: 'Configured admin recipients',
    subject: 'New users for the past 24 hours',
    templateFile: 'DailyAdminReport',
    summary: 'New-user summary with CSV attachment.',
    plainText: `Daily Report: 14 new practices and 38 new users registered on drtalk in the last 24 hours.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #0F172A;">
      <h1 class="header-logo">Daily Admin Metrics</h1>
    </div>
    <div class="content">
      <h2 class="title">New users for the past 24 hours</h2>
      <p>Hello Administrator,</p>
      <p>Summary of platform activity over the last 24 hours:</p>

      <div class="info-card">
        <p><strong>New Practices Registered:</strong> 14</p>
        <p><strong>New User Accounts:</strong> 38</p>
      </div>

      <p style="font-size: 12px; color: #64748B;">CSV attachment: <code>new_users_24h.csv</code></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Internal Analytics.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: '1.5-3-weekly-admin-report',
    sectionNumber: '1.5.3',
    category: '1.5',
    categoryLabel: '1.5 Scheduled reporting emails',
    trigger: 'Weekly admin report (new users)',
    audience: 'Configured admin recipients',
    subject: 'Weekly new users report',
    templateFile: 'WeeklyAdminReport',
    summary: 'Weekly new-user summary with CSV attachment.',
    plainText: `Weekly Report: 92 new practices and 240 new users joined drtalk this week.`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><style>${COMMON_CSS}</style></head>
<body>
  <div class="email-container">
    <div class="header" style="background: #0F172A;">
      <h1 class="header-logo">Weekly Admin Metrics</h1>
    </div>
    <div class="content">
      <h2 class="title">Weekly new users report</h2>
      <p>Hello Administrator,</p>
      <p>Summary of platform onboarding activity for this past week:</p>

      <div class="info-card">
        <p><strong>New Practices (7 Days):</strong> 92 practices</p>
        <p><strong>New User Accounts (7 Days):</strong> 240 users</p>
      </div>

      <p style="font-size: 12px; color: #64748B;">CSV attachment: <code>weekly_new_users_report.csv</code></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} drtalk Internal Analytics.</p>
    </div>
  </div>
</body>
</html>`
  }
];
