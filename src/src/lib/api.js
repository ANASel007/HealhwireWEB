import axios from './axios';

// Authentication API
export const authApi = {
    // Login methods
    login: (email, password, userType) =>
        axios.post(`/auth/basic/login/${userType}`, { email, password }),

    enhancedLogin: (email, password, userType) =>
        axios.post(`/auth/enhanced/login/${userType}`, { email, password }),

    verifyMFA: (userId, userType, token, tempToken) =>
        axios.post('/auth/enhanced/mfa/verify', { userId, userType, token, tempToken }),

    // Registration methods
    register: (userData, userType) =>
        axios.post(`/auth/basic/register/${userType}`, userData),

    // Current user
    getCurrentUser: () =>
        axios.get('/auth/basic/user'),

    // MFA management
    enableMFA: () =>
        axios.post('/auth/enhanced/mfa/enable'),

    disableMFA: (token) =>
        axios.post('/auth/enhanced/mfa/disable', { token }),

    getAuthLogs: () =>
        axios.get('/auth/enhanced/logs'),
};

// Doctors API
export const doctorsApi = {
    getAll: () =>
        axios.get('/doctors'),

    getById: (id) =>
        axios.get(`/doctors/${id}`),

    update: (id, data) =>
        axios.put(`/doctors/${id}`, data),

    delete: (id) =>
        axios.delete(`/doctors/${id}`),

    changePassword: (id, currentPassword, newPassword) =>
        axios.put(`/doctors/${id}/password`, { currentPassword, newPassword }),

    updatePrice: (id, defaultPrice, currencyCode) =>
        axios.put(`/doctors/${id}/price`, { default_price: defaultPrice, currency_code: currencyCode }),

    getAppointments: (id) =>
        axios.get(`/doctors/${id}/appointments`),
};

// Clients API
export const clientsApi = {
    getAll: () =>
        axios.get('/clients'),

    getById: (id) =>
        axios.get(`/clients/${id}`),

    update: (id, data) =>
        axios.put(`/clients/${id}`, data),

    delete: (id) =>
        axios.delete(`/clients/${id}`),

    changePassword: (id, currentPassword, newPassword) =>
        axios.put(`/clients/${id}/password`, { currentPassword, newPassword }),

    getAppointments: (id) =>
        axios.get(`/clients/${id}/appointments`),
};

// Appointments API
export const appointmentsApi = {
    getAll: () =>
        axios.get('/appointments'),

    getById: (id) =>
        axios.get(`/appointments/${id}`),

    create: (data) =>
        axios.post('/appointments', data),

    update: (id, data) =>
        axios.put(`/appointments/${id}`, data),

    updateStatus: (id, status) =>
        axios.put(`/appointments/${id}/status`, { status }),

    updatePrice: (id, price) =>
        axios.put(`/appointments/${id}/price`, { price }),

    delete: (id) =>
        axios.delete(`/appointments/${id}`),

    getAvailableSlots: (doctorId, date) =>
        axios.get(`/appointments/available/${doctorId}?date=${date}`),

    getDateRange: (startDate, endDate) =>
        axios.get(`/appointments/date-range?startDate=${startDate}&endDate=${endDate}`),
};

// Medical Records API
export const medicalRecordsApi = {
    getByClientId: (clientId) =>
        axios.get(`/medical-records/${clientId}`),

    updateRecord: (clientId, data) =>
        axios.put(`/medical-records/${clientId}`, data),

    addAllergy: (clientId, data) =>
        axios.post(`/medical-records/${clientId}/allergies`, data),

    removeAllergy: (clientId, allergyId) =>
        axios.delete(`/medical-records/${clientId}/allergies/${allergyId}`),

    addCondition: (clientId, data) =>
        axios.post(`/medical-records/${clientId}/conditions`, data),

    updateCondition: (clientId, conditionId, data) =>
        axios.put(`/medical-records/${clientId}/conditions/${conditionId}`, data),

    removeCondition: (clientId, conditionId) =>
        axios.delete(`/medical-records/${clientId}/conditions/${conditionId}`),

    addConsultation: (clientId, data) =>
        axios.post(`/medical-records/${clientId}/consultations`, data),

    updateConsultation: (clientId, consultationId, data) =>
        axios.put(`/medical-records/${clientId}/consultations/${consultationId}`, data),

    getLogs: (clientId) =>
        axios.get(`/medical-records/${clientId}/logs`),
};

// Prescriptions API
export const prescriptionsApi = {
    getByClientId: (clientId) =>
        axios.get(`/prescriptions/client/${clientId}`),

    getByDoctorId: (doctorId) =>
        axios.get(`/prescriptions/doctor/${doctorId}`),

    getById: (id) =>
        axios.get(`/prescriptions/${id}`),

    create: (data) =>
        axios.post('/prescriptions', data),

    updateStatus: (id, status) =>
        axios.put(`/prescriptions/${id}/status`, { status }),

    sendToPharmacy: (id, pharmacyId) =>
        axios.post(`/prescriptions/${id}/send`, { pharmacy_id: pharmacyId }),

    getPharmacies: () =>
        axios.get('/prescriptions/pharmacies'),

    addPharmacy: (data) =>
        axios.post('/prescriptions/pharmacies', data),
};

// Messages API
export const messagesApi = {
    getConversation: (doctorId, clientId) =>
        axios.get(`/messages/doctor/${doctorId}/client/${clientId}`),

    getDoctorConversations: (doctorId) =>
        axios.get(`/messages/doctor/${doctorId}/conversations`),

    getClientConversations: (clientId) =>
        axios.get(`/messages/client/${clientId}/conversations`),

    sendMessage: (receiverId, receiverType, messageContent) =>
        axios.post('/messages/send', { receiverId, receiverType, messageContent }),

    getUnreadCount: () =>
        axios.get('/messages/unread'),

    markAsRead: (senderId, senderType) =>
        axios.put('/messages/read', { senderId, senderType }),

    getMessage: (id) =>
        axios.get(`/messages/${id}`),

    deleteMessage: (id) =>
        axios.delete(`/messages/${id}`),

    searchMessages: (query) =>
        axios.get(`/messages/search?query=${query}`),
};

// Notifications API
export const notificationsApi = {
    getAll: () =>
        axios.get('/notifications'),

    markAsRead: (id) =>
        axios.put(`/notifications/${id}/read`),

    markAllAsRead: () =>
        axios.put('/notifications/read-all'),

    getPreferences: () =>
        axios.get('/notifications/preferences'),

    updatePreferences: (data) =>
        axios.put('/notifications/preferences', data),

    sendAppointmentReminder: (appointmentId) =>
        axios.post(`/notifications/appointments/${appointmentId}/send-reminder`),
};