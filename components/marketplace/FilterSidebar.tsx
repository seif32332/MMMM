import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useI18n } from '../../i18n';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';

interface FilterSidebarProps {
  onApplyFilters: (filters: any) => void;
  // Add specific filter options if needed, e.g., industries, stages
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onApplyFilters }) => {
  const { t } = useI18n();
  const { control, handleSubmit } = useForm();

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>{t('marketplace.filters.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onApplyFilters)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyword">{t('marketplace.filters.keyword')}</Label>
            <Controller
              name="keyword"
              control={control}
              render={({ field }) => <Input id="keyword" {...field} />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">{t('marketplace.filters.industry')}</Label>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => <Input id="industry" {...field} />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{t('marketplace.filters.location')}</Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => <Input id="location" {...field} />}
            />
          </div>
          {/* Add more specific filters like stage, employment type here */}
          <Button type="submit" className="w-full">{t('marketplace.filters.apply')}</Button>
        </form>
      </CardContent>
    </Card>
  );
};