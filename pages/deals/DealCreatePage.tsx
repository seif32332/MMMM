import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useToast } from '../../context/ToastContext';
import { useCreateDeal } from '../../hooks/useCreateDeal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Spinner } from '../../components/ui/Spinner';
import { Select } from '../../components/ui/Select';

const dealSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  summary: z.string().min(20, "Summary must be at least 20 characters"),
  industry: z.string().nonempty("Industry is required"),
  stage: z.string().nonempty("Stage is required"),
  amountMin: z.coerce.number().positive("Amount must be positive"),
  amountMax: z.coerce.number().positive("Amount must be positive"),
  country: z.string().nonempty("Country is required"),
}).refine(data => data.amountMax >= data.amountMin, {
    message: "Maximum amount must be greater than or equal to minimum amount",
    path: ["amountMax"],
});

type DealFormData = z.infer<typeof dealSchema>;

export const DealCreatePage: React.FC = () => {
    const { t } = useI18n();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // FIX: Explicitly typed `useForm` with `DealFormData` and provided `defaultValues` to ensure type safety between react-hook-form and the zod schema, resolving both the resolver and submit handler type mismatch errors.
    const { control, handleSubmit, formState: { errors } } = useForm<DealFormData>({
        resolver: zodResolver(dealSchema),
        defaultValues: {
            title: '',
            summary: '',
            industry: '',
            stage: '',
            amountMin: undefined,
            amountMax: undefined,
            country: '',
        }
    });

    const createDealMutation = useCreateDeal({
        onSuccess: (newDeal) => {
            showToast(t('deals.create.success'), 'success');
            navigate(`/deals/${newDeal.id}`);
        },
        onError: (error) => {
            showToast(error.message, 'error');
        }
    });

    const onSubmit = (data: DealFormData) => {
        createDealMutation.mutate(data);
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{t('deals.create.title')}</CardTitle>
                    <CardDescription>{t('deals.create.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('deals.create.dealTitle.label')}</Label>
                            <Controller name="title" control={control} render={({field}) => <Input id="title" {...field} />} />
                            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="summary">{t('deals.create.summary.label')}</Label>
                            <Controller name="summary" control={control} render={({field}) => <textarea id="summary" {...field} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />} />
                            {errors.summary && <p className="text-sm text-destructive">{errors.summary.message}</p>}
                        </div>
                        {/* Simplified fields for now. In a real app, these would be selects or tag inputs. */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Controller name="industry" control={control} render={({field}) => <Input id="industry" {...field} />} />
                                {errors.industry && <p className="text-sm text-destructive">{errors.industry.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stage">Stage</Label>
                                <Controller name="stage" control={control} render={({field}) => (
                                    <Select id="stage" {...field}>
                                        <option value="">Select Stage...</option>
                                        <option value="Pre-Seed">Pre-Seed</option>
                                        <option value="Seed">Seed</option>
                                        <option value="Series A">Series A</option>
                                    </Select>
                                )} />
                                {errors.stage && <p className="text-sm text-destructive">{errors.stage.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amountMin">Minimum Amount</Label>
                                <Controller name="amountMin" control={control} render={({field}) => <Input id="amountMin" type="number" {...field} />} />
                                {errors.amountMin && <p className="text-sm text-destructive">{errors.amountMin.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="amountMax">Maximum Amount</Label>
                                <Controller name="amountMax" control={control} render={({field}) => <Input id="amountMax" type="number" {...field} />} />
                                {errors.amountMax && <p className="text-sm text-destructive">{errors.amountMax.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Controller name="country" control={control} render={({field}) => <Input id="country" {...field} />} />
                                {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={createDealMutation.isPending}>
                                {createDealMutation.isPending ? <Spinner size="sm" /> : t('submit')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default DealCreatePage;