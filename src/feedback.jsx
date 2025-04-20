import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./feedback.css";

const Feedback = () => {
  const [formData, setFormData] = useState({
    mentalHealthRating: "",
    stressFrequency: "",
    overwhelmedFrequency: "",
    emotionalAwareness: "",
    copingMechanisms: "",
    healthyCopingUsage: "",
    productivityImpact: "",
    socialConnection: "",
    talkingComfort: "",
    professionalHelp: "",
    resourceAccess: "",
    additionalSupport: "",
  });
  
  const [userId, setUserId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({...formErrors, [e.target.name]: null});
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Check each field for empty values
    Object.entries(formData).forEach(([key, value]) => {
      if (!value || value.trim() === "") {
        errors[key] = "This field is required";
        isValid = false;
      }
    });
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    try {
      const { error } = await supabase.from("mental_health_feedback").insert([
        {
          user_id: userId,
          mental_health_rating: formData.mentalHealthRating,
          stress_frequency: formData.stressFrequency,
          overwhelmed_frequency: formData.overwhelmedFrequency,
          emotional_awareness: formData.emotionalAwareness,
          coping_mechanisms: formData.copingMechanisms,
          healthy_coping_usage: formData.healthyCopingUsage,
          productivity_impact: formData.productivityImpact,
          social_connection: formData.socialConnection,
          talking_comfort: formData.talkingComfort,
          professional_help: formData.professionalHelp,
          resource_access: formData.resourceAccess,
          additional_support: formData.additionalSupport,
        },
      ]);
      if (error) throw error;
      alert("Thank you for your feedback!");
      // Reset form after successful submission
      setFormData({
        mentalHealthRating: "",
        stressFrequency: "",
        overwhelmedFrequency: "",
        emotionalAwareness: "",
        copingMechanisms: "",
        healthyCopingUsage: "",
        productivityImpact: "",
        socialConnection: "",
        talkingComfort: "",
        professionalHelp: "",
        resourceAccess: "",
        additionalSupport: "",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Mental Health Feedback Form</h2>
      <p className="required-note">* All fields are required</p>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label className="form-label">
            How would you rate your overall mental health in the past two weeks? *
          </label>
          <select 
            name="mentalHealthRating" 
            onChange={handleChange} 
            className={`form-select ${formErrors.mentalHealthRating ? 'error' : ''}`}
            value={formData.mentalHealthRating}
            required
          >
            <option value="">Select</option>
            <option value="Poor">Poor</option>
            <option value="Fair">Fair</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
          </select>
          {formErrors.mentalHealthRating && <p className="error-text">{formErrors.mentalHealthRating}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Have you experienced frequent stress, anxiety, or sadness in the last month? *
          </label>
          <select 
            name="stressFrequency" 
            onChange={handleChange} 
            className={`form-select ${formErrors.stressFrequency ? 'error' : ''}`}
            value={formData.stressFrequency}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {formErrors.stressFrequency && <p className="error-text">{formErrors.stressFrequency}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            How often do you feel overwhelmed with daily tasks? *
          </label>
          <select 
            name="overwhelmedFrequency" 
            onChange={handleChange} 
            className={`form-select ${formErrors.overwhelmedFrequency ? 'error' : ''}`}
            value={formData.overwhelmedFrequency}
            required
          >
            <option value="">Select</option>
            <option value="Never">Never</option>
            <option value="Sometimes">Sometimes</option>
            <option value="Often">Often</option>
            <option value="Always">Always</option>
          </select>
          {formErrors.overwhelmedFrequency && <p className="error-text">{formErrors.overwhelmedFrequency}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            How comfortable are you in recognizing and understanding your emotions? *
          </label>
          <select 
            name="emotionalAwareness" 
            onChange={handleChange} 
            className={`form-select ${formErrors.emotionalAwareness ? 'error' : ''}`}
            value={formData.emotionalAwareness}
            required
          >
            <option value="">Select</option>
            <option value="Not at all">Not at all</option>
            <option value="Somewhat">Somewhat</option>
            <option value="Very Comfortable">Very Comfortable</option>
          </select>
          {formErrors.emotionalAwareness && <p className="error-text">{formErrors.emotionalAwareness}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            What activities help you manage stress and difficult emotions? *
          </label>
          <textarea 
            name="copingMechanisms" 
            onChange={handleChange} 
            className={`form-textarea ${formErrors.copingMechanisms ? 'error' : ''}`}
            value={formData.copingMechanisms}
            required
          ></textarea>
          {formErrors.copingMechanisms && <p className="error-text">{formErrors.copingMechanisms}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            How often do you use healthy coping mechanisms like mindfulness or exercise? *
          </label>
          <select 
            name="healthyCopingUsage" 
            onChange={handleChange} 
            className={`form-select ${formErrors.healthyCopingUsage ? 'error' : ''}`}
            value={formData.healthyCopingUsage}
            required
          >
            <option value="">Select</option>
            <option value="Never">Never</option>
            <option value="Sometimes">Sometimes</option>
            <option value="Often">Often</option>
            <option value="Always">Always</option>
          </select>
          {formErrors.healthyCopingUsage && <p className="error-text">{formErrors.healthyCopingUsage}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Has your mental health affected your productivity at work/school? *
          </label>
          <select 
            name="productivityImpact" 
            onChange={handleChange} 
            className={`form-select ${formErrors.productivityImpact ? 'error' : ''}`}
            value={formData.productivityImpact}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Sometimes">Sometimes</option>
          </select>
          {formErrors.productivityImpact && <p className="error-text">{formErrors.productivityImpact}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            How connected do you feel to friends and family? *
          </label>
          <select 
            name="socialConnection" 
            onChange={handleChange} 
            className={`form-select ${formErrors.socialConnection ? 'error' : ''}`}
            value={formData.socialConnection}
            required
          >
            <option value="">Select</option>
            <option value="Not at all">Not at all</option>
            <option value="Somewhat">Somewhat</option>
            <option value="Very Connected">Very Connected</option>
          </select>
          {formErrors.socialConnection && <p className="error-text">{formErrors.socialConnection}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            How comfortable are you talking about your mental health with others? *
          </label>
          <select 
            name="talkingComfort" 
            onChange={handleChange} 
            className={`form-select ${formErrors.talkingComfort ? 'error' : ''}`}
            value={formData.talkingComfort}
            required
          >
            <option value="">Select</option>
            <option value="Not at all">Not at all</option>
            <option value="Somewhat">Somewhat</option>
            <option value="Very Comfortable">Very Comfortable</option>
          </select>
          {formErrors.talkingComfort && <p className="error-text">{formErrors.talkingComfort}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Have you ever sought professional help for mental health concerns? *
          </label>
          <select 
            name="professionalHelp" 
            onChange={handleChange} 
            className={`form-select ${formErrors.professionalHelp ? 'error' : ''}`}
            value={formData.professionalHelp}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {formErrors.professionalHelp && <p className="error-text">{formErrors.professionalHelp}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Do you know where to access mental health resources if needed? *
          </label>
          <select 
            name="resourceAccess" 
            onChange={handleChange} 
            className={`form-select ${formErrors.resourceAccess ? 'error' : ''}`}
            value={formData.resourceAccess}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Not sure">Not sure</option>
          </select>
          {formErrors.resourceAccess && <p className="error-text">{formErrors.resourceAccess}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Any additional support or resources you'd like to see provided? *
          </label>
          <textarea 
            name="additionalSupport" 
            onChange={handleChange} 
            className={`form-textarea ${formErrors.additionalSupport ? 'error' : ''}`}
            value={formData.additionalSupport}
            required
          ></textarea>
          {formErrors.additionalSupport && <p className="error-text">{formErrors.additionalSupport}</p>}
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default Feedback;