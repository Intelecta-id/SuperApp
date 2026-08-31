import React, { useState } from 'react';
import {
  Users2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Eye,
  Layers,
  Edit3,
  Award,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/BrandIcons';
import { useApi } from '../contexts/ApiContext';

export const TeamPage = () => {
  const { team, syncTeamProfile } = useApi();
  const [selectedUserId, setSelectedUserId] = useState(team[0]?.id || 1);
  const [isSyncing, setIsSyncing] = useState(false);

  const selectedMember = team.find((t) => t.id === selectedUserId) || team[0];

  // Editor Form State
  const [profileForm, setProfileForm] = useState({
    user_id: selectedMember?.id || 1,
    slug: selectedMember?.team_profile?.slug || 'engineer-slug',
    job_title: selectedMember?.team_profile?.job_title || 'Senior Engineer',
    tagline: selectedMember?.team_profile?.tagline || '',
    bio_id: selectedMember?.team_profile?.bio_id || '',
    skills_input: selectedMember?.team_profile?.skills_json?.join(', ') || 'React, Laravel, TypeScript',
    github: selectedMember?.team_profile?.social_links_json?.github || '',
    linkedin: selectedMember?.team_profile?.social_links_json?.linkedin || '',
    is_public_showcase: selectedMember?.team_profile?.is_public_showcase ?? true,
  });

  const handleSelectMember = (member) => {
    setSelectedUserId(member.id);
    setProfileForm({
      user_id: member.id,
      slug: member.team_profile?.slug || 'engineer-slug',
      job_title: member.team_profile?.job_title || 'Senior Engineer',
      tagline: member.team_profile?.tagline || '',
      bio_id: member.team_profile?.bio_id || '',
      skills_input: member.team_profile?.skills_json?.join(', ') || 'React, Laravel, TypeScript',
      github: member.team_profile?.social_links_json?.github || '',
      linkedin: member.team_profile?.social_links_json?.linkedin || '',
      is_public_showcase: member.team_profile?.is_public_showcase ?? true,
    });
  };

  const handleSyncSubmit = async (e) => {
    e.preventDefault();
    setIsSyncing(true);

    const skillsArray = profileForm.skills_input
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await syncTeamProfile({
      user_id: selectedMember.id,
      slug: profileForm.slug,
      job_title: profileForm.job_title,
      tagline: profileForm.tagline,
      bio_id: profileForm.bio_id,
      skills_json: skillsArray,
      social_links_json: {
        github: profileForm.github,
        linkedin: profileForm.linkedin,
      },
      is_public_showcase: profileForm.is_public_showcase,
    });

    setIsSyncing(false);
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">TALENT RESOURCE & ISR SYNC</span>
            <span className="text-xs font-mono text-zinc-400">• Next.js 15 Corporate Web Integration</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Talent Manager & Showcase Sync
          </h1>
          <p className="text-xs text-zinc-400">
            Kelola profil engineer, kapasitas workload sprint, dan sinkronisasi otomatis ke halaman publik <code className="text-zinc-200">/tim/[slug]</code> di Corporate Web.
          </p>
        </div>
      </div>

      {/* Talent Capacity Matrix & Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {team.map((member) => {
          const isSelected = member.id === selectedMember?.id;
          return (
            <div
              key={member.id}
              onClick={() => handleSelectMember(member)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-zinc-800/90 border-white/20 shadow-md ring-1 ring-white/10'
                  : 'bg-[#0D0D11] border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-white truncate">{member.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-xs text-zinc-400 truncate">{member.team_profile?.job_title || 'Engineer'}</div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-0.5">/tim/{member.team_profile?.slug}</div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1">
                {member.team_profile?.skills_json?.slice(0, 4).map((skill, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14141B] text-zinc-300">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">{member.active_tasks_count || 1} Task Aktif</span>
                <span className="text-emerald-400">Available</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Editor & Corporate Web Live Preview Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: WYSIWYG Form Editor */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-zinc-400" />
              <h2 className="font-heading font-bold text-base text-white">
                Edit Profil Publik: {selectedMember?.name}
              </h2>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
              Sync Endpoint: /api/v1/team/sync-public-profile
            </span>
          </div>

          <form onSubmit={handleSyncSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 block mb-1">Job Title (Corporate Web) *</label>
                <input
                  type="text"
                  required
                  value={profileForm.job_title}
                  onChange={(e) => setProfileForm({ ...profileForm, job_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">URL Slug (/tim/[slug]) *</label>
                <input
                  type="text"
                  required
                  value={profileForm.slug}
                  onChange={(e) => setProfileForm({ ...profileForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Tagline Singkat</label>
              <input
                type="text"
                value={profileForm.tagline}
                onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                placeholder="Architecting resilient SaaS & high-load distributed systems."
                className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Biografi Profesional (Bahasa Indonesia)</label>
              <textarea
                rows={4}
                value={profileForm.bio_id}
                onChange={(e) => setProfileForm({ ...profileForm, bio_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Keahlian & Stack Teknologi (Pisahkan dengan koma)</label>
              <input
                type="text"
                value={profileForm.skills_input}
                onChange={(e) => setProfileForm({ ...profileForm, skills_input: e.target.value })}
                placeholder="React 19, Laravel 11, Next.js, Flutter, Docker"
                className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono text-[11px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 block mb-1">GitHub Profile URL</label>
                <input
                  type="text"
                  value={profileForm.github}
                  onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={profileForm.linkedin}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileForm.is_public_showcase}
                  onChange={(e) => setProfileForm({ ...profileForm, is_public_showcase: e.target.checked })}
                  className="rounded bg-[#14141B] border-white/20"
                />
                <span className="text-zinc-300">Tampilkan di Showcase Publik Corporate Web</span>
              </label>

              <button
                type="submit"
                disabled={isSyncing}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold shadow-md flex items-center gap-2 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Memicu ISR Revalidation...' : 'Sync & Revalidate Next.js'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 5 Cols: Visual Live Preview on Corporate Web */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 font-mono">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Live Preview (/tim/{profileForm.slug})</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Next.js 15 Ready</span>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#14141B] to-[#0D0D11] border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <img
                src={selectedMember?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={selectedMember?.name}
                className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-lg text-white">{selectedMember?.name}</h3>
                  <span className="p-1 rounded-full bg-blue-500/20 text-blue-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-xs text-zinc-300 font-medium">{profileForm.job_title}</div>
                <div className="text-[11px] text-zinc-400 italic mt-1 font-serif">
                  "{profileForm.tagline || 'Engineering Digital Excellence'}"
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans border-t border-white/5 pt-3">
              {profileForm.bio_id || 'Biografi engineer akan tampil di sini.'}
            </p>

            {/* Skills */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Core Capabilities</div>
              <div className="flex flex-wrap gap-1.5">
                {profileForm.skills_input
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-200">
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2 text-zinc-400">
              {profileForm.github && (
                <span className="flex items-center gap-1 text-[11px] font-mono">
                  <GithubIcon className="w-3.5 h-3.5" /> github
                </span>
              )}
              {profileForm.linkedin && (
                <span className="flex items-center gap-1 text-[11px] font-mono">
                  <LinkedinIcon className="w-3.5 h-3.5" /> linkedin
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
