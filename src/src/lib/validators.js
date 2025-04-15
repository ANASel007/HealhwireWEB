// Email validation
export const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
};

// Password validation
export const validatePassword = (password) => {
    const minLength = 8;

    if (!password || password.length < minLength) {
        return {
            valid: false,
            message: `Password must be at least ${minLength} characters`,
        };
    }

    return { valid: true };
};

// Phone number validation
export const validatePhone = (phone) => {
    const regex = /^\+?[0-9]{10,15}$/;

    if (!regex.test(phone)) {
        return {
            valid: false,
            message: 'Invalid phone number format',
        };
    }

    return { valid: true };
};

// URL validation
export const validateUrl = (url) => {
    if (!url) return { valid: true };

    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    if (!regex.test(url)) {
        return {
            valid: false,
            message: 'Invalid URL format',
        };
    }

    return { valid: true };
};

// Form validation - common fields
export const validateCommonFields = (data) => {
    const errors = {};

    if (!data.nom || data.nom.trim().length < 2) {
        errors.nom = 'Name must be at least 2 characters';
    }

    if (!data.ville) {
        errors.ville = 'City is required';
    }

    if (!data.email || !validateEmail(data.email)) {
        errors.email = 'Valid email is required';
    }

    const phoneValidation = validatePhone(data.telephone || '');
    if (!phoneValidation.valid) {
        errors.telephone = phoneValidation.message;
    }

    if (data.imageurl) {
        const urlValidation = validateUrl(data.imageurl);
        if (!urlValidation.valid) {
            errors.imageurl = urlValidation.message;
        }
    }

    const passwordValidation = validatePassword(data.password || '');
    if (data.password && !passwordValidation.valid) {
        errors.password = passwordValidation.message;
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

// Doctor-specific validation
export const validateDoctorFields = (data) => {
    const commonValidation = validateCommonFields(data);
    const errors = { ...commonValidation.errors };

    if (!data.specialite) {
        errors.specialite = 'Specialty is required';
    }

    if (data.default_price && (isNaN(data.default_price) || data.default_price < 0)) {
        errors.default_price = 'Price must be a valid positive number';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

// Appointment validation
export const validateAppointment = (data) => {
    const errors = {};

    if (!data.id_doc) {
        errors.id_doc = 'Doctor is required';
    }

    if (!data.id_clt) {
        errors.id_clt = 'Patient is required';
    }

    if (!data.date) {
        errors.date = 'Date and time are required';
    }

    if (!data.description_rdv || data.description_rdv.trim().length < 5) {
        errors.description_rdv = 'Description must be at least 5 characters';
    }

    if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
        errors.price = 'Price must be a valid positive number';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

// Prescription validation
export const validatePrescription = (data) => {
    const errors = {};

    if (!data.client_id) {
        errors.client_id = 'Patient is required';
    }

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        errors.items = 'At least one medication is required';
    } else {
        const itemErrors = [];
        data.items.forEach((item, index) => {
            const itemError = {};

            if (!item.medication) {
                itemError.medication = 'Medication name is required';
            }

            if (!item.dosage) {
                itemError.dosage = 'Dosage is required';
            }

            if (!item.frequency) {
                itemError.frequency = 'Frequency is required';
            }

            if (!item.duration) {
                itemError.duration = 'Duration is required';
            }

            if (Object.keys(itemError).length > 0) {
                itemErrors[index] = itemError;
            }
        });

        if (itemErrors.length > 0) {
            errors.items = itemErrors;
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

// Medical record validation
export const validateMedicalRecord = (data) => {
    const errors = {};

    // Validating an allergy
    if (data.allergy_name !== undefined && !data.allergy_name) {
        errors.allergy_name = 'Allergy name is required';
    }

    // Validating a condition
    if (data.condition_name !== undefined && !data.condition_name) {
        errors.condition_name = 'Condition name is required';
    }

    if (data.diagnosis_date !== undefined && !data.diagnosis_date) {
        errors.diagnosis_date = 'Diagnosis date is required';
    }

    // Validating a consultation
    if (data.consultation_date !== undefined && !data.consultation_date) {
        errors.consultation_date = 'Consultation date is required';
    }

    if (data.consultation_type !== undefined && !data.consultation_type) {
        errors.consultation_type = 'Consultation type is required';
    }

    if (data.diagnosis !== undefined && !data.diagnosis) {
        errors.diagnosis = 'Diagnosis is required';
    }

    if (data.treatment !== undefined && !data.treatment) {
        errors.treatment = 'Treatment is required';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};