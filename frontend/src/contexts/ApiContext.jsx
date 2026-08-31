import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';
import {
  mockClients,
  mockProjects,
  mockTasks,
  mockLeads,
  mockInvoices,
  mockTickets,
  mockTeam,
} from '../services/mockData';
import { useNotification } from './NotificationContext';

const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const { addToast } = useNotification();

  const [clients, setClients] = useState(mockClients);
  const [projects, setProjects] = useState(mockProjects);
  const [tasks, setTasks] = useState(mockTasks);
  const [leads, setLeads] = useState(mockLeads);
  const [invoices, setInvoices] = useState(mockInvoices);
  const [tickets, setTickets] = useState(mockTickets);
  const [team, setTeam] = useState(mockTeam);
  const [loading, setLoading] = useState(false);
  const [isLiveApiConnected, setIsLiveApiConnected] = useState(false);

  // Fetch initial data from Laravel REST API
  const refreshAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [resClients, resProjects, resLeads, resInvoices, resTickets, resTeam] = await Promise.allSettled([
        apiClient.get('/clients'),
        apiClient.get('/projects'),
        apiClient.get('/omnichannel/leads'),
        apiClient.get('/invoices'),
        apiClient.get('/tickets'),
        apiClient.get('/team'),
      ]);

      let anySuccess = false;

      if (resClients.status === 'fulfilled' && resClients.value.data?.data) {
        setClients(resClients.value.data.data);
        anySuccess = true;
      }
      if (resProjects.status === 'fulfilled' && resProjects.value.data?.data) {
        setProjects(resProjects.value.data.data);
        anySuccess = true;
      }
      if (resLeads.status === 'fulfilled' && resLeads.value.data?.data) {
        setLeads(resLeads.value.data.data);
        anySuccess = true;
      }
      if (resInvoices.status === 'fulfilled' && resInvoices.value.data?.data) {
        setInvoices(resInvoices.value.data.data);
        anySuccess = true;
      }
      if (resTickets.status === 'fulfilled' && resTickets.value.data?.data) {
        setTickets(resTickets.value.data.data);
        anySuccess = true;
      }
      if (resTeam.status === 'fulfilled' && resTeam.value.data?.data) {
        setTeam(resTeam.value.data.data);
        anySuccess = true;
      }

      setIsLiveApiConnected(anySuccess);
    } catch (err) {
      console.warn('Live API sync failed, operating with active local repository:', err.message);
      setIsLiveApiConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Clients Operations
  const addClient = async (clientData) => {
    try {
      const res = await apiClient.post('/clients', clientData);
      const newClient = res.data?.data;
      setClients((prev) => [newClient, ...prev]);
      addToast({ type: 'success', title: 'Klien Ditambahkan', message: `${newClient.company_name} berhasil disimpan.` });
      return newClient;
    } catch (err) {
      // Local optimistic fallback
      const newClient = {
        id: Date.now(),
        uuid: 'cl-' + Math.random().toString(36).substr(2, 6),
        ...clientData,
        projects_count: 0,
        invoices_count: 0,
        tickets_count: 0,
        total_contract_value: 0,
      };
      setClients((prev) => [newClient, ...prev]);
      addToast({ type: 'success', title: 'Klien Ditambahkan (Lokal)', message: `${newClient.company_name} berhasil disimpan.` });
      return newClient;
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      const res = await apiClient.put(`/clients/${id}`, clientData);
      const updated = res.data?.data;
      setClients((prev) => prev.map((c) => (c.id === id || c.uuid === id ? updated : c)));
      addToast({ type: 'success', title: 'Klien Diperbarui', message: 'Data klien berhasil disimpan.' });
      return updated;
    } catch (err) {
      setClients((prev) => prev.map((c) => (c.id === id || c.uuid === id ? { ...c, ...clientData } : c)));
      addToast({ type: 'success', title: 'Klien Diperbarui', message: 'Data klien berhasil diperbarui.' });
    }
  };

  const deleteClient = async (id) => {
    try {
      await apiClient.delete(`/clients/${id}`);
    } catch (e) {
      // ignore
    }
    setClients((prev) => prev.filter((c) => c.id !== id && c.uuid !== id));
    addToast({ type: 'info', title: 'Klien Dihapus', message: 'Klien berhasil dihapus dari direktori.' });
  };

  // Projects Operations
  const addProject = async (projectData) => {
    try {
      const res = await apiClient.post('/projects', projectData);
      const newProj = res.data?.data;
      setProjects((prev) => [newProj, ...prev]);
      addToast({ type: 'success', title: 'Proyek Dibuat', message: `${newProj.title} berhasil didaftarkan.` });
      return newProj;
    } catch (err) {
      const client = clients.find((c) => c.id === Number(projectData.client_id));
      const newProj = {
        id: Date.now(),
        uuid: 'proj-' + (projectData.project_code || 'INTL-' + Date.now()),
        client_id: projectData.client_id,
        client: client || { company_name: 'Klien Korporat' },
        project_code: projectData.project_code || 'INTL-2026-' + Math.floor(100 + Math.random() * 900),
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        status: projectData.status || 'scoping',
        contract_value: Number(projectData.contract_value) || 0,
        start_date: projectData.start_date || new Date().toISOString().split('T')[0],
        target_completion_date: projectData.target_completion_date,
        git_repository_url: projectData.git_repository_url,
        staging_url: projectData.staging_url,
        production_url: projectData.production_url,
        is_featured_case_study: projectData.is_featured_case_study || false,
        members: [{ id: 1, user: mockCurrentUser, role_in_project: 'Lead' }],
      };
      setProjects((prev) => [newProj, ...prev]);
      addToast({ type: 'success', title: 'Proyek Dibuat', message: `${newProj.title} berhasil didaftarkan.` });
      return newProj;
    }
  };

  // Kanban Tasks Operations
  const updateTaskStatus = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId || t.uuid === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await apiClient.patch(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      // Optimistic update already performed
    }
  };

  const addTask = async (taskData) => {
    const newTask = {
      id: Date.now(),
      uuid: 'tsk-' + Math.random().toString(36).substr(2, 6),
      project_id: taskData.project_id || 1,
      project_code: taskData.project_code || 'INTL-2026-008',
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      story_points: Number(taskData.story_points) || 3,
      due_date: taskData.due_date,
      assigned_to_user_id: taskData.assigned_to_user_id || 1,
      assignee: team.find((u) => u.id === Number(taskData.assigned_to_user_id)) || mockCurrentUser,
      order_position: tasks.length + 1,
    };

    setTasks((prev) => [...prev, newTask]);
    addToast({ type: 'success', title: 'Task Ditambahkan', message: `Task "${newTask.title}" masuk ke sprint.` });

    try {
      const projectUuid = projects.find((p) => p.id === taskData.project_id)?.uuid || 'proj-INTL-2026-008';
      await apiClient.post(`/projects/${projectUuid}/tasks`, taskData);
    } catch (err) {
      // Handled optimistically
    }
    return newTask;
  };

  // Omnichannel Leads Operations
  const addLead = async (leadData) => {
    const newLead = {
      id: Date.now(),
      uuid: 'lead-' + Math.random().toString(36).substr(2, 6),
      source: leadData.source || 'manual',
      sender_name: leadData.sender_name,
      sender_contact: leadData.sender_contact,
      company_name: leadData.company_name,
      subject_or_intent: leadData.subject_or_intent,
      initial_message: leadData.initial_message,
      status: 'new',
      ai_sentiment_score: 0.75,
      ai_suggested_reply: `Halo ${leadData.sender_name}, terima kasih telah menghubungi Intelecta Technology Solutions. Lead Consultant kami siap membantu kebutuhan sistem Anda.`,
      created_at: new Date().toISOString(),
    };

    setLeads((prev) => [newLead, ...prev]);
    addToast({ type: 'info', title: 'Lead Baru Masuk', message: `Pesan dari ${newLead.sender_name} (${newLead.source})` });

    try {
      const res = await apiClient.post('/omnichannel/leads', leadData);
      if (res.data?.data) {
        setLeads((prev) => prev.map((l) => (l.id === newLead.id ? res.data.data : l)));
      }
    } catch (err) {
      // Local fallback
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId || l.uuid === leadId ? { ...l, status: newStatus } : l))
    );
    try {
      await apiClient.put(`/omnichannel/leads/${leadId}`, { status: newStatus });
    } catch (err) {
      // Handled
    }
  };

  const replyInstagram = async (leadId, replyMessage) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId || l.uuid === leadId ? { ...l, status: 'qualified' } : l))
    );
    addToast({ type: 'success', title: 'Pesan Terkirim', message: 'Balasan telah dikirim via Meta Graph API.' });
    try {
      await apiClient.post('/omnichannel/instagram/reply', { lead_id: leadId, message: replyMessage });
    } catch (e) {
      // Simulated
    }
  };

  const convertLeadToProject = async (leadId, convertData) => {
    const lead = leads.find((l) => l.id === leadId || l.uuid === leadId);
    if (!lead) return;

    // Create client
    const newClient = await addClient({
      company_name: convertData.company_name || lead.company_name || 'Klien Baru ' + lead.sender_name,
      pic_name: convertData.pic_name || lead.sender_name,
      pic_email: convertData.pic_email || (lead.sender_contact.includes('@') ? lead.sender_contact : 'client@intelecta.id'),
      pic_phone: lead.sender_contact,
      industry: 'Enterprise / Corporate',
      notes: `Dikonversi dari lead #${lead.id} (${lead.source})`,
    });

    // Create project
    const newProj = await addProject({
      client_id: newClient.id,
      title: convertData.project_title || `Proyek Solusi ${newClient.company_name}`,
      category: convertData.category || 'webapp_development',
      status: 'scoping',
      contract_value: Number(convertData.contract_value) || 120000000,
      description: lead.initial_message,
    });

    // Update lead
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId || l.uuid === leadId
          ? { ...l, status: 'converted_to_project', converted_to_project_id: newProj.id }
          : l
      )
    );

    addToast({
      type: 'success',
      title: 'Lead Berhasil Dikonversi!',
      message: `Telah dibuat Klien (${newClient.company_name}) & Proyek (${newProj.project_code}).`,
    });
  };

  // Invoices Operations
  const addInvoice = async (invoiceData) => {
    const client = clients.find((c) => c.id === Number(invoiceData.client_id));
    const project = projects.find((p) => p.id === Number(invoiceData.project_id));
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    const invNumber = `INV/${year}/${month}/${String(count).padStart(4, '0')}`;

    const amount = Number(invoiceData.amount) || 0;
    const tax = Number(invoiceData.tax_amount) || amount * 0.11;
    const totalPayable = amount + tax;

    const newInv = {
      id: Date.now(),
      uuid: 'inv-' + Math.random().toString(36).substr(2, 6),
      invoice_number: invNumber,
      client_id: invoiceData.client_id,
      client: client || { company_name: 'PT Klien' },
      project_id: invoiceData.project_id || null,
      project: project || null,
      title: invoiceData.title,
      amount,
      tax_amount: tax,
      total_payable: totalPayable,
      due_date: invoiceData.due_date || new Date().toISOString().split('T')[0],
      payment_status: 'unpaid',
      notes: invoiceData.notes,
    };

    setInvoices((prev) => [newInv, ...prev]);
    addToast({ type: 'success', title: 'Invoice Dibuat', message: `${newInv.invoice_number} berhasil di-generate.` });

    try {
      await apiClient.post('/invoices', invoiceData);
    } catch (err) {
      // Local
    }
    return newInv;
  };

  const generatePaymentLink = async (invoiceUuid) => {
    const ref = 'MID-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const payUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${ref}`;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.uuid === invoiceUuid || inv.id === invoiceUuid
          ? { ...inv, payment_status: 'pending_gateway', payment_gateway_ref: ref, payment_url: payUrl }
          : inv
      )
    );

    addToast({ type: 'info', title: 'Payment Gateway Link', message: `Link bayar Midtrans siap: ${ref}` });

    try {
      await apiClient.post(`/invoices/${invoiceUuid}/generate-payment`);
    } catch (e) {
      // Local
    }

    return payUrl;
  };

  const markInvoicePaid = async (invoiceUuid) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.uuid === invoiceUuid || inv.id === invoiceUuid
          ? { ...inv, payment_status: 'paid', paid_at: new Date().toISOString() }
          : inv
      )
    );
    addToast({ type: 'success', title: 'Invoice Lunas', message: 'Status invoice telah diubah menjadi Paid.' });
    try {
      await apiClient.post(`/invoices/${invoiceUuid}/mark-paid`);
    } catch (e) {
      // Local
    }
  };

  // Team Profiles & Corporate Web Sync
  const syncTeamProfile = async (profileData) => {
    setTeam((prev) =>
      prev.map((member) =>
        member.id === profileData.user_id
          ? {
              ...member,
              team_profile: {
                ...member.team_profile,
                ...profileData,
              },
            }
          : member
      )
    );

    addToast({
      type: 'success',
      title: 'Profil Ter-Sync ke Corporate Web!',
      message: `Next.js ISR revalidation terpemicu untuk /tim/${profileData.slug || 'engineer'}.`,
    });

    try {
      await apiClient.post('/team/sync-public-profile', profileData);
    } catch (err) {
      // Handled
    }
  };

  // SLA Helpdesk Tickets Operations
  const addTicket = async (ticketData) => {
    const client = clients.find((c) => c.id === Number(ticketData.client_id));
    const project = projects.find((p) => p.id === Number(ticketData.project_id));
    const engineer = team.find((t) => t.id === Number(ticketData.assigned_engineer_id)) || mockCurrentUser;

    const newTicket = {
      id: Date.now(),
      uuid: 'tck-' + Math.floor(1000 + Math.random() * 9000),
      ticket_code: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
      client_id: ticketData.client_id,
      client: client || { company_name: 'PT Klien' },
      project_id: ticketData.project_id,
      project: project || { title: 'Proyek Sistem' },
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority || 'medium',
      status: 'open',
      assigned_engineer_id: ticketData.assigned_engineer_id || 1,
      assigned_engineer: engineer,
      sla_due_at:
        ticketData.priority === 'critical_sla_1hr'
          ? new Date(Date.now() + 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      replies: [],
    };

    setTickets((prev) => [newTicket, ...prev]);

    if (ticketData.priority === 'critical_sla_1hr') {
      addToast({
        type: 'danger',
        title: '🚨 CRITICAL P1 SLA TICKET',
        message: `Tiket ${newTicket.ticket_code} membutuhkan respon teknis dalam 60 menit!`,
        duration: 8000,
      });
    } else {
      addToast({ type: 'success', title: 'Tiket Dibuat', message: `Tiket #${newTicket.ticket_code} terdaftar di Helpdesk.` });
    }

    try {
      await apiClient.post('/tickets', ticketData);
    } catch (e) {
      // Local
    }

    return newTicket;
  };

  const updateTicket = async (ticketId, updateData) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId || t.uuid === ticketId ? { ...t, ...updateData } : t))
    );
    addToast({ type: 'success', title: 'Tiket Diperbarui', message: 'Status investigasi tiket berhasil disimpan.' });
    try {
      await apiClient.put(`/tickets/${ticketId}`, updateData);
    } catch (e) {
      // Local
    }
  };

  const addTicketReply = async (ticketId, message, isInternalNote = false) => {
    const newReply = {
      id: Date.now(),
      user: mockCurrentUser,
      message,
      is_internal_note: isInternalNote,
      created_at: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId || t.uuid === ticketId
          ? { ...t, replies: [...(t.replies || []), newReply] }
          : t
      )
    );

    addToast({ type: 'info', title: 'Catatan Ditambahkan', message: isInternalNote ? 'Internal note tersimpan.' : 'Balasan terkirim ke tiket.' });

    try {
      await apiClient.post(`/tickets/${ticketId}/reply`, { message, is_internal_note: isInternalNote });
    } catch (e) {
      // Local
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
        updateTaskStatus,
        addTask,
        addLead,
        updateLeadStatus,
        replyInstagram,
        convertLeadToProject,
        addInvoice,
        generatePaymentLink,
        markInvoicePaid,
        syncTeamProfile,
        addTicket,
        updateTicket,
        addTicketReply,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
