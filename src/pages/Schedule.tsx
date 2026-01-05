import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Clock, Instagram, Mail, Image, Film, Eye } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL = 'http://localhost:8000';

const ContentPreviewModal = ({ isOpen, onClose, schedule }) => {
  if (!isOpen || !schedule) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h3 className="text-2xl font-bold">{schedule.content_description}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(schedule.scheduled_date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(schedule.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            {schedule.content_type === 'instagram' || schedule.content_type === 'reel' || schedule.content_type === 'post' ? (
              <>
                <Instagram className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Instagram</span>
                <span className="text-slate-500">•</span>
                {schedule.content_type === 'reel' ? <Film className="h-4 w-4" /> : <Image className="h-4 w-4" />}
                <span className="capitalize">{schedule.content_type}</span>
              </>
            ) : (
              <>
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Email</span>
              </>
            )}
          </div>

          {schedule.content_path && (
            <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Preview</p>
              <img 
                src={`${API_BASE_URL}/instagram/image/download/${schedule.session_id}/${schedule.content_path.split('/').pop()}`}
                alt="Content preview"
                className="w-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm font-medium mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              schedule.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              schedule.status === 'ready_to_post' ? 'bg-green-100 text-green-800' :
              'bg-slate-100 text-slate-800'
            }`}>
              {schedule.status === 'pending' ? 'Scheduled' : 
               schedule.status === 'ready_to_post' ? 'Ready to Post' : 
               schedule.status}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledContent, setScheduledContent] = useState({});
  const [allSchedules, setAllSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    fetchSchedules();
  }, [currentDate]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/schedule`);
      const data = await response.json();
      
      const map = {};
      const allEntries = [];

      if (data?.schedule_entries) {
        data.schedule_entries.forEach(entry => {
          allEntries.push(entry);
          const date = new Date(entry.scheduled_date);
          
          if (
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear()
          ) {
            const day = date.getDate();
            if (!map[day]) map[day] = [];
            map[day].push({
              ...entry,
              type: entry.content_type,
              title: entry.content_description || entry.content_type
            });
          }
        });
      }

      setScheduledContent(map);
      setAllSchedules(allEntries);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      setScheduledContent({});
      setAllSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handlePreviewClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowPreviewModal(true);
  };

  return (
    <div className="p-8 space-y-6">
      <ContentPreviewModal 
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        schedule={selectedSchedule}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Schedule</h1>
          <p className="text-muted-foreground">Plan and manage your content calendar</p>
        </div>
      </div>

      {allSchedules.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Content</h2>
          <div className="space-y-3">
            {allSchedules.slice(0, 5).map((schedule) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  {schedule.content_type === 'instagram' || schedule.content_type === 'reel' || schedule.content_type === 'post' ? (
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Instagram className="h-6 w-6 text-purple-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{schedule.content_description || 'Untitled Content'}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(schedule.scheduled_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(schedule.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <span className="flex items-center gap-1">
                      {schedule.content_type === 'reel' ? <Film className="h-3 w-3" /> : <Image className="h-3 w-3" />}
                      <span className="capitalize">{schedule.content_type}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    schedule.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    schedule.status === 'ready_to_post' ? 'bg-green-100 text-green-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {schedule.status === 'pending' ? 'Scheduled' : 
                     schedule.status === 'ready_to_post' ? 'Ready' : 
                     schedule.status}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreviewClick(schedule)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center font-semibold text-muted-foreground pb-2">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const hasContent = scheduledContent[day];
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={day}
                className={`aspect-square border rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer ${
                  isToday ? "border-purple-500 bg-purple-50" : ""
                }`}
              >
                <div className="flex flex-col h-full">
                  <span className={`text-sm font-medium mb-1 ${isToday ? "text-purple-600" : ""}`}>
                    {day}
                  </span>
                  {hasContent && (
                    <div className="space-y-1 flex-1">
                      {hasContent.slice(0, 3).map((content, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-1 rounded truncate ${
                            content.type === "instagram" || content.type === "reel" || content.type === "post"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                          title={content.title}
                        >
                          {content.title}
                        </div>
                      ))}
                      {hasContent.length > 3 && (
                        <div className="text-xs text-slate-500">+{hasContent.length - 3} more</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-100"></div>
            <span className="text-sm">Instagram</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100"></div>
            <span className="text-sm">Email</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Schedule;