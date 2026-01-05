// Helper: Check if workflow is completed (status === 'completed')
export const isWorkflowCompleted = async (session_id) => {
  const res = await getWorkflowStatus(session_id);
  return res?.data?.status === 'completed';
};

import axios from 'axios';

// --- 1. CONFIGURATION ---

// Get the API URL from your frontend's .env file or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


// --- 2. AUTHENTICATION SERVICE ---


export const authService = {
    /**
   * Uses 'application/x-www-form-urlencoded' as required by OAuth2PasswordRequestForm.
   * @param {string} email - Mapped to 'username' for the form
   * @param {string} password
   */
  login: async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email); // FastAPI's form expects 'username'
    params.append('password', password);

    const response = await axios.post(`${API_BASE_URL}/auth/login`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // On success, store the token and user info
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * (Endpoint 37) Registers a new user.
   * @param {string} email
   * @param {string} password
   * @param {string} fullName
   */
  register: async (email, password, fullName) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      full_name: fullName, // Match the Pydantic model
    });

    // Automatically log in the user upon successful registration
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Logs the user out by clearing credentials.
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Force redirect to login
  },

  /**
   * Gets the current user data from local storage.
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};


// --- 3. MAIN API INSTANCE (with Interceptors) ---


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR:
 * Automatically attaches the JWT access token to the
 * 'Authorization' header of *every* request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR:
 * Checks for 401 (Unauthorized) responses. This means the token
 * is expired or invalid. It will automatically call the logout
 * function and redirect to the login page.
 */
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid/expired
      authService.logout(); // Use the logout function defined above
      return Promise.reject(new Error('Unauthorized. Logging out.'));
    }
    // Pass through other errors
    return Promise.reject(error);
  }
);

// --- 4. ALL API ENDPOINT FUNCTIONS ---

// All functions below are exported and use the 'api' instance

// ============= 1. WORKFLOW INITIATION & BRAND DNA =============

// (Endpoint 1) POST /workflow/start
export const startWorkflow = () => api.post('/workflow/start');

// (Endpoint 2) POST /workflow/brand-dna
export const submitBrandDna = (request) => {
  return api.post('/workflow/brand-dna', request);
};

// (Endpoint 3) GET /workflow/status/{session_id}
export const getWorkflowStatus = (session_id) => 
  api.get(`/workflow/status/${session_id}`);


// ============= 2. INSTAGRAM ANALYSIS =============

// (Endpoint 4) POST /instagram/analyze
export const analyzeInstagram = (instagram_input, force_refresh = false) => 
  api.post('/instagram/analyze', { instagram_input, force_refresh });

// (Endpoint 5) GET /instagram/analyze/{username}
export const getCachedAnalysis = (username) => 
  api.get(`/instagram/analyze/${username}`);


// ============= 3. CHANNEL SELECTION =============

// (Endpoint 6) POST /workflow/channel
export const chooseChannel = (request) => 
  api.post('/workflow/channel', request);


// ============= 4. INSTAGRAM WORKFLOW =============

// (Endpoint 7) POST /instagram/campaign-type
export const chooseCampaignType = (request) =>
  api.post('/instagram/campaign-type', request);

// (Endpoint 8) POST /instagram/series-config
export const configureSeries = (request) =>
  api.post('/instagram/series-config', request);

// (Endpoint 9) POST /instagram/content-type
export const chooseContentType = (request) =>
  api.post('/instagram/content-type', request);

// (Endpoint 10) GET /instagram/idea/{session_id}
export const getInstagramIdea = (session_id) =>
  api.get(`/instagram/idea/${session_id}`);

// (Endpoint 11) POST /instagram/idea/action
export const handleInstagramIdeaAction = (request) =>
  api.post('/instagram/idea/action', request);

// (Endpoint 12) GET /instagram/content/{session_id}
export const getInstagramContent = (session_id) =>
  api.get(`/instagram/content/${session_id}`);

// (Endpoint 13) GET /instagram/caption/{session_id}
export const getInstagramCaption = (session_id) =>
  api.get(`/instagram/caption/${session_id}`);

// (Endpoint 14) POST /instagram/next/{session_id}
export const moveToNextDay = (session_id) =>
  api.post(`/instagram/next/${session_id}`);

// (Endpoint 15) GET /instagram/summary/{session_id}
export const getInstagramSummary = (session_id) =>
  api.get(`/instagram/summary/${session_id}`);

// (Endpoint 16) GET /instagram/progress/{session_id}
export const getInstagramProgress = (session_id) =>
  api.get(`/instagram/progress/${session_id}`);

// (Endpoint 17) POST /instagram/generate-images/{session_id}
export const generateActualImages = (session_id) =>
  api.post(`/instagram/generate-images/${session_id}`);

