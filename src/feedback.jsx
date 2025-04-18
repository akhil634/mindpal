import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Mental Health Feedback Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">How would you rate your overall mental health in the past two weeks?</label>
        <select name="mentalHealthRating" onChange={handleChange} className="border p-2 w-full">
          <option value="">Select</option>
          <option value="Poor">Poor</option>
          <option value="Fair">Fair</option>
          <option value="Good">Good</option>
          <option value="Excellent">Excellent</option>
        </select>

        <label className="block">Have you experienced frequent stress, anxiety, or sadness in the last month?</label>
        <select name="stressFrequency" onChange={handleChange} className="border p-2 w-full">
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label className="block">How often do you feel overwhelmed with daily tasks?</label>
        <select name="overwhelmedFrequency" onChange={handleChange} className="border p-2 w-full">
          <option value="">Select</option>
          <option value="Never">Never</option>
          <option value="Sometimes">Sometimes</option>
          <option value="Often">Often</option>
          <option value="Always">Always</option>
        </select>

        <label className="block">How comfortable are you in recognizing and understanding your emotions?</label>
        <select name="emotionalAwareness" onChange={handleChange} className="border p-2 w-full">
          <option value="">Select</option>
          <option value="Not at all">Not at all</option>
          <option value="Somewhat">Somewhat</option>
          <option value="Very Comfortable">Very Comfortable</option>
        </select>

        <label className="block">What activities help you manage stress and difficult emotions?</label>
        <textarea name="copingMechanisms" onChange={handleChange} className="border p-2 w-full"></textarea>

        <label className="block">How often do you use healthy coping mechanisms like mindfulness or exercise?</label>
        <select name="healthyCopingUsage" onChange={handleChange} className="border p-2 w-full">
          <option value="">Select</option>
          <option value="Never">Never</option>
          <option value="Sometimes">Sometimes</option>
          <option value="Often">Often</option>
          <option value="Always">Always</option>
        </select>

        <label className="block">Has your mental health affected your productivity at work/school?</label>
        <select name="productivityImpact" onChange={handleChange} className="border p-2 w-full">
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Sometimes">Sometimes</option>
        </select>

        <label className="block">How connected do you feel to friends and family?</label>
        <select name="socialConnection" onChange={handleChange} className="border p-2 w-full">
          <option value="">Select</option>
          <option value="Not at all">Not at all</option>
          <option value="Somewhat">Somewhat</option>
          <option value="Very Connected">Very Connected</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default Feedback;