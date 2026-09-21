import { Button, Spinner } from '@heroui/react';
import { useState } from 'react';
import { api } from '@/lib/trpc';
import { Icon } from '@/components/Common/Iconify/icons';
import { MarkdownRender } from '@/components/Common/MarkdownRender';

export const BilingualCoach = ({ content }: { content: string }) => {
  const [lesson, setLesson] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const createLesson = async () => {
    if (lesson) {
      setLesson('');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await api.ai.bilingualCoach.mutate({ content, targetLanguage: 'English' });
      setLesson(result.lesson);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tạo bài học lúc này.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2" onClick={(event) => event.stopPropagation()}>
      <Button
        size="sm"
        variant={lesson ? 'flat' : 'light'}
        color="secondary"
        className="min-w-0 gap-1.5 px-2 font-semibold"
        isDisabled={isLoading}
        onPress={createLesson}
      >
        {isLoading ? <Spinner size="sm" /> : <Icon icon="solar:translation-2-bold-duotone" width="18" />}
        {isLoading ? 'AI đang soạn bài...' : lesson ? 'Ẩn song ngữ' : 'Học song ngữ'}
      </Button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {lesson && (
        <div className="mt-3 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-secondary">
            <Icon icon="solar:square-academic-cap-2-bold-duotone" width="20" />
            IELTS & Giao tiếp 9.0 Coach
          </div>
          <MarkdownRender content={lesson} largeSpacing />
        </div>
      )}
    </div>
  );
};
