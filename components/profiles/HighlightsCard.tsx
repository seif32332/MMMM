import React from 'react';
import { User, UserPrimaryRole } from '../../types';
import { useI18n } from '../../i18n';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface HighlightsCardProps {
  user: User;
}

const HighlightItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <h4 className="text-sm font-semibold text-gray-500">{label}</h4>
    <p className="text-md text-gray-800">{value}</p>
  </div>
);

export const HighlightsCard: React.FC<HighlightsCardProps> = ({ user }) => {
  const { t } = useI18n();
  const details = user.profile?.onboardingDetails;

  const renderFounderHighlights = () => (
    <>
      <HighlightItem label={t('onboarding.founder.stage')} value={details?.stage} />
      <HighlightItem label={t('onboarding.founder.amountMin')} value={`${details?.amountMin?.toLocaleString() || 'N/A'} SAR`} />
      <HighlightItem label={t('onboarding.founder.sectors')} value={details?.sectors?.join(', ')} />
      <HighlightItem label={t('onboarding.founder.summary')} value={details?.summary} />
    </>
  );

  const renderInvestorHighlights = () => (
    <>
      <HighlightItem label={t('onboarding.investor.ticketMin')} value={`${details?.ticketMin?.toLocaleString() || 'N/A'} SAR`} />
      <HighlightItem label={t('onboarding.investor.stages')} value={details?.stages?.join(', ')} />
      <HighlightItem label={t('onboarding.investor.sectors')} value={details?.sectors?.join(', ')} />
      <HighlightItem label={t('onboarding.investor.thesis')} value={details?.thesis} />
    </>
  );

  const renderJobSeekerHighlights = () => (
    <>
        <HighlightItem label={t('onboarding.job_seeker.title')} value={details?.title} />
        <HighlightItem label={t('onboarding.job_seeker.skills')} value={details?.skills?.join(', ')} />
        <HighlightItem label={t('onboarding.job_seeker.experience')} value={`${details?.experience || 'N/A'} years`} />
        <HighlightItem label={t('onboarding.job_seeker.locations')} value={details?.locations?.join(', ')} />
    </>
  )

  const renderHighlights = () => {
    if (!details) return <p>No professional details provided.</p>;

    switch (user.profile?.primaryRole) {
      case UserPrimaryRole.FOUNDER:
        return renderFounderHighlights();
      case UserPrimaryRole.INVESTOR:
        return renderInvestorHighlights();
      case UserPrimaryRole.JOB_SEEKER:
        return renderJobSeekerHighlights();
      default:
        return <p>Details for this role are not displayed here.</p>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.highlights.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.profile?.bio && <HighlightItem label={t('profile.edit.bio.label')} value={user.profile.bio} />}
        <hr/>
        {renderHighlights()}
      </CardContent>
    </Card>
  );
};