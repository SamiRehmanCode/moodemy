import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dummyContents = [
  {
    type: 'ABOUT_US',
    title: 'About MoodyMe',
    content: 'Welcome to MoodyMe! We are a platform dedicated to helping you track and understand your mood patterns. Our mission is to provide you with insights into your emotional well-being and help you lead a healthier, more balanced life. With advanced analytics and personalized recommendations, MoodyMe is your companion on the journey to better mental health.',
    isActive: true,
  },
  {
    type: 'HELP_SUPPORT',
    title: 'Help & Support',
    content: 'FAQ:\n1. How do I track my mood?\nSimply open the app and select your current mood from the options provided.\n\n2. Can I export my mood history?\nYes, you can export your data from account settings.\n\n3. Is my data secure?\nWe use industry-standard encryption to protect your data.\n\n4. How often should I log my mood?\nWe recommend at least once daily for best insights.\n\nFor further assistance, contact us at support@moodyme.com',
    isActive: true,
  },
  {
    type: 'PRIVACY_POLICY',
    title: 'Privacy Policy',
    content: 'Privacy Policy for MoodyMe\n\nLast Updated: November 2024\n\n1. Introduction\nMoodyMe operates the MoodyMe application. This page informs you of our policies regarding the collection, use, and disclosure of personal data.\n\n2. Information Collection\nWe collect name, email, phone number, mood entries, and usage data.\n\n3. Data Security\nWe use industry-standard encryption to protect all personal data.\n\n4. Your Rights\nYou have the right to access, correct, or delete your personal data.\n\n5. Contact\nFor privacy concerns, contact privacy@moodyme.com',
    isActive: true,
  },
  {
    type: 'HOME_SCREEN',
    title: 'Home Screen Welcome',
    content: 'Welcome back to MoodyMe! Track your daily mood, discover patterns, and gain valuable insights into your emotional well-being. Start by logging your mood today and build a comprehensive history of your emotional state. Your journey to better mental health starts here!',
    isActive: true,
  },
  {
    type: 'SPLASH_SCREEN',
    title: 'Splash Screen Message',
    content: 'Understand Your Mood, Improve Your Life. Welcome to MoodyMe - Your Personal Mood Tracking Companion. Track daily moods, discover patterns, and gain insights into your emotional well-being.',
    isActive: true,
  },
  {
    type: 'SIGNUP_MESSAGE',
    title: 'Signup Welcome Message',
    content: 'Thank you for joining MoodyMe! We\'re excited to help you track and understand your mood patterns. Let\'s get started by setting up your profile and logging your first mood entry. You\'re just a few steps away from gaining valuable insights into your emotional well-being.',
    isActive: true,
  },
  {
    type: 'LOGIN_MESSAGE',
    title: 'Login Welcome Message',
    content: 'Welcome back to MoodyMe! We\'re glad to see you again. Continue tracking your mood, explore your insights, and stay connected with your emotional well-being journey. Let\'s see how you\'re feeling today!',
    isActive: true,
  },
];

async function main() {
  console.log('Seeding database with content...');

  // Clear existing content
  await prisma.content.deleteMany({});

  // Create dummy content
  for (const content of dummyContents) {
    const created = await prisma.content.create({
      data: content,
    });
    console.log(`Created content: ${created.title} (${created.type})`);
  }

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
