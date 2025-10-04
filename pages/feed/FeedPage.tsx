import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useI18n } from '../../i18n';
import { useUser } from '../../stores/authStore';
import { usePosts } from '../../hooks/usePosts';
import { useCreatePost } from '../../hooks/useCreatePost';
import { useToast } from '../../context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { PostCard } from '../../components/feed/PostCard';
import { TranslationKey } from '../../types';

const getPostSchema = (t: (key: TranslationKey) => string) => z.object({
  body: z.string().nonempty(t('feed.post.error')),
});

const PostComposer: React.FC = () => {
  const { t } = useI18n();
  const user = useUser();
  const { showToast } = useToast();
  const postSchema = getPostSchema(t);

  const { control, handleSubmit, reset } = useForm<{ body: string }>({
    resolver: zodResolver(postSchema),
    defaultValues: { body: '' },
  });

  const createPostMutation = useCreatePost({
    onSuccess: () => {
      showToast(t('feed.post.success'), 'success');
      reset();
    },
    onError: (error) => {
      showToast(error.message, 'error');
    }
  });

  const onSubmit = (data: { body: string }) => {
    createPostMutation.mutate(data.body);
  };

  if (!user) return null;

  return (
    <Card className="mb-8">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start space-x-4 rtl:space-x-reverse">
          <img
            src={user.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user.fullName || user.email}`}
            alt="Your avatar"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-grow">
            <Controller
              name="body"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder={t('feed.post_composer.placeholder')}
                  className="w-full p-2 border rounded-md min-h-[80px] focus:ring-primary focus:border-primary"
                />
              )}
            />
            <div className="flex justify-end mt-2">
              <Button type="submit" disabled={createPostMutation.isPending}>
                {createPostMutation.isPending ? <Spinner size="sm" /> : t('feed.post.cta')}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const PostList: React.FC = () => {
    const { t } = useI18n();
    const { data: posts, isLoading, isError } = usePosts();

    if (isLoading) {
        return <div className="text-center py-8"><Spinner /> <p>{t('feed.posts.loading')}</p></div>;
    }

    if (isError) {
        return <p className="text-center text-destructive py-8">{t('feed.posts.error')}</p>;
    }

    if (!posts || posts.length === 0) {
        return <p className="text-center text-gray-500 py-8">{t('feed.posts.empty')}</p>;
    }
    
    return (
        <div className="space-y-6">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
    );
};


const FeedPage: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">{t('feed.title')}</h1>
      <PostComposer />
      <PostList />
    </div>
  );
};

export default FeedPage;