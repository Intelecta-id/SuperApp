'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useNotification } from './NotificationContext';

const defaultApiContext = {
  clients: [],
  projects: [],
  tasks: [],
  leads: [],
  invoices: [],
  tickets: [],
  team: [],
  loading: false,
  isLiveApiConnected: false,
  refreshAllData: async () => {},
  addClient: async () => {},
  updateClient: async () => {},
  deleteClient: async () => {},
  addProject: async () => {},
  updateProject: async () => {},
  addTask: async () => {},
  updateTaskStatus: async () => {},
  deleteTask: async () => {},
  addLead: async () => {},
  updateLeadStatus: async () => {},
  convertLeadToProject: async () => {},
  replyInstagram: async () => {},
  addInvoice: async () => {},
  updateInvoiceStatus: async () => {},
  generatePaymentLink: async () => {},
  markInvoicePaid: async () => {},
  addTicket: async () => {},
  updateTicket: async () => {},
  updateTicketStatus: async () => {},
  addTicketReply: async () => {},
  addTeamMember: async () => {},
  updateTeamMember: async () => {},
  syncTeamProfile: async () => {},
};

const ApiContext = createContext(defaultApiContext);

export const useApi = () => {
  const context = useContext(ApiContext);
  return context || defaultApiContext;
};

