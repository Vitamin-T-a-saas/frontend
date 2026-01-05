import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { useNavigate } from "react-router-dom"; // Remove if not using routing in demo
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitBrandDna, startWorkflow } from "../axios.jsx"; // Use correct workflow endpoints

const steps = [
  { 
    id: 1, 
    title: "Brand Name", 
    field: "brandName", 
    placeholder: "Enter your brand name",
    description: "What's the name of your brand?"
  },
  { 
    id: 2, 
    title: "Brand Description", 
    field: "brandDescription", 
    placeholder: "Describe your brand, its mission, and what makes it unique...",
    description: "Tell us about your brand's story and purpose"
  },
  { 
    id: 3, 
    title: "Brand Values", 
    field: "brandValues", 
    placeholder: "Innovation, Quality, Sustainability, Customer-First (separate with commas)",
    description: "What core values define your brand?"
  },
  { 
    id: 4, 
    title: "Target Audience", 
    field: "targetAudience", 
    placeholder: "Young professionals, Eco-conscious consumers, Tech enthusiasts (separate with commas)",
    description: "Who are your ideal customers?"
  },
  { 
    id: 5, 
    title: "Instagram Expectations", 
    field: "instagramExpectations", 
    placeholder: "Engagement-focused, Brand awareness, Product launches (separate with commas)",
    description: "What do you want to achieve on Instagram?"
  },
];

const BrandDNA = () => {
  // const navigate = useNavigate(); // Uncomment if using react-router
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandData, setBrandData] = useState({
    brandName: "",
    brandDescription: "",
    brandValues: "",
    targetAudience: "",
    instagramExpectations: "",
  });

  const handleNext = () => {
    const currentField = steps[currentStep].field as keyof typeof brandData;
    if (!brandData[currentField]?.trim()) {
      toast.error("Please fill in this field before continuing");
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    const currentField = steps[currentStep].field as keyof typeof brandData;
    if (!brandData[currentField]?.trim()) {
      toast.error("Please fill in this field before completing");
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate all required fields are filled
      if (!brandData.brandName.trim() || 
          !brandData.brandDescription.trim() || 
          !brandData.brandValues.trim() || 
          !brandData.targetAudience.trim() || 
          !brandData.instagramExpectations.trim()) {
        toast.error("Please fill in all fields");
        setIsSubmitting(false);
        return;
      }

      // Transform data to match backend schema
      const payload = {
        brand_name: brandData.brandName.trim(),
        brand_description: brandData.brandDescription.trim(),
        brand_values: brandData.brandValues
          .split(',')
          .map(v => v.trim())
          .filter(v => v.length > 0),
        target_audience: brandData.targetAudience
          .split(',')
          .map(a => a.trim())
          .filter(a => a.length > 0),
        instagram_expectations: brandData.instagramExpectations
          .split(',')
          .map(e => e.trim())
          .filter(e => e.length > 0)
      };

      // Validate arrays are not empty
      if (payload.brand_values.length === 0 || 
          payload.target_audience.length === 0 || 
          payload.instagram_expectations.length === 0) {
        toast.error("Please provide at least one value for each field");
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting payload:', payload);

      // Step 1: Start workflow to get session_id
      const workflowResponse = await startWorkflow();
      console.log('Workflow response:', workflowResponse);
      const sessionId = workflowResponse?.data?.session_id;
      
      if (!sessionId) {
        throw new Error('Failed to get session ID from workflow start');
      }
      
      console.log('Workflow started, session ID:', sessionId);

      // Step 2: Submit brand DNA with session_id
      const brandDnaPayload = {
        session_id: sessionId,
        ...payload
      };
      
      console.log('Submitting brand DNA payload:', brandDnaPayload);
      
      const response = await submitBrandDna(brandDnaPayload);
      
      console.log('Brand DNA submission response:', response);
      
      // Store session data for next steps
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('brandDNA', JSON.stringify(brandData));
      localStorage.setItem('workflowStep', 'channel'); // Next step after brand DNA
      
      toast.success("Brand DNA saved successfully!");
      
      // Navigate to dashboard (home) after brand DNA setup
      window.location.href = "/dashboard";
      
    } catch (error) {
      console.error('Error saving brand profile:', error);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to save brand profile";
      toast.error(`Failed to save: ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (value: string) => {
    const field = steps[currentStep].field as keyof typeof brandData;
    setBrandData({ ...brandData, [field]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 shadow-xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 mb-6">
                {steps[currentStep].description}
              </p>

              {currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === 4 ? (
                <Textarea
                  value={brandData[steps[currentStep].field as keyof typeof brandData]}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={steps[currentStep].placeholder}
                  className="min-h-[120px] text-lg"
                  disabled={isSubmitting}
                />
              ) : (
                <Input
                  value={brandData[steps[currentStep].field as keyof typeof brandData]}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={steps[currentStep].placeholder}
                  className="text-lg"
                  disabled={isSubmitting}
                />
              )}
              
              {currentStep >= 2 && (
                <p className="text-sm text-gray-500 mt-2">
                  💡 Tip: Separate multiple items with commas
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext} 
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete} 
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete
                    <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`h-2 w-2 rounded-full transition-all ${
                  index <= currentStep ? "bg-gradient-to-r from-blue-500 to-purple-500 w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default BrandDNA;