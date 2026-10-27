// src/features/career/data/careerTemplates.ts
// Standard English and Japanese business communication templates
// All Japanese templates explicitly flagged with needsNativeReview: true
import { CareerTemplate } from '../types';

export const CAREER_TEMPLATES: CareerTemplate[] = [
  // 1. Cover Letter
  {
    id: 'cover_letter_en',
    category: 'cover_letter',
    language: 'en',
    title: 'Standard Tech Cover Letter (English)',
    description: 'Concise, achievement-focused cover letter for software & hardware engineering roles.',
    template: `Dear Hiring Team at {companyName},

I am writing to express my strong interest in the {targetRole} position at {companyName}. With a solid foundation in {major} from {university} and hands-on experience in {skills}, I am excited about the opportunity to contribute to your engineering objectives.

In my recent project work, I developed practical solutions utilizing modern engineering standards and rigorous testing. My background aligns well with the technical challenges your team is tackling, particularly in scalable software and hardware systems.

I would welcome the opportunity to discuss how my technical skills and dedication can support {companyName}'s growth in Japan and globally. Thank you for your time and consideration.

Sincerely,
{fullName}
{email} | {phone}`
  },
  {
    id: 'cover_letter_ja',
    category: 'cover_letter',
    language: 'ja',
    title: '添え状・送付状 (Japanese Cover Letter / Soejou)',
    description: 'Formal Japanese document cover letter accompanying a Rirekisho and Shokumukeirekisho.',
    needsNativeReview: true,
    template: `{currentDate}

{companyName}
採用ご担当者様

{fullNameKanji}
〒{postalCode} {address}
電話: {phone}
E-mail: {email}

応募書類の送付につきまして

拝啓

貴社におかれましては、ますますご清栄のこととお慶び申し上げます。
この度、貴社の{targetRole}の求人を拝見し、応募いたしたく、応募書類一式を同封いたしましたのでご査収いただけますようお願い申し上げます。

私はこれまで{skills}を中心に技術を培ってまいりました。貴社の事業において、私の技術と熱意を活かし貢献したいと考えております。

ご多忙の折、大変恐縮ではございますが、ぜひ面接の機会をいただけますと幸いでございます。何卒よろしくお願い申し上げます。

敬具

記
・履歴書　1通
・職務経歴書　1通
以上`
  },

  // 2. Recruiter Message / Scout Reply
  {
    id: 'recruiter_reply_en',
    category: 'recruiter_message',
    language: 'en',
    title: 'Recruiter Message Reply (English)',
    description: 'Professional response to a recruiter or hiring manager outreach on LinkedIn or tech platforms.',
    template: `Hi {recruiterName},

Thank you for reaching out regarding the {targetRole} opportunity at {companyName}.

I reviewed the role and am very interested in learning more about the team's tech stack and current engineering challenges. Given my background in {skills}, I believe my skills could be a strong match.

I would be happy to connect for a brief 15-20 minute introductory call. Please let me know a few times that work best for your schedule.

Best regards,
{fullName}
{email}`
  },
  {
    id: 'recruiter_reply_ja',
    category: 'recruiter_message',
    language: 'ja',
    title: 'スカウト・採用担当への返信 (Japanese Scout Reply)',
    description: 'Polite Keigo email replying to a Japanese recruiter or scout message.',
    needsNativeReview: true,
    template: `{companyName}
{recruiterName}様

突然のご連絡失礼いたします。
{targetRole}に応募させていただきました、{fullNameKanji}と申します。

この度は、大変魅力的なポジションについてご連絡をいただき、誠にありがとうございます。

貴社の事業および{skills}を活かしたエンジニアリング環境に強い関心を持っております。
詳細についてぜひお伺いしたく存じます。

ご都合のよろしい日時にて、オンラインにてお話しできる機会をいただけますと幸いでございます。
何卒よろしくお願い申し上げます。

--------------------------------------------------
{fullNameKanji} ({fullNameKana})
E-mail: {email}
電話番号: {phone}
--------------------------------------------------`
  },

  // 3. Interview Thank-You
  {
    id: 'thank_you_en',
    category: 'thank_you',
    language: 'en',
    title: 'Interview Thank-You Note (English)',
    description: 'Send within 24 hours of a technical or behavioral interview to reiterate interest.',
    template: `Dear {interviewerName},

Thank you very much for taking the time to speak with me today about the {targetRole} position at {companyName}.

I thoroughly enjoyed learning more about {topicDiscussed} and the engineering practices your team follows. Our conversation reaffirmed my enthusiasm for joining {companyName}, and I am confident that my experience with {skills} will allow me to hit the ground running.

Please let me know if you need any additional information from my side. I look forward to hearing about the next steps.

Best regards,
{fullName}
{email}`
  },
  {
    id: 'thank_you_ja',
    category: 'thank_you',
    language: 'ja',
    title: '面接後のお礼メール (Japanese Interview Thank-You)',
    description: 'Standard polite Japanese thank-you email following an interview.',
    needsNativeReview: true,
    template: `{companyName}
{interviewerName}様

お世話になっております。
本日{targetRole}の面接を受けさせていただきました、{fullNameKanji}と申します。

本日はご多忙の折、貴重なお時間をいただき誠にありがとうございました。

面接の中で、貴社の事業やエンジニアリングにおける取り組みについて詳しくお伺いし、貴社で貢献したいという思いがより一層強くなりました。
私の{skills}に関する知見を活かし、チームの力になれるよう努めてまいります。

取り急ぎ、本日のお礼を申し上げたくご連絡いたしました。
選考結果にかかわらず、今後とも何卒よろしくお願い申し上げます。

--------------------------------------------------
{fullNameKanji} ({fullNameKana})
E-mail: {email}
電話: {phone}
--------------------------------------------------`
  },

  // 4. Follow-up Email
  {
    id: 'follow_up_en',
    category: 'follow_up',
    language: 'en',
    title: 'Status Follow-up Email (English)',
    description: 'Polite inquiry sent when the expected decision timeframe has passed.',
    template: `Dear {recruiterName},

I hope this email finds you well.

I am following up on my interview for the {targetRole} role at {companyName} on {interviewDate}. I remain very enthusiastic about the position and the opportunity to work with your team.

Could you please share if there are any updates regarding the hiring process or next steps? Please let me know if you require any additional details or references.

Thank you once again for your time and guidance.

Best regards,
{fullName}
{email}`
  },
  {
    id: 'follow_up_ja',
    category: 'follow_up',
    language: 'ja',
    title: '選考状況の確認メール (Japanese Status Follow-up)',
    description: 'Respectful inquiry about the status of an application or interview result.',
    needsNativeReview: true,
    template: `{companyName}
採用ご担当者様

いつも大変お世話になっております。
{targetRole}の選考を受けております、{fullNameKanji}と申します。

先日は面接の機会をいただき、誠にありがとうございました。

その後の選考状況につきまして、念のため確認させていただきたくご連絡いたしました。
ご多忙のところ恐縮ではございますが、現在の状況や今後の予定についてご教示いただけますと幸いでございます。

追加で提出すべき書類や情報などがございましたら、いつでも迅速に対応いたしますのでお申し付けください。
お手数をおかけいたしますが、何卒よろしくお願い申し上げます。

--------------------------------------------------
{fullNameKanji} ({fullNameKana})
E-mail: {email}
電話: {phone}
--------------------------------------------------`
  },

  // 5. Self-Introduction (Jikoshoukai)
  {
    id: 'self_intro_en',
    category: 'self_intro',
    language: 'en',
    title: '1-Minute Professional Pitch (English)',
    description: 'Elevator pitch for career fairs, networking events, or opening an interview.',
    template: `Hello, my name is {fullName}. I specialize in {targetRole} with a technical background in {major} from {university}. 

Over the past years, I have focused on building hands-on systems with {skills}. I take pride in writing reliable code, testing thoroughly, and solving real engineering bottlenecks. 

I am eager to bring my problem-solving mindset and passion for technology to {companyName} in Japan.`
  },
  {
    id: 'self_intro_ja',
    category: 'self_intro',
    language: 'ja',
    title: '1分間 自己紹介 (Japanese 1-Minute Jikoshoukai)',
    description: 'Classic Japanese job interview opening self-introduction.',
    needsNativeReview: true,
    template: `初めまして。{fullNameKanji}（{fullNameKana}）と申します。

私は{university}にて{major}を専攻し、主に{skills}を用いたエンジニアリングに取り組んでまいりました。
課題に対して粘り強く原因を究明し、高品質なものづくりを完遂することを得意としております。

本日は貴社の{targetRole}について詳しくお話しできる機会をいただき、大変光栄に思います。
本日はどうぞよろしくお願い申し上げます。`
  }
];
