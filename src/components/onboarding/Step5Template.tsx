import { CheckCircle2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, Template } from '../../lib/supabase';

type Step5Props = {
  data: {
    templateId: string;
  };
  onChange: (data: Partial<Step5Props['data']>) => void;
};

const TEMPLATE_PREVIEWS = {
  modern: {
    name: 'Modern',
    color: 'bg-blue-100',
    accentColor: 'bg-blue-600',
    description: 'Clean and professional design'
  },
  luxury: {
    name: 'Luxury',
    color: 'bg-amber-100',
    accentColor: 'bg-amber-900',
    description: 'Premium black & gold design'
  },
  vintage: {
    name: 'Vintage',
    color: 'bg-amber-50',
    accentColor: 'bg-amber-700',
    description: 'Classic & elegant heritage style'
  },
  resort: {
    name: 'Resort',
    color: 'bg-teal-100',
    accentColor: 'bg-teal-600',
    description: 'Tropical paradise design'
  },
  colorful: {
    name: 'Colorful',
    color: 'bg-purple-100',
    accentColor: 'bg-purple-600',
    description: 'Vibrant & trendy design'
  },
  minimal: {
    name: 'Minimal',
    color: 'bg-gray-100',
    accentColor: 'bg-gray-900',
    description: 'Simple & clean design'
  },
  business: {
    name: 'Business',
    color: 'bg-slate-100',
    accentColor: 'bg-slate-900',
    description: 'Corporate professional design'
  }
};

export default function Step5Template({ data, onChange }: Step5Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const { data: templatesData } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at');

    if (templatesData && templatesData.length > 0) {
      setTemplates(templatesData);
    } else {
      setTemplates([
        { id: 'modern', name: 'Modern', description: 'Clean and professional', category: 'modern', preview_image: null, config: {}, is_active: true, created_at: new Date().toISOString() },
        { id: 'luxury', name: 'Luxury', description: 'Premium black & gold', category: 'luxury', preview_image: null, config: {}, is_active: true, created_at: new Date().toISOString() },
        { id: 'vintage', name: 'Vintage', description: 'Classic & elegant', category: 'vintage', preview_image: null, config: {}, is_active: true, created_at: new Date().toISOString() },
        { id: 'resort', name: 'Resort', description: 'Tropical paradise', category: 'resort', preview_image: null, config: {}, is_active: true, created_at: new Date().toISOString() },
        { id: 'colorful', name: 'Colorful', description: 'Vibrant & trendy', category: 'colorful', preview_image: null, config: {}, is_active: true, created_at: new Date().toISOString() },
        { id: 'minimal', name: 'Minimal', description: 'Simple & clean', category: 'minimal', preview_image: null, config: {}, is_active: true, created_at: new Date().toISOString() },
        { id: 'business', name: 'Business', description: 'Corporate professional', category: 'business', preview_image: null, config: {}, is_active: true, created_at: new Date().toISOString() }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
        <p className="text-gray-600">Select a design that matches your hotel's style</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800">
              Don't worry! You can change templates anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading templates...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {templates.map((template) => {
            const preview = TEMPLATE_PREVIEWS[template.id as keyof typeof TEMPLATE_PREVIEWS];
            return (
              <button
                key={template.id}
                onClick={() => onChange({ templateId: template.id })}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  data.templateId === template.id
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-300'
                    : 'border-gray-300 hover:border-blue-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">{template.name}</h3>
                  {data.templateId === template.id && (
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {preview?.description || template.description}
                </p>
                <div className={`${preview?.color || 'bg-gray-100'} rounded p-3 h-32 relative overflow-hidden`}>
                  <div className={`${preview?.accentColor || 'bg-gray-600'} h-6 rounded`}></div>
                  <div className="mt-2 space-y-1">
                    <div className="bg-white/80 h-2 w-2/3 rounded"></div>
                    <div className="bg-white/80 h-2 w-1/2 rounded"></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {!data.templateId && !loading && (
        <div className="text-center text-sm text-gray-500">
          Select a template to continue
        </div>
      )}
    </div>
  );
}
