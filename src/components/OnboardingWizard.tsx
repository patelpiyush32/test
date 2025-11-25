import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Step1BasicInfo from './onboarding/Step1BasicInfo';
import Step2Photos from './onboarding/Step2Photos';
import Step3Rooms from './onboarding/Step3Rooms';
import Step4Payment from './onboarding/Step4Payment';
import Step5Template from './onboarding/Step5Template';

type OnboardingWizardProps = {
  onComplete: (hotelSlug: string) => void;
};

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    whatsapp: '',
    email: user?.email || '',
    photos: [] as string[],
    rooms: [] as {
      title: string;
      description: string;
      price: string;
      maxGuests: string;
      amenities: string[];
    }[],
    upiId: '',
    paymentMethod: '',
    templateId: 'standard'
  });

  const steps = [
    { number: 1, title: 'Basic Info', component: Step1BasicInfo },
    { number: 2, title: 'Photos', component: Step2Photos },
    { number: 3, title: 'Rooms', component: Step3Rooms },
    { number: 4, title: 'Payment', component: Step4Payment },
    { number: 5, title: 'Template', component: Step5Template }
  ];

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.address && formData.city && formData.state && formData.phone && formData.email;
      case 2:
        return formData.photos.length >= 3;
      case 3:
        return formData.rooms.length > 0 && formData.rooms.every((r: { title: string, price: string }) => r.title && r.price);
      case 4:
        return formData.paymentMethod && (formData.paymentMethod === 'gateway' || formData.upiId);
      case 5:
        return formData.templateId;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

      const { data: hotel, error } = await supabase
        .from('hotels')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            slug: slug,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            phone: formData.phone,
            whatsapp: formData.whatsapp || formData.phone,
            email: formData.email,
            photos: formData.photos,
            upi_id: formData.upiId,
            template_id: formData.templateId,
            is_published: true
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (hotel) {
        const roomsToInsert = formData.rooms.map((room: {
          title: string;
          description: string;
          price: string;
          maxGuests: string;
          amenities: string[];
        }) => ({
          hotel_id: hotel.id,
          title: room.title,
          description: room.description,
          price: parseFloat(room.price),
          max_guests: parseInt(room.maxGuests),
          amenities: room.amenities
        }));

        const { error: roomsError } = await supabase
          .from('rooms')
          .insert(roomsToInsert);

        if (roomsError) throw roomsError;

        onComplete(hotel.slug);
      }
    } catch (error) {
      console.error('Error creating hotel:', error);
      alert('Failed to create hotel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${currentStep > step.number
                        ? 'bg-slate-900 text-white'
                        : currentStep === step.number
                          ? 'bg-blue-600 text-white premium-shadow-lg'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                      }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-4 hidden md:block">
                    <p
                      className={`text-sm font-bold ${currentStep >= step.number ? 'text-slate-900' : 'text-slate-400'
                        }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-6 rounded-full transition-all ${currentStep > step.number ? 'bg-slate-900' : 'bg-slate-200'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl premium-shadow-xl p-10 border border-slate-100">
          <StepComponent data={formData} onChange={updateFormData} />

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-8 border-t border-slate-100">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold premium-shadow group"
              >
                Next
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canProceed() || loading}
                className="px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-bold premium-shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating Website...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Create My Website
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
