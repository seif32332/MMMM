import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { Post } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';

interface PostCardProps {
  post: Post;
}

// A simple utility to format time since a date
const timeSince = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "m";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " min";
  return Math.floor(seconds) + "s";
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { t } = useI18n();

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <Link to={`/u/${post.author.username}`}>
                        <img
                            src={post.author.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${post.author.fullName}`}
                            alt={`${post.author.fullName}'s avatar`}
                            className="w-12 h-12 rounded-full"
                        />
                    </Link>
                    <div className="flex-grow">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Link to={`/u/${post.author.username}`} className="font-bold hover:underline">{post.author.fullName}</Link>
                            <span className="text-gray-500 text-sm">· {timeSince(post.createdAt)} ago</span>
                        </div>
                        <p className="mt-2 text-gray-800 whitespace-pre-wrap">{post.body}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="px-4 py-2 border-t flex justify-between items-center text-sm text-gray-600">
                <div>
                   <span>{t('post.reactions', { count: post.reactionsCount })}</span>
                   <span className="mx-2">·</span>
                   <span>{t('post.comments', { count: post.commentsCount })}</span>
                </div>
                <div className="flex space-x-1 rtl:space-x-reverse">
                    <Button variant="ghost" size="sm">{t('post.actions.like')}</Button>
                    <Button variant="ghost" size="sm">{t('post.actions.comment')}</Button>
                    <Button variant="ghost" size="sm">{t('post.actions.share')}</Button>
                </div>
            </CardFooter>
        </Card>
    );
};