import { Button, Chip, Input } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootStore } from '@/store';
import { BlinkoStore } from '@/store/blinkoStore';
import { Icon } from '@/components/Common/Iconify/icons';
import { useTranslation } from 'react-i18next';

export const TopicFilterBar = observer(() => {
  const blinko = RootStore.Get(BlinkoStore);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const activeTagId = Number(searchParams.get('tagId')) || null;

  const tags = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(/^#/, '');
    return (blinko.tagList.value?.falttenTags || [])
      .filter((tag: any) => !normalized || String(tag.name).toLowerCase().includes(normalized))
      .slice(0, normalized ? 30 : 12);
  }, [blinko.tagList.value?.falttenTags, query]);

  const selectTag = (id: number | null) => {
    if (id) {
      blinko.updateTagFilter(id);
    } else {
      blinko.noteListFilterConfig.tagId = null;
      blinko.noteListFilterConfig.type = -1;
      blinko.noteList.resetAndCall({});
    }
    navigate(id ? `/?path=all&tagId=${id}` : '/?path=all');
  };

  if (!blinko.tagList.value?.falttenTags?.length) return null;

  return (
    <div className="mb-3 rounded-xl border border-default-200 bg-background/80 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Input
          size="sm"
          value={query}
          onValueChange={setQuery}
          placeholder={t('search-tags', 'Search tags')}
          aria-label={t('search-tags', 'Search tags')}
          startContent={<Icon icon="fluent:tag-search-24-regular" width="18" height="18" />}
          isClearable
          onClear={() => setQuery('')}
        />
        {activeTagId && (
          <Button size="sm" variant="flat" onPress={() => selectTag(null)}>
            {t('reset')}
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {tags.map((tag: any) => (
          <Chip
            key={tag.id}
            as="button"
            color={activeTagId === tag.id ? 'primary' : 'default'}
            variant={activeTagId === tag.id ? 'solid' : 'flat'}
            className="shrink-0 cursor-pointer"
            onClick={() => selectTag(tag.id)}
          >
            {tag.icon || '#'} {tag.name}
          </Chip>
        ))}
        {tags.length === 0 && <span className="text-xs text-default-500">{t('no-data')}</span>}
      </div>
    </div>
  );
});
