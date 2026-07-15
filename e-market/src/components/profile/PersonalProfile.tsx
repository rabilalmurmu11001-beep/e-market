import React, { useState } from "react";
import type { UserProfile } from "./profileTypes";

interface PersonalProfileProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

export const PersonalProfile: React.FC<PersonalProfileProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [profileSuccess, setProfileSuccess] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setProfileSuccess("Your profile details have been saved successfully.");
    setTimeout(() => setProfileSuccess(""), 4000);
  };

  return (
    <div>
      <h3 className="text-xl font-black uppercase tracking-tight mb-6 pb-2 border-b border-neutral-100">
        Personal Profile
      </h3>

      {profileSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 mb-6 rounded-sm text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <i className="fa-solid fa-circle-check"></i> {profileSuccess}
        </div>
      )}

      <form onSubmit={handleProfileSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1.5">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1.5">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1.5">Email Address</label>
            <input
              type="email"
              value={formData.email}
              className="w-full border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-black font-medium bg-neutral-50 cursor-not-allowed"
              disabled
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1.5">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
              required
            />
          </div>
        </div>

        <hr className="border-neutral-100 my-6" />

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Password Modification</h4>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full border border-neutral-300 px-4 py-2 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">New Password</label>
              <input
                type="password"
                className="w-full border border-neutral-300 px-4 py-2 text-sm rounded-sm focus:outline-none focus:border-black font-medium"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-4 px-10 rounded-sm transition-colors cursor-pointer shadow-md mt-6"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};