// (Endpoint 18) GET /instagram/images/{session_id}
export const getGeneratedImages = (session_id) =>
  api.get(`/instagram/images/${session_id}`);

// (Endpoint 19) GET /instagram/image/download/{session_id}/{filename}
// Returns a file blob, which you must handle in your component
export const downloadGeneratedImage = (session_id, filename) =>
  api.get(`/instagram/image/download/${session_id}/${filename}`, {
    responseType: 'blob',
  });


// ============= 5. EMAIL WORKFLOW =============

// (Endpoint 17 - Renumbered) POST /email/type
export const chooseEmailType = (request) => 
  api.post('/email/type', request);

// (Endpoint 18 - Renumbered) GET /email/idea/{session_id}
export const getEmailIdea = (session_id) => 
  api.get(`/email/idea/${session_id}`);

// (Endpoint 19 - Renumbered) POST /email/idea/action
export const handleEmailIdeaAction = (request) =>
  api.post('/email/idea/action', request);

// (Endpoint 20 - Renumbered) GET /email/content/{session_id}
export const getEmailContent = (session_id) =>
  api.get(`/email/content/${session_id}`);

// (Endpoint 21 - Renumbered) GET /email/summary/{session_id}
export const getEmailSummary = (session_id) =>
  api.get(`/email/summary/${session_id}`);


// ============= 6. SCHEDULING =============

// (Endpoint 22) POST /schedule
export const createSchedule = (request) => 
  api.post('/schedule', request);

// (Endpoint 23) GET /schedule
// Pass null or undefined for filters you don't want to use
export const getAllSchedules = (status, content_type) =>
  api.get('/schedule', { 
    params: { status, content_type } 
  });

// (Endpoint 24) GET /schedule/{schedule_id}
export const getSchedule = (schedule_id) =>
  api.get(`/schedule/${schedule_id}`);

// (Endpoint 25) PUT /schedule/{schedule_id}
export const updateSchedule = (schedule_id, update) =>
  api.put(`/schedule/${schedule_id}`, update);

// (Endpoint 26) DELETE /schedule/{schedule_id}
export const deleteSchedule = (schedule_id) =>
  api.delete(`/schedule/${schedule_id}`);


// ============= 7. SCHEDULER DAEMON =============

// (Endpoint 27) POST /scheduler/start
export const startScheduler = () => api.post('/scheduler/start');

// (Endpoint 28) POST /scheduler/stop
export const stopScheduler = () => api.post('/scheduler/stop');

// (Endpoint 29) GET /scheduler/status
export const getSchedulerStatus = () => api.get('/scheduler/status');

// (Endpoint 30) POST /scheduler/check
export const manualSchedulerCheck = () => api.post('/scheduler/check');


// ============= 8. CONTENT MANAGEMENT =============

// (Endpoint 31) GET /content
export const listAllContent = (session_id, content_type) =>
  api.get('/content', { 
    params: { session_id, content_type } 
  });

// (Endpoint 32) GET /content/download/{filename}
// Returns a file blob
export const downloadContentFile = (filename) =>
  api.get(`/content/download/${filename}`, {
    responseType: 'blob',
  });

// (Endpoint 33) GET /content/campaign/{session_id}
export const getCampaignContent = (session_id) =>
  api.get(`/content/campaign/${session_id}`);


// ============= 9. UTILITIES =============

// (Endpoint 34) POST /utility/parse-instagram
export const parseInstagramInput = (input_text) =>
  api.post('/utility/parse-instagram', { input_text });

// (Endpoint 35) GET /utility/recommendations/{content_type}
export const getPostingRecommendations = (content_type) =>
  api.get(`/utility/recommendations/${content_type}`);

// (Endpoint 36) GET /utility/trends
export const getCurrentTrends = () => api.get('/utility/trends');


// ============= 10. AUTHENTICATION (Handled by authService) =============

// (Endpoint 37) POST /auth/register - See authService
// (Endpoint 38) POST /auth/login - See authService

// (Endpoint 39) GET /users/me
export const getCurrentUserInfo = () => api.get('/users/me');


// ============= 11. USER WORKFLOWS =============

// (Endpoint 40) GET /workflows
export const getUserWorkflows = () => api.get('/workflows');

// (Endpoint 41) DELETE /workflows/{session_id}
export const deleteUserWorkflow = (session_id) =>
  api.delete(`/workflows/${session_id}`);


// ============= ROOT & HEALTH =============


// ============= ROOT & HEALTH =============

// GET /health
export const getHealthCheck = () => api.get('/health');

// GET /
export const getApiRoot = () => api.get('/');


// ============= 12. CHAT-BASED NATURAL LANGUAGE =============

// (Endpoint 42) POST /chat/message
export const sendChatMessage = (session_id, message, channel = null) =>
  api.post('/chat/message', { session_id, message, channel });