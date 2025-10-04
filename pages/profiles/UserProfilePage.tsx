import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../stores/authStore';
import { useI18n } from '../../i18n';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Spinner } from '../../components/ui/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { TranslationKey, User, UserPrimaryRole } from '../../types';
import { ProfileHeader } from '../../components/profiles/ProfileHeader';
import { HighlightsCard } from '../../components/profiles/HighlightsCard';
import { PostCard } from '../../components/feed/PostCard';
import { usePosts } from '../../hooks/usePosts';
import { useDeals } from '../../hooks/useDeals';
import { DealCard } from '../../components/deals/DealCard';
import { useJobs } from '../../hooks/useJobs';
import { JobCard } from '../../components/jobs/JobCard';

interface Tab {
    id: string;
    labelKey: TranslationKey;
}

const ConnectionsTab: React.FC<{ user: User }> = ({ user }) => {
    const { t } = useI18n();
    return (
        <Card>
            <CardHeader><CardTitle>{t('profile.connections.title')}</CardTitle></CardHeader>
            <CardContent>
                <div className="flex space-x-8 rtl:space-x-reverse">
                    <div>
                        <span className="font-bold text-lg">{user.profile?.followersCount || 0}</span>
                        <span className="text-gray-600 ml-2">{t('profile.connections.followers')}</span>
                    </div>
                    <div>
                        <span className="font-bold text-lg">{user.profile?.followingCount || 0}</span>
                        <span className="text-gray-600 ml-2">{t('profile.connections.following')}</span>
                    </div>
                </div>
                 <p className="text-gray-500 mt-4">{t('profile.connections.placeholder')}</p>
            </CardContent>
        </Card>
    );
};

const DealsTab: React.FC<{ user: User }> = ({ user }) => {
    const { t } = useI18n();
    const { data: deals, isLoading } = useDeals({ ownerId: user.id });

    return (
        <Card>
            <CardHeader><CardTitle>{t('profile.tabs.deals')}</CardTitle></CardHeader>
            <CardContent>
                {isLoading ? <Spinner /> : (
                    (deals && deals.length > 0) ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
                        </div>
                    ) : (
                        <p className="text-gray-500">{t('profile.deals.placeholder')}</p>
                    )
                )}
            </CardContent>
        </Card>
    );
};

const JobsTab: React.FC<{ user: User }> = ({ user }) => {
    const { t } = useI18n();
    const companyId = user.companyMemberships?.[0]?.companyId;
    const { data: jobs, isLoading } = useJobs({ companyId });

     return (
        <Card>
            <CardHeader><CardTitle>{t('profile.tabs.jobs')}</CardTitle></CardHeader>
            <CardContent>
                {isLoading ? <Spinner /> : (
                    (jobs && jobs.length > 0) ? (
                        <div className="space-y-4">
                            {jobs.map(job => <JobCard key={job.id} job={job} />)}
                        </div>
                    ) : (
                        <p className="text-gray-500">{t('profile.jobs.placeholder')}</p>
                    )
                )}
            </CardContent>
        </Card>
    );
};

export const UserProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const loggedInUser = useUser();
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState('overview');
    
    const { data: user, isLoading, isError } = useUserProfile(username);
    // FIX: The usePosts hook expects a string argument for userId, not an object.
    const { data: posts, isLoading: postsLoading } = usePosts(user?.id); 
    
    if (isLoading) {
        return <div className="w-full h-screen flex items-center justify-center"><Spinner /></div>;
    }

    if (isError || !user) {
        return <div className="p-8 text-center text-destructive">Could not load profile. The user may not exist.</div>;
    }

    const isOwner = loggedInUser?.id === user.id;
    
    const tabs: Tab[] = [
        { id: 'overview', labelKey: 'profile.tabs.overview' },
        { id: 'activity', labelKey: 'profile.tabs.activity' },
    ];
    
    if (user.profile?.primaryRole === UserPrimaryRole.FOUNDER) {
        tabs.push({ id: 'deals', labelKey: 'profile.tabs.deals' });
    }
    
    if (user.companyMemberships && user.companyMemberships.length > 0) {
        tabs.push({ id: 'jobs', labelKey: 'profile.tabs.jobs' });
    }

    tabs.push({ id: 'connections', labelKey: 'profile.tabs.connections' });


    const renderTabContent = () => {
        switch (activeTab) {
            case 'activity':
                return (
                    <Card>
                        <CardHeader><CardTitle>{t('profile.activity.title')}</CardTitle></CardHeader>
                        <CardContent>
                            {postsLoading ? <Spinner /> : (
                                (posts && posts.length > 0) ? (
                                    <div className="space-y-4">
                                        {posts.map(post => <PostCard key={post.id} post={post} />)}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">{t('profile.activity.placeholder')}</p>
                                )
                            )}
                        </CardContent>
                    </Card>
                );
            case 'deals':
                return <DealsTab user={user} />;
            case 'jobs':
                return <JobsTab user={user} />;
            case 'connections':
                 return <ConnectionsTab user={user} />;
            case 'overview':
            default:
                return <HighlightsCard user={user} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <ProfileHeader user={user} isOwner={isOwner} />

            <div className="container mx-auto p-4">
                {/* Tabs */}
                <div className="mt-6 border-b">
                    <nav className="flex space-x-4 rtl:space-x-reverse overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-3 font-medium text-sm whitespace-nowrap ${activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t(tab.labelKey)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