export const ApiProvider = ({ children }) => {
  const { addToast } = useNotification();

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiveApiConnected, setIsLiveApiConnected] = useState(false);

  // 1. Fetch initial live data from Supabase tables
  const refreshAllData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [
        resClients,
        resProjects,
        resTasks,
        resLeads,
        resInvoices,
        resTickets,
        resTeam
      ] = await Promise.allSettled([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('team_profiles').select('*').order('order_index', { ascending: true }),
      ]);

      let connected = false;

      if (resClients.status === 'fulfilled' && !resClients.value.error) {
        setClients(resClients.value.data || []);
        connected = true;
      }
      if (resProjects.status === 'fulfilled' && !resProjects.value.error) {
        setProjects(resProjects.value.data || []);
        connected = true;
      }
      if (resTasks.status === 'fulfilled' && !resTasks.value.error) {
        setTasks(resTasks.value.data || []);
        connected = true;
      }
      if (resLeads.status === 'fulfilled' && !resLeads.value.error) {
        setLeads(resLeads.value.data || []);
        connected = true;
      }
      if (resInvoices.status === 'fulfilled' && !resInvoices.value.error) {
        setInvoices(resInvoices.value.data || []);
        connected = true;
      }
      if (resTickets.status === 'fulfilled' && !resTickets.value.error) {
        setTickets(resTickets.value.data || []);
        connected = true;
      }
      if (resTeam.status === 'fulfilled' && !resTeam.value.error) {
        setTeam(resTeam.value.data || []);
        connected = true;
      }

      setIsLiveApiConnected(connected);
    } catch (err) {
      console.error('Error fetching live data from Supabase:', err.message);
      setIsLiveApiConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Initial mount & Realtime subscription
  useEffect(() => {
    refreshAllData();

    if (!isSupabaseConfigured || !supabase) return;

    // Realtime channel listener across core tables
    const dbChangesChannel = supabase
      .channel('superapp-live-db')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          supabase.from('tasks').select('*').order('created_at', { ascending: false })
            .then(({ data }) => { if (data) setTasks(data); });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          supabase.from('leads').select('*').order('created_at', { ascending: false })
            .then(({ data }) => { if (data) setLeads(data); });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        () => {
          supabase.from('tickets').select('*').order('created_at', { ascending: false })
            .then(({ data }) => { if (data) setTickets(data); });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients' },
        () => {
          supabase.from('clients').select('*').order('created_at', { ascending: false })
            .then(({ data }) => { if (data) setClients(data); });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          supabase.from('projects').select('*').order('created_at', { ascending: false })
            .then(({ data }) => { if (data) setProjects(data); });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices' },
        () => {
          supabase.from('invoices').select('*').order('created_at', { ascending: false })
            .then(({ data }) => { if (data) setInvoices(data); });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dbChangesChannel);
    };
  }, [refreshAllData]);

  // 3. Client Operations
  const addClient = async (clientData) => {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

      const payload = {
        company_name: clientData.company_name || clientData.name,
        pic_name: clientData.pic_name || clientData.pic || 'PIC',
        email: clientData.email || '',
        phone: clientData.phone || '',
        status: clientData.status || 'active',
        tier: clientData.tier || 'standard',
        contract_value: Number(clientData.contract_value || clientData.total_contract_value || 0),
        notes: clientData.notes || '',
        avatar_url: clientData.avatar_url || '',
      };

      const { data, error } = await supabase.from('clients').insert(payload).select().single();
      if (error) throw error;

      setClients((prev) => [data, ...prev]);
      addToast({ type: 'success', title: 'Klien Tersimpan', message: `${data.company_name} berhasil ditambahkan ke database.` });
      return data;
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Menyimpan Klien', message: err.message });
      throw err;
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

      const { data, error } = await supabase.from('clients').update(clientData).eq('id', id).select().single();
      if (error) throw error;

      setClients((prev) => prev.map((c) => (c.id === id ? data : c)));
      addToast({ type: 'success', title: 'Klien Diperbarui', message: 'Data klien berhasil disimpan.' });
      return data;
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Memperbarui Klien', message: err.message });
      throw err;
    }
  };

  const deleteClient = async (id) => {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;

      setClients((prev) => prev.filter((c) => c.id !== id));
      addToast({ type: 'success', title: 'Klien Dihapus', message: 'Data klien telah dihapus dari database.' });
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Menghapus Klien', message: err.message });
      throw err;
    }
  };

  // 4. Project Operations
  const addProject = async (projectData) => {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

      const slug = projectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
      const payload = {
        name: projectData.name,
        slug,
        client_id: projectData.client_id || null,
        service_type: projectData.service_type || 'web_dev',
        status: projectData.status || 'in_progress',
        progress: Number(projectData.progress || 0),
        budget: Number(projectData.budget || 0),
        start_date: projectData.start_date || new Date().toISOString().split('T')[0],
        deadline: projectData.deadline || null,
        description: projectData.description || '',
        repository_url: projectData.repository_url || '',
        live_url: projectData.live_url || '',
      };

      const { data, error } = await supabase.from('projects').insert(payload).select().single();
      if (error) throw error;

      setProjects((prev) => [data, ...prev]);
      addToast({ type: 'success', title: 'Proyek Dibuat', message: `${data.name} berhasil disimpan di database.` });
      return data;
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Membuat Proyek', message: err.message });
      throw err;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

      const { data, error } = await supabase.from('projects').update(projectData).eq('id', id).select().single();
      if (error) throw error;

      setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
      addToast({ type: 'success', title: 'Proyek Diperbarui', message: 'Data proyek berhasil diperbarui.' });
      return data;
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Memperbarui Proyek', message: err.message });
      throw err;
    }
  };

  // 5. Task Operations (Kanban Engine)
  const addTask = async (taskData) => {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

      const payload = {
        project_id: taskData.project_id || (projects[0]?.id || null),
        sprint_id: taskData.sprint_id || null,
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        points: Number(taskData.points || 1),
        due_date: taskData.due_date || null,
      };

      const { data, error } = await supabase.from('tasks').insert(payload).select().single();
      if (error) throw error;

      setTasks((prev) => [data, ...prev]);
      addToast({ type: 'success', title: 'Task Ditambahkan', message: `Task "${data.title}" berhasil dibuat.` });
      return data;
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Membuat Task', message: err.message });
      throw err;
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));

      if (!isSupabaseConfigured || !supabase) return;

      const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to update task status:', err.message);
      refreshAllData();
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (!isSupabaseConfigured || !supabase) return;
      await supabase.from('tasks').delete().eq('id', taskId);
      addToast({ type: 'success', title: 'Task Dihapus', message: 'Task berhasil dihapus dari database.' });
    } catch (err) {
      console.error('Failed to delete task:', err.message);
    }
  };

  // 6. Lead Operations (Omnichannel)
  const addLead = async (leadData) => {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

      const payload = {
        name: leadData.name,
        email: leadData.email || '',
        phone: leadData.phone || '',
        company: leadData.company || '',
        source: leadData.source || 'manual',
        status: leadData.status || 'new',
        estimated_value: Number(leadData.estimated_value || 0),
        message: leadData.message || '',
      };

      const { data, error } = await supabase.from('leads').insert(payload).select().single();
      if (error) throw error;

      setLeads((prev) => [data, ...prev]);
      addToast({ type: 'success', title: 'Lead Ditambahkan', message: `Lead dari ${data.name} berhasil disimpan.` });
      return data;
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Menyimpan Lead', message: err.message });
      throw err;
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      if (!isSupabaseConfigured || !supabase) return;
      await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
      addToast({ type: 'success', title: 'Status Diperbarui', message: `Status lead diubah ke ${newStatus}.` });
    } catch (err) {
      console.error('Failed to update lead status:', err.message);
    }
  };

  // 7. Invoice Operations
  const addInvoice = async (invoiceData) => {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

      const invoiceNum = invoiceData.invoice_number || `INV/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`;
      const payload = {
        invoice_number: invoiceNum,
        client_id: invoiceData.client_id || (clients[0]?.id || null),
        project_id: invoiceData.project_id || (projects[0]?.id || null),
        amount: Number(invoiceData.amount || 0),
        status: invoiceData.status || 'draft',
        issue_date: invoiceData.issue_date || new Date().toISOString().split('T')[0],
        due_date: invoiceData.due_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        items: invoiceData.items || [{ description: 'Jasa Pengembangan Sistem', amount: Number(invoiceData.amount || 0) }],
      };

      const { data, error } = await supabase.from('invoices').insert(payload).select().single();
      if (error) throw error;

      setInvoices((prev) => [data, ...prev]);
      addToast({ type: 'success', title: 'Invoice Diterbitkan', message: `Invoice #${data.invoice_number} berhasil dibuat.` });
      return data;
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Membuat Invoice', message: err.message });
      throw err;
    }
  };

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      setInvoices((prev) => prev.map((i) => (i.id === invoiceId ? { ...i, status: newStatus } : i)));
      if (!isSupabaseConfigured || !supabase) return;
      await supabase.from('invoices').update({ status: newStatus }).eq('id', invoiceId);
      addToast({ type: 'success', title: 'Invoice Diperbarui', message: `Status invoice diubah ke ${newStatus}.` });
    } catch (err) {
      console.error('Failed to update invoice status:', err.message);
    }
  };

  // 8. Ticket Operations (Helpdesk SLA)
  const addTicket = async (ticketData) => {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

      const ticketNum = `TCK-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
      const payload = {
        ticket_number: ticketNum,
        client_id: ticketData.client_id || (clients[0]?.id || null),
        project_id: ticketData.project_id || (projects[0]?.id || null),
        title: ticketData.title,
        description: ticketData.description || '',
        status: ticketData.status || 'open',
        priority: ticketData.priority || 'medium',
        sla_hours: ticketData.priority === 'critical' ? 4 : ticketData.priority === 'high' ? 12 : 24,
      };

      const { data, error } = await supabase.from('tickets').insert(payload).select().single();
      if (error) throw error;

      setTickets((prev) => [data, ...prev]);
      addToast({ type: 'success', title: 'Tiket Insiden Dibuat', message: `Tiket #${data.ticket_number} berhasil diregistrasi.` });
      return data;
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Membuat Tiket', message: err.message });
      throw err;
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)));
      if (!isSupabaseConfigured || !supabase) return;
      await supabase.from('tickets').update({ status: newStatus }).eq('id', ticketId);
      addToast({ type: 'success', title: 'Tiket Diperbarui', message: `Status tiket diubah ke ${newStatus}.` });
    } catch (err) {
      console.error('Failed to update ticket status:', err.message);
    }
  };

  // 9. Team Profile Operations
  const addTeamMember = async (memberData) => {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

      const slug = memberData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        name: memberData.name,
        slug,
        role: memberData.role || 'Software Engineer',
        bio: memberData.bio || '',
        skills: memberData.skills || [],
        github_url: memberData.github_url || '',
        linkedin_url: memberData.linkedin_url || '',
        avatar_url: memberData.avatar_url || '',
        is_public: true,
        order_index: team.length + 1,
      };

      const { data, error } = await supabase.from('team_profiles').insert(payload).select().single();
      if (error) throw error;

      setTeam((prev) => [...prev, data]);
      addToast({ type: 'success', title: 'Talent Ditambahkan', message: `${data.name} berhasil disimpan ke database.` });
      return data;
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Menambah Talent', message: err.message });
      throw err;
    }
  };

  const updateTeamMember = async (id, updateData) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('team_profiles').update(updateData).eq('id', id);
        if (error) throw error;
      }
      setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, ...updateData } : m)));
      addToast({ type: 'success', title: 'Talent Diperbarui', message: 'Data talent berhasil diperbarui.' });
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Memperbarui Talent', message: err.message });
      throw err;
    }
  };

  const syncTeamProfile = async (profileData) => {
    try {
      const id = profileData.id || profileData.user_id;
      const payload = {
        name: profileData.name,
        slug: profileData.slug,
        role: profileData.role || profileData.job_title || 'Engineer',
        bio: profileData.bio || profileData.bio_id || '',
        skills: profileData.skills || profileData.skills_json || [],
        github_url: profileData.github_url || profileData.github || '',
        linkedin_url: profileData.linkedin_url || profileData.linkedin || '',
        is_public: profileData.is_public ?? profileData.is_public_showcase ?? true,
        updated_at: new Date().toISOString(),
      };
      if (isSupabaseConfigured && supabase) {
        if (id) {
          const { error } = await supabase.from('team_profiles').upsert({ id, ...payload });
          if (error) {
            console.warn('Upsert fallback to update:', error.message);
            await supabase.from('team_profiles').update(payload).eq('id', id);
          }
        } else {
          await supabase.from('team_profiles').insert([payload]);
        }
      }
      setTeam((prev) => prev.map((m) => ((m.id === id || m.slug === profileData.slug) ? { ...m, ...payload, team_profile: { ...m.team_profile, ...payload } } : m)));
      addToast({ type: 'success', title: 'Talent Disinkronkan', message: 'Profil talent berhasil disimpan ke database.' });
      return payload;
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Sinkronisasi Talent', message: err.message });
      throw err;
    }
  };

  const convertLeadToProject = async (leadId, convertForm) => {
    try {
      const newClient = await addClient({
        company_name: convertForm.company_name,
        pic_name: convertForm.pic_name,
        email: convertForm.pic_email,
        status: 'active',
        tier: 'standard',
      });
      const projectCode = `PRJ-${Date.now().toString().slice(-4)}`;
      await addProject({
        client_id: newClient.id,
        project_code: projectCode,
        title: convertForm.project_title,
        category: convertForm.category,
        contract_value: convertForm.contract_value,
        status: 'scoping',
      });
      await updateLeadStatus(leadId, 'converted_to_project');
      addToast({ type: 'success', title: 'Konversi Berhasil', message: 'Lead berhasil dikonversi ke Klien & Proyek baru.' });
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Konversi Lead', message: err.message });
    }
  };

  const replyInstagram = async (leadId, message) => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('leads').update({ notes: message, updated_at: new Date().toISOString() }).eq('id', leadId);
      }
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, notes: message } : l)));
      addToast({ type: 'success', title: 'Balasan Terkirim', message: 'Pesan balasan berhasil dicatat.' });
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Mengirim Balasan', message: err.message });
    }
  };

  const updateTicket = async (ticketId, updateData) => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('tickets').update(updateData).eq('id', ticketId);
      }
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, ...updateData } : t)));
      addToast({ type: 'success', title: 'Tiket Diperbarui', message: 'Perubahan tiket berhasil disimpan.' });
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Memperbarui Tiket', message: err.message });
    }
  };

  const addTicketReply = async (ticketId, message, isInternal = false) => {
    try {
      const newReply = {
        id: 'rep-' + Date.now(),
        ticket_id: ticketId,
        message,
        is_internal: isInternal,
        created_at: new Date().toISOString(),
        user: { name: 'Operator' },
      };
      if (isSupabaseConfigured && supabase) {
        await supabase.from('ticket_replies').insert({
          ticket_id: ticketId,
          message,
          is_internal: isInternal,
        });
      }
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, replies: [...(t.replies || []), newReply] } : t
        )
      );
      addToast({ type: 'success', title: 'Catatan Ditambahkan', message: 'Log investigasi berhasil disimpan.' });
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Menambah Catatan', message: err.message });
    }
  };

  const generatePaymentLink = async (invoiceId) => {
    const snapUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/demo-${invoiceId}`;
    if (isSupabaseConfigured && supabase) {
      await supabase.from('invoices').update({ midtrans_snap_token: `token-${invoiceId}` }).eq('id', invoiceId);
    }
    addToast({ type: 'info', title: 'Link Pembayaran Dibuat', message: 'Link gateway sandbox siap dibagikan.' });
    return snapUrl;
  };

  const markInvoicePaid = async (invoiceId) => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('invoices').update({ payment_status: 'paid', updated_at: new Date().toISOString() }).eq('id', invoiceId);
      }
      setInvoices((prev) =>
        prev.map((i) => (i.id === invoiceId ? { ...i, payment_status: 'paid' } : i))
      );
      addToast({ type: 'success', title: 'Invoice Lunas', message: 'Pembayaran invoice berhasil diverifikasi.' });
    } catch (err) {
      addToast({ type: 'error', title: 'Gagal Memperbarui Status Invoice', message: err.message });
    }
  };

  return (
    <ApiContext.Provider
      value={{
        clients,
        projects,
        tasks,
        leads,
        invoices,
        tickets,
        team,
        loading,
        isLiveApiConnected,
        refreshAllData,
        addClient,
        updateClient,
        deleteClient,
        addProject,
        updateProject,
        addTask,
        updateTaskStatus,
        deleteTask,
        addLead,
        updateLeadStatus,
        convertLeadToProject,
        replyInstagram,
        addInvoice,
        updateInvoiceStatus,
        generatePaymentLink,
        markInvoicePaid,
        addTicket,
        updateTicket,
        updateTicketStatus,
        addTicketReply,
        addTeamMember,
        updateTeamMember,
        syncTeamProfile,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

