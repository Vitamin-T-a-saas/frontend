import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Image, Video, Mail, Loader2, AlertCircle, CheckCircle, Sparkles, Download, Send, Film, Calendar, Clock, X
} from "lucide-react";

const API_BASE_URL = 'http://localhost:8000';

const Toast = ({ message, type, onClose }) => {
  const colors = { success: "bg-green-500", error: "bg-red-500", warning: "bg-amber-500", info: "bg-blue-500" };
  
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 max-w-md`}
    >
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      <span className="flex-1 text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 font-bold hover:opacity-80">×</button>
    </motion.div>
  );
};

const ScheduleModal = ({ isOpen, onClose, onSchedule, contentType, brandName }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const getSuggestedDates = () => {
    const now = new Date();
    const suggestions = [];
    
    // Tomorrow at 11 AM
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(11, 0, 0, 0);
    suggestions.push({ label: "Tomorrow at 11 AM", date: tomorrow });
    
    // Day after at 2 PM
    const dayAfter = new Date(now);
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(14, 0, 0, 0);
    suggestions.push({ label: "In 2 days at 2 PM", date: dayAfter });
    
    // Next week at 10 AM
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(10, 0, 0, 0);
    suggestions.push({ label: "Next week at 10 AM", date: nextWeek });
    
    return suggestions;
  };

  const handleSchedule = () => {
    const dateToSchedule = useCustom ? new Date(customDate) : new Date(selectedDate);
    if (!dateToSchedule || isNaN(dateToSchedule.getTime())) {
      alert("Please select a valid date");
      return;
    }
    onSchedule(dateToSchedule);
    onClose();
  };

  if (!isOpen) return null;

  const suggestions = getSuggestedDates();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Schedule Post</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Suggested Times</Label>
            <div className="space-y-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDate(suggestion.date.toISOString());
                    setUseCustom(false);
                  }}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                    selectedDate === suggestion.date.toISOString() && !useCustom
                      ? "border-purple-500 bg-purple-50"
                      : "border-slate-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-sm">{suggestion.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-2 block">Or Choose Custom Date & Time</Label>
            <Input
              type="datetime-local"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setUseCustom(true);
                setSelectedDate("");
              }}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSchedule} 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={!selectedDate && !customDate}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Campaigns = () => {
  const [activeTab, setActiveTab] = useState("instagram");
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [brandName, setBrandName] = useState("kaizan clothing");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  
  const [awaitingContentTypeChoice, setAwaitingContentTypeChoice] = useState(false);
  const [awaitingIdeaApproval, setAwaitingIdeaApproval] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [pendingContentType, setPendingContentType] = useState("");
  const [currentIdea, setCurrentIdea] = useState("");
  
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [emailContent, setEmailContent] = useState("");
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const addMessage = (content, role = "assistant") => {
    setMessages(prev => [...prev, { role, content, timestamp: Date.now() }]);
  };

  useEffect(() => {
    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
  }, [messages]);

  useEffect(() => {
    handleStartWorkflow();
  }, []);

  const handleStartWorkflow = async () => {
    try {
      const storedSessionId = localStorage.getItem('sessionId');
      const storedBrandData = localStorage.getItem('brandDNA');

      if (storedSessionId && storedBrandData) {
        setSessionId(storedSessionId);
        const parsedBrand = JSON.parse(storedBrandData);
        setBrandName(parsedBrand.brandName || "Your Brand");
        
        addMessage(`Welcome back, ${parsedBrand.brandName}! 🎨`);
        addMessage("What would you like to create today? Just describe your content idea!");
        showToast("Session restored!", "success");
      } else {
        const response = await fetch(`${API_BASE_URL}/workflow/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        setSessionId(data.session_id);
        localStorage.setItem('sessionId', data.session_id);
        
        await fetch(`${API_BASE_URL}/workflow/brand-dna`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: data.session_id,
            brand_name: brandName,
            brand_description: "Sustainable fashion brand",
            brand_values: ["sustainability", "innovation"],
            target_audience: ["eco-conscious consumers"],
            instagram_expectations: ["engaging content"]
          })
        });
        
        localStorage.setItem('brandDNA', JSON.stringify({
          brandName: brandName,
          brandDescription: "Sustainable fashion brand",
          targetAudience: "eco-conscious consumers",
          instagramExpectations: "engaging content"
        }));
        
        addMessage("👋 Welcome! I'm your AI content assistant.");
        addMessage("Just tell me what you'd like to create! For example:\n• \"Create a post about our sustainable materials\"\n• \"Make a reel for our new collection\"\n• \"Generate an email campaign\"");
        showToast("Ready to create!", "success");
      }
    } catch (error) {
      console.error("Workflow start error:", error);
      showToast("Failed to initialize. Please refresh.", "error");
    }
  };

  const handleChannelSelect = async (channel) => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/workflow/channel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, channel })
      });
      setActiveTab(channel);
      showToast(`${channel === "instagram" ? "Instagram" : "Email"} selected!`, "success");
    } catch (error) {
      showToast("Failed to select channel", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !sessionId) return;
    
    const userMessage = chatInput.trim();
    addMessage(userMessage, "user");
    setChatInput("");
    
    const isInstagramRequest = userMessage.toLowerCase().includes('post') || 
                               userMessage.toLowerCase().includes('reel') ||
                               userMessage.toLowerCase().includes('instagram');
    
    const isEmailRequest = userMessage.toLowerCase().includes('email') || 
                          userMessage.toLowerCase().includes('mail');
    
    if (isInstagramRequest && activeTab !== "instagram") {
      await handleChannelSelect("instagram");
    } else if (isEmailRequest && activeTab !== "email") {
      await handleChannelSelect("email");
    }
    
    const hasReelKeyword = userMessage.toLowerCase().includes('reel') || 
                          userMessage.toLowerCase().includes('video') ||
                          userMessage.toLowerCase().includes('script');
    
    const hasPostKeyword = userMessage.toLowerCase().includes('post') || 
                          userMessage.toLowerCase().includes('image') ||
                          userMessage.toLowerCase().includes('photo');
    
    if (activeTab === "instagram" && !hasReelKeyword && !hasPostKeyword) {
      setPendingPrompt(userMessage);
      setAwaitingContentTypeChoice(true);
      addMessage("Great! Would you like to create a Reel or a Post?", "assistant");
      return;
    }
    
    // Generate idea first
    await generateIdea(userMessage, hasReelKeyword ? "reel" : "post");
  };

  const handleContentTypeSelection = async (contentType) => {
    setAwaitingContentTypeChoice(false);
    setPendingContentType(contentType);
    addMessage(contentType === "reel" ? "🎬 Reel selected!" : "📸 Post selected!", "assistant");
    await generateIdea(pendingPrompt, contentType);
    setPendingPrompt("");
  };

  const generateIdea = async (prompt, contentType) => {
    setIsLoading(true);
    try {
      addMessage(`Creating an idea for your ${contentType}...`, "assistant");
      
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: `Generate just an idea for a ${contentType} about: ${prompt}. Don't generate images yet.`,
          channel: activeTab
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.content && data.content.idea) {
        const idea = data.content.idea;
        setCurrentIdea(idea);
        setPendingContentType(contentType);
        setAwaitingIdeaApproval(true);
        
        addMessage(`✨ **Content Idea:**\n\n${idea}\n\nWould you like me to generate this with images and caption?`, "assistant");
      } else {
        addMessage(data.response || "Failed to generate idea.", "assistant");
      }
    } catch (error) {
      console.error("Idea generation error:", error);
      addMessage("I encountered an error. Please try again.", "assistant");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeaApproval = async (approved) => {
    if (!approved) {
      setAwaitingIdeaApproval(false);
      setCurrentIdea("");
      addMessage("Let's try a different idea! What would you like to create?", "assistant");
      return;
    }

    setAwaitingIdeaApproval(false);
    await generateFullContent(pendingContentType);
  };

  const generateFullContent = async (contentType) => {
    setIsLoading(true);
    
    try {
      addMessage(`Creating your complete ${contentType} with images and caption...`, "assistant");
      
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: `Create a ${contentType} about: ${currentIdea}`,
          channel: activeTab
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addMessage(data.response, "assistant");
        
        if (data.content) {
          const content = data.content;
          
          if (content.caption) setGeneratedCaption(content.caption);
          if (content.email_content) setEmailContent(content.email_content);
          if (content.images && content.images.length > 0) setGeneratedImages(content.images);
          if (content.storyboard) setGeneratedContent({ content_type: "reel", storyboard: content.storyboard });
          if (content.post_data) setGeneratedContent({ content_type: "post", post_data: content.post_data });
          
          setIsContentReady(true);
          addMessage("✅ Content ready! Would you like to schedule this?", "assistant");
        }
        
        showToast("Content generated successfully!", "success");
      } else {
        addMessage(data.response || "Sorry, something went wrong.", "assistant");
      }
    } catch (error) {
      console.error("Generation error:", error);
      addMessage("I encountered an error. Please try again.", "assistant");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleClick = () => {
    if (!isContentReady) {
      showToast("Please generate content first", "warning");
      return;
    }
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (scheduledDate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          content_type: generatedContent?.content_type || "post",
          instagram_username: brandName.toLowerCase().replace(/\s/g, '_'),
          scheduled_date: scheduledDate.toISOString(),
          content_description: currentIdea,
          content_path: generatedImages[0]?.path || ""
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast("Content scheduled successfully!", "success");
        addMessage(`🎉 Scheduled for ${scheduledDate.toLocaleString()}! Check the Schedule page.`, "assistant");
      } else {
        showToast("Failed to schedule", "error");
      }
    } catch (error) {
      console.error("Schedule error:", error);
      showToast("Failed to schedule", "error");
    }
  };

  const handleDownloadImage = async (filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/instagram/image/download/${sessionId}/${filename}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast("Image downloaded!", "success");
    } catch (error) {
      showToast("Download failed", "error");
    }
  };

  const handleStartNew = () => {
    setGeneratedContent(null);
    setGeneratedCaption("");
    setGeneratedImages([]);
    setEmailContent("");
    setCurrentIdea("");
    setIsContentReady(false);
    addMessage("Let's create something new! What would you like to make?", "assistant");
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleSubmit}
        contentType={generatedContent?.content_type || "post"}
        brandName={brandName}
      />

      <div className="border-b bg-white p-4 flex items-center justify-between shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Campaigns
          </h1>
          <p className="text-xs text-slate-500">AI Content Assistant</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
          <button
            onClick={() => handleChannelSelect("instagram")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "instagram" ? "bg-white text-purple-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Image className="h-4 w-4" /> Instagram
          </button>
          <button
            onClick={() => handleChannelSelect("email")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "email" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Mail className="h-4 w-4" /> Email
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="w-1/2 flex flex-col border-r bg-white">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 max-w-2xl mx-auto pb-4">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm"
                        : "bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}

                {awaitingContentTypeChoice && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                    <div className="flex gap-3">
                      <Button onClick={() => handleContentTypeSelection("reel")} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
                        <Film className="h-4 w-4 mr-2" /> Create Reel
                      </Button>
                      <Button onClick={() => handleContentTypeSelection("post")} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg">
                        <Image className="h-4 w-4 mr-2" /> Create Post
                      </Button>
                    </div>
                  </motion.div>
                )}

                {awaitingIdeaApproval && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                    <div className="flex gap-3">
                      <Button onClick={() => handleIdeaApproval(true)} className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="h-4 w-4 mr-2" /> Yes, Generate It!
                      </Button>
                      <Button onClick={() => handleIdeaApproval(false)} variant="outline">
                        Try Different Idea
                      </Button>
                    </div>
                  </motion.div>
                )}

                {isContentReady && !awaitingIdeaApproval && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                    <Button onClick={handleScheduleClick} className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Calendar className="h-4 w-4 mr-2" /> Schedule This
                    </Button>
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-slate-500 text-sm p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating magic...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit();
                  }
                }}
                placeholder="Describe what you'd like to create..." 
                className="flex-1" 
                disabled={isLoading || !sessionId || awaitingContentTypeChoice || awaitingIdeaApproval}
              />
              <Button 
                onClick={handleChatSubmit} 
                size="icon" 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isLoading || !chatInput.trim() || !sessionId || awaitingContentTypeChoice || awaitingIdeaApproval}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {(generatedContent || generatedCaption || emailContent) && (
              <Button onClick={handleStartNew} variant="outline" className="w-full mt-2">
                Start Fresh Campaign
              </Button>
            )}
          </div>
        </div>

        <div className="w-1/2 bg-slate-50 flex flex-col">
          <div className="p-3 border-b bg-white flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs font-semibold text-slate-500 ml-2">Live Preview</span>
          </div>

          <ScrollArea className="flex-1 p-8">
            <div className="max-w-md mx-auto bg-white min-h-[600px] shadow-2xl rounded-xl border overflow-hidden">
              <div className="bg-slate-100 p-4 border-b flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                  {brandName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold">{brandName}</div>
                  <div className="text-xs text-slate-500">{activeTab === "instagram" ? "Instagram" : "Email"}</div>
                </div>
              </div>

              <div className="p-0">
                {generatedContent?.content_type === "reel" && generatedContent.storyboard && (
                  <div className="p-6 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                      <Film className="h-4 w-4" /> Reel Storyboard
                    </h4>
                    {generatedContent.storyboard.scenePrompts?.map((scene, i) => (
                      <div key={i} className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="w-7 h-7 flex-shrink-0 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        <div className="text-xs flex-1">
                          <p className="font-medium text-slate-800">{scene}</p>
                          {generatedContent.storyboard.dialogue?.[i] && (
                            <p className="text-slate-500 mt-1 italic">"{generatedContent.storyboard.dialogue[i]}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {generatedContent?.content_type === "post" && generatedContent.post_data && (
                  <div className="p-6 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                      <Image className="h-4 w-4" /> Post Details
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <p className="text-sm text-slate-700">
                        {generatedContent.post_data.post_type === "carousel" ? "Carousel Post" : "Single Post"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {generatedContent.post_data.image_prompts?.length || 0} image(s)
                      </p>
                    </div>
                  </div>
                )}

                {generatedImages.length > 0 && (
                  <div className="border-t">
                    <div className={activeTab === "instagram" ? 
                      (generatedContent?.content_type === "reel" ? "grid grid-cols-3 gap-0.5" : "grid grid-cols-2 gap-0.5") : 
                      "p-4 space-y-3"
                    }>
                      {generatedImages.map((img, i) => {
                        let filename, filepath;
                        if (typeof img === 'string') {
                          filepath = img;
                          filename = img.split('/').pop() || img.split('\\').pop() || `image_${i}.png`;
                        } else {
                          filepath = img.path || img.filename;
                          filename = img.filename || img.path?.split('/').pop() || `image_${i}.png`;
                        }
                        const imageUrl = `${API_BASE_URL}/instagram/image/download/${sessionId}/${filename}`;
                        
                        return (
                          <div key={i} className="relative group bg-slate-100">
                            <img
                              src={imageUrl}
                              className="w-full h-full object-cover aspect-square"
                              alt={`Generated ${i + 1}`}
                              onError={(e) => {
                                console.error(`Failed to load image: ${imageUrl}`);
                                e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e2e8f0' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2364748b'%3EImage ${i + 1}%3C/text%3E%3C/svg%3E`;
                              }}
                            />
                            <Button size="sm" onClick={() => handleDownloadImage(filename)} className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-700 hover:bg-slate-100">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {generatedCaption && (
                  <div className="p-4 border-t">
                    <div className="text-sm text-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                        <span className="font-semibold">{brandName.toLowerCase().replace(/\s/g, '_')}</span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{generatedCaption}</p>
                    </div>
                  </div>
                )}

                {emailContent && (
                  <div className="p-4">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 bg-slate-50 p-4 rounded border">{emailContent}</pre>
                    </div>
                  </div>
                )}

                {!generatedContent && !generatedCaption && !emailContent && generatedImages.length === 0 && (
                  <div className="h-96 flex flex-col items-center justify-center text-slate-300">
                    {activeTab === "instagram" ? <Image className="h-16 w-16 mb-3" /> : <Mail className="h-16 w-16 mb-3" />}
                    <p className="text-sm">Preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;