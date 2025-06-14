
import { Card, CardContent } from '@/components/ui/card';
import { ActivityFormHeader } from './ActivityFormHeader';
import { ActivityTypeSelector } from './ActivityTypeSelector';
import { ActivityDescriptionField } from './ActivityDescriptionField';
import { ActivityImageUpload } from './ActivityImageUpload';
import { ActivityFormButtons } from './ActivityFormButtons';
import { useActivityForm } from '@/hooks/useActivityForm';

interface ActivityFormProps {
  activity?: {
    id: string;
    activity_type: string;
    description: string;
    image_url: string;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const ActivityForm = ({ activity, onSuccess, onCancel }: ActivityFormProps) => {
  const {
    activityType,
    setActivityType,
    description,
    setDescription,
    preview,
    isLoading,
    isEditing,
    isFormValid,
    handleImageChange,
    handleSubmit
  } = useActivityForm({ activity, onSuccess });

  return (
    <Card className="border-none shadow-md">
      <ActivityFormHeader isEditing={isEditing} />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ActivityTypeSelector 
            value={activityType}
            onChange={setActivityType}
            isDisabled={isLoading}
          />
          
          <ActivityDescriptionField 
            value={description}
            onChange={setDescription}
            isDisabled={isLoading}
          />
          
          <ActivityImageUpload 
            preview={preview}
            onChange={handleImageChange}
            isDisabled={isLoading}
            isRequired={!isEditing}
          />
          
          <ActivityFormButtons 
            isLoading={isLoading}
            isEditing={isEditing}
            isValid={isFormValid}
            onCancel={onCancel}
          />
        </form>
      </CardContent>
    </Card>
  );
};
