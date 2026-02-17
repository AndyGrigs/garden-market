import PageHeader from '@/components/Layout/PageHeader';
import SubHeader from '@/components/SubHeader';
import { AchievementsSection } from './AchievementsSection';
import { ContactSection } from './ContactSection';
import { CtaSection } from './CtaSection';
import { HeroSection } from './HeroSection';
import { ServiceSection } from './ServiceSection';
import { StorySection } from './StorySection';
import { TeamSection } from './TeamSection';

export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      <SubHeader />

      {/* Header */}
      <HeroSection />

      {/* Story Section */}
      <StorySection />

      {/* Achievements */}
      <AchievementsSection />

      {/* Team Section */}
      <TeamSection />
      {/* Services Section */}
      <ServiceSection />
      {/* Contact Section */}
      <ContactSection />
      {/* Call to Action */}
      <CtaSection/>
    </div>
  );
};
