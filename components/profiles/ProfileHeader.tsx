import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { User } from '../../types';
import { Button } from '../ui/Button';
import { useFollowStatus, useFollowUser, useUnfollowUser } from '../../hooks/useFollow';
import { Spinner } from '../ui/Spinner';
import { useStartConversation } from '../../hooks/useStartConversation';
import { useToast } from '../../context/ToastContext';

interface ProfileHeaderProps {
    user: User;
    isOwner: boolean;
}

const VerifiedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const FollowButton: React.FC<{ targetUserId: string }> = ({ targetUserId }) => {
    const { t } = useI18n();
    const { data: isFollowing, isLoading } = useFollowStatus(targetUserId);
    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();

    if (isLoading) {
        return <Button disabled><Spinner size="sm" /></Button>;
    }

    const handleFollow = () => {
        followMutation.mutate(targetUserId);
    };

    const handleUnfollow = () => {
        unfollowMutation.mutate(targetUserId);
    };

    if (isFollowing) {
        return (
            <Button
                variant="outline"
                onClick={handleUnfollow}
                disabled={unfollowMutation.isPending}
            >
                {unfollowMutation.isPending ? <Spinner size="sm" /> : t('profile.following')}
            </Button>
        );
    }

    return (
        <Button onClick={handleFollow} disabled={followMutation.isPending}>
             {followMutation.isPending ? <Spinner size="sm" /> : t('profile.follow')}
        </Button>
    );
};


export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwner }) => {
    const { t } = useI18n();
    const { showToast } = useToast();
    const startConversationMutation = useStartConversation();

    const handleMessageClick = () => {
        startConversationMutation.mutate(user.id, {
            onError: (error) => {
                showToast(error.message, 'error');
            }
        });
    };

    return (
        <div>
            {/* Cover Image */}
            <div 
                className="h-48 md:h-64 bg-gray-300 bg-cover bg-center" 
                style={{ backgroundImage: `url(${user.bannerUrl || 'https://source.unsplash.com/1600x900/?abstract,technology'})` }}
            ></div>

            <div className="container mx-auto p-4 -mt-16 md:-mt-20">
                <div className="flex flex-col md:flex-row md:items-end md:space-x-4 rtl:space-x-reverse">
                    {/* Avatar */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 border-4 border-white shadow-lg flex-shrink-0 mx-auto md:mx-0">
                        <img 
                            src={user.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user.fullName || user.email}`} 
                            alt="Avatar" 
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>

                    {/* User Info & Actions */}
                    <div className="flex-grow flex flex-col md:flex-row justify-between items-center md:items-end w-full mt-4 md:mt-0 text-center md:text-left">
                        <div className="md:mb-2">
                            <div className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse">
                                <h2 className="text-2xl font-bold">{user.fullName || 'Unnamed User'}</h2>
                                <VerifiedIcon />
                            </div>
                            <p className="text-gray-600">{user.profile?.headline || 'No headline provided'}</p>
                            <p className="text-sm text-gray-500 mt-1">{user.profile?.location || 'Location not set'}</p>
                        </div>
                        <div className="flex space-x-2 rtl:space-x-reverse mt-4 md:mt-0">
                            {isOwner ? (
                                <Link to={`/u/${user.username || 'me'}/edit`}>
                                    <Button>{t('profile.editProfile')}</Button>
                                </Link>
                            ) : (
                                <>
                                    <FollowButton targetUserId={user.id} />
                                    <Button 
                                        variant="outline"
                                        onClick={handleMessageClick}
                                        disabled={startConversationMutation.isPending}
                                    >
                                        {startConversationMutation.isPending ? <Spinner size="sm" /> : t('profile.message')}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};