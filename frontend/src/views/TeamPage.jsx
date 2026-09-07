'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Eye,
  Edit3,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/BrandIcons';
import { useApi } from '../contexts/ApiContext';

export const TeamPage = () => {
  const { team, syncTeamProfile } = useApi();
  const [selectedUserId, setSelectedUserId] = useState(team[0]?.id || null);
  const [isSyncing, setIsSyncing] = useState(false);

  const activeTeam = team || [];
  const selectedMember = activeTeam.find((t) => t.id === selectedUserId) || activeTeam[0] || null;

  // Editor Form State
  const [profileForm, setProfileForm] = useState({
    user_id: selectedMember?.id || '',
    slug: selectedMember?.team_profile?.slug || selectedMember?.slug || 'lead-dev',
    job_title: selectedMember?.team_profile?.role || selectedMember?.role || 'Lead Engineer',
    bio: selectedMember?.team_profile?.bio || selectedMember?.bio || '',
    skills_input: (Array.isArray(selectedMember?.team_profile?.skills) ? selectedMember.team_profile.skills : ['React', 'Next.js', 'PostgreSQL']).join(', '),
    github_url: selectedMember?.team_profile?.github_url || '',
    linkedin_url: selectedMember?.team_profile?.linkedin_url || '',
    is_public: selectedMember?.team_profile?.is_public ?? true,
  });

  const handleSelectMember = (member) => {
    setSelectedUserId(member.id);
    const tp = member.team_profile || member;
    setProfileForm({
      user_id: member.id,
      slug: tp.slug || 'engineer-slug',
      job_title: tp.role || member.role || 'Senior Engineer',
      bio: tp.bio || '',
      skills_input: Array.isArray(tp.skills) ? tp.skills.join(', ') : 'Next.js 15, Supabase, TypeScript',
      github_url: tp.github_url || '',
      linkedin_url: tp.linkedin_url || '',
      is_public: tp.is_public ?? true,
    });
  };

  const handleSyncSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    setIsSyncing(true);

    try {
      const skillsArray = profileForm.skills_input
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (typeof syncTeamProfile === 'function') {
        await syncTeamProfile({
          id: selectedMember.team_profile?.id || selectedMember.id,
          name: selectedMember.name,
          slug: profileForm.slug,
          role: profileForm.job_title,
          bio: profileForm.bio,
          skills: skillsArray,
          github_url: profileForm.github_url,
          linkedin_url: profileForm.linkedin_url,
          is_public: profileForm.is_public,
        });
      }
    } catch (err) {
      console.error('Gagal sinkronisasi talent:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 text-lightgray-100 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-700 pb-5">
        <div>
          <h1 className="font-heading font-bold text-xl text-lightgray-100 tracking-tight">
            Tim & Talent
          </h1>
          <p className="text-xs text-coal-400 mt-0.5">
            Kelola profil engineer dan sinkronisasi publik showcase ke Corporate Web.
          </p>
        </div>
      </div>

      {/* Talent Matrix & Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {activeTeam.map((member) => {
          const isSelected = member.id === selectedMember?.id;
          const tp = member.team_profile || member;
          const skills = Array.isArray(tp.skills) ? tp.skills : ['Fullstack', 'DevOps'];

          return (
            <div
              key={member.id}
              onClick={() => handleSelectMember(member)}
              className={`p-5 rounded-none border transition-colors cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-coal-800 border-coal-500 shadow-sm'
                  : 'bg-coal-850 border-coal-700 hover:border-coal-600 text-coal-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={member.name}
                  className="w-12 h-12 rounded-none object-cover border border-coal-600 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-lightgray-100 truncate">{member.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-lightgray-300 shrink-0" />
                  </div>
                  <div className="text-xs text-coal-400 truncate">{tp.role || member.role || 'Engineer'}</div>
                  <div className="text-[11px] font-mono text-coal-400 mt-0.5">/tim/{tp.slug || 'member'}</div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 4).map((skill, i) => (
                  <span key={i} className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-300">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-coal-800 flex items-center justify-between text-xs font-mono">
                <span className="text-coal-400">PostgreSQL Synced</span>
                <span className="text-lightgray-300">Live</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Editor & Corporate Web Live Preview Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: WYSIWYG Form Editor */}
        <div className="lg:col-span-7 p-6 rounded-none bg-coal-850 border border-coal-700 space-y-5">
          <div className="flex items-center justify-between border-b border-coal-700 pb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-coal-400" />
              <h2 className="font-heading font-bold text-base text-lightgray-100">
                Edit Profil Publik: {selectedMember?.name}
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-none bg-coal-800 border border-coal-600 text-lightgray-300">
              Supabase team_profiles
            </span>
          </div>

          <form onSubmit={handleSyncSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-coal-400 block mb-1">Job Title / Role *</label>
                <input
                  type="text"
                  required
                  value={profileForm.job_title}
                  onChange={(e) => setProfileForm({ ...profileForm, job_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-100 outline-none"
                />
              </div>
              <div>
                <label className="text-coal-400 block mb-1">URL Slug (/tim/[slug]) *</label>
                <input
                  type="text"
                  required
                  value={profileForm.slug}
                  onChange={(e) => setProfileForm({ ...profileForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-100 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-coal-400 block mb-1">Biografi Profesional</label>
              <textarea
                rows={4}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-100 outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="text-coal-400 block mb-1">Keahlian & Stack Teknologi (Pisahkan koma)</label>
              <input
                type="text"
                value={profileForm.skills_input}
                onChange={(e) => setProfileForm({ ...profileForm, skills_input: e.target.value })}
                placeholder="Next.js 15, Flutter, PostgreSQL, TypeScript"
                className="w-full px-3 py-2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-100 outline-none font-mono text-[11px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-coal-400 block mb-1">GitHub Profile URL</label>
                <input
                  type="text"
                  value={profileForm.github_url}
                  onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-100 outline-none font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="text-coal-400 block mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={profileForm.linkedin_url}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-100 outline-none font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-coal-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileForm.is_public}
                  onChange={(e) => setProfileForm({ ...profileForm, is_public: e.target.checked })}
                  className="rounded-none bg-coal-900 border-coal-700"
                />
                <span className="text-coal-300">Tampilkan di Halaman Publik Corporate Web (/tim)</span>
              </label>

              <button
                type="submit"
                disabled={isSyncing}
                className="px-5 py-2.5 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 font-semibold shadow-sm flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sinkronisasi...' : 'Simpan ke Supabase'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 5 Cols: Visual Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-coal-400">
            <div className="flex items-center gap-1.5 font-mono">
              <Eye className="w-3.5 h-3.5 text-lightgray-300" />
              <span>Live Preview (/tim/{profileForm.slug})</span>
            </div>
            <span className="text-[10px] font-mono text-lightgray-300">Supabase Table Sync</span>
          </div>

          <div className="p-6 rounded-none bg-coal-850 border border-coal-700 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <img
                src={selectedMember?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={selectedMember?.name}
                className="w-16 h-16 rounded-none object-cover border border-coal-600"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-lg text-lightgray-100">{selectedMember?.name}</h3>
                  <span className="p-0.5 rounded-none bg-coal-800 border border-coal-600 text-lightgray-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-xs text-lightgray-300 font-medium">{profileForm.job_title}</div>
              </div>
            </div>

            <p className="text-xs text-coal-300 leading-relaxed font-sans border-t border-coal-800 pt-3">
              {profileForm.bio || 'Biografi engineer akan tampil di sini.'}
            </p>

            {/* Skills */}
            <div className="space-y-1.5 pt-2 border-t border-coal-800">
              <div className="text-[10px] font-mono uppercase text-coal-400">Core Capabilities</div>
              <div className="flex flex-wrap gap-1.5">
                {profileForm.skills_input
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-none bg-coal-900 border border-coal-700 text-[10px] font-mono text-lightgray-300">
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2 text-coal-400">
              {profileForm.github_url && (
                <span className="flex items-center gap-1 text-[11px] font-mono">
                  <GithubIcon className="w-3.5 h-3.5 text-lightgray-400" /> github
                </span>
              )}
              {profileForm.linkedin_url && (
                <span className="flex items-center gap-1 text-[11px] font-mono">
                  <LinkedinIcon className="w-3.5 h-3.5 text-lightgray-400" /> linkedin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
