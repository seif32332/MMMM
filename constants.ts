
import { UserPrimaryRole, FormDefinition, TranslationKey } from './types';

interface RoleInfo {
  id: UserPrimaryRole;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

export const ROLES: RoleInfo[] = [
  {
    id: UserPrimaryRole.FOUNDER,
    titleKey: 'roles.founder.title',
    descriptionKey: 'roles.founder.description',
  },
  {
    id: UserPrimaryRole.INVESTOR,
    titleKey: 'roles.investor.title',
    descriptionKey: 'roles.investor.description',
  },
  {
    id: UserPrimaryRole.COMPANY,
    titleKey: 'roles.company.title',
    descriptionKey: 'roles.company.description',
  },
  {
    id: UserPrimaryRole.JOB_SEEKER,
    titleKey: 'roles.job_seeker.title',
    descriptionKey: 'roles.job_seeker.description',
  },
  // FIX: Add TRADER role for consistency, as it exists in the enum and forms.
  {
    id: UserPrimaryRole.TRADER,
    titleKey: 'roles.trader.title',
    descriptionKey: 'roles.trader.description',
  },
];

export const ONBOARDING_FORMS: Record<UserPrimaryRole, FormDefinition> = {
  [UserPrimaryRole.FOUNDER]: {
    fields: [
      { name: 'stage', labelKey: 'onboarding.founder.stage', type: 'select', options: [
        { value: 'idea', labelKey: 'stages.idea' },
        { value: 'mvp', labelKey: 'stages.mvp' },
        { value: 'seed', labelKey: 'stages.seed' },
        { value: 'series_a', labelKey: 'stages.series_a' },
      ]},
      { name: 'amountMin', labelKey: 'onboarding.founder.amountMin', type: 'number', placeholderKey: 'onboarding.founder.amount_placeholder' },
      { name: 'amountMax', labelKey: 'onboarding.founder.amountMax', type: 'number', placeholderKey: 'onboarding.founder.amount_placeholder' },
      { name: 'sectors', labelKey: 'onboarding.founder.sectors', type: 'tags', placeholderKey: 'onboarding.founder.sectors_placeholder' },
      { name: 'summary', labelKey: 'onboarding.founder.summary', type: 'textarea', placeholderKey: 'onboarding.founder.summary_placeholder' },
    ],
  },
  [UserPrimaryRole.INVESTOR]: {
    fields: [
      { name: 'ticketMin', labelKey: 'onboarding.investor.ticketMin', type: 'number', placeholderKey: 'onboarding.investor.amount_placeholder' },
      { name: 'ticketMax', labelKey: 'onboarding.investor.ticketMax', type: 'number', placeholderKey: 'onboarding.investor.amount_placeholder' },
      { name: 'stages', labelKey: 'onboarding.investor.stages', type: 'multiselect', options: [
        { value: 'pre_seed', labelKey: 'stages.pre_seed' },
        { value: 'seed', labelKey: 'stages.seed' },
        { value: 'series_a', labelKey: 'stages.series_a' },
        { value: 'series_b', labelKey: 'stages.series_b' },
      ]},
      { name: 'sectors', labelKey: 'onboarding.investor.sectors', type: 'tags', placeholderKey: 'onboarding.investor.sectors_placeholder' },
      { name: 'thesis', labelKey: 'onboarding.investor.thesis', type: 'textarea', placeholderKey: 'onboarding.investor.thesis_placeholder' },
    ],
  },
  [UserPrimaryRole.COMPANY]: {
    fields: [
       { name: 'companyName', labelKey: 'onboarding.company.name', type: 'text', placeholderKey: 'onboarding.company.name_placeholder' },
       { name: 'industry', labelKey: 'onboarding.company.industry', type: 'text', placeholderKey: 'onboarding.company.industry_placeholder' },
       { name: 'size', labelKey: 'onboarding.company.size', type: 'select', options: [
         { value: '1-10', labelKey: 'companySizes.1-10' },
         { value: '11-50', labelKey: 'companySizes.11-50' },
         { value: '51-200', labelKey: 'companySizes.51-200' },
         { value: '201+', labelKey: 'companySizes.201+' },
       ]},
       { name: 'website', labelKey: 'onboarding.company.website', type: 'text', placeholderKey: 'onboarding.company.website_placeholder' },
    ]
  },
  [UserPrimaryRole.JOB_SEEKER]: {
    fields: [
      { name: 'title', labelKey: 'onboarding.job_seeker.title', type: 'text', placeholderKey: 'onboarding.job_seeker.title_placeholder' },
      { name: 'skills', labelKey: 'onboarding.job_seeker.skills', type: 'tags', placeholderKey: 'onboarding.job_seeker.skills_placeholder' },
      { name: 'experience', labelKey: 'onboarding.job_seeker.experience', type: 'number', placeholderKey: 'onboarding.job_seeker.experience_placeholder' },
      { name: 'locations', labelKey: 'onboarding.job_seeker.locations', type: 'tags', placeholderKey: 'onboarding.job_seeker.locations_placeholder' },
    ]
  },
  [UserPrimaryRole.TRADER]: { 
    fields: [
       { name: 'bizType', labelKey: 'onboarding.trader.bizType', type: 'text' },
       { name: 'markets', labelKey: 'onboarding.trader.markets', type: 'tags' },
    ]
  }
};