import API from './api';
const unwrap = (d) => d?.message ?? d ?? null;

export const questionnaireService = {
  create: async ({ supplierId, title, questions, dueDate }) => {
    const { data } = await API.post('/method/farmportal.api.questionnaires.create_questionnaire', {
      supplier_id: supplierId,
      title,
      questions,     // [{ question, input_type: 'Radio'|'Text', options?: ['Yes','No'], required?: 1 }]
      due_date: dueDate,
    });
    return unwrap(data);
  },

  listForMe: async (status) => {
    const { data } = await API.get('/method/farmportal.api.questionnaires.list_for_me', {
      params: status ? { status } : {},
    });
    const un = unwrap(data) || {};
    return { items: un.items || [], role: un.role ?? null };
  },

  getOne: async (id) => {
    const { data } = await API.get('/method/farmportal.api.questionnaires.get_one', {
      params: { q_id: id },
    });
    return unwrap(data); // { id, title, questions:[{rowname, question, input_type, options[], required, answer}], ... }
  },

  submitAnswers: async ({ id, answers, message, action }) => {
    const { data } = await API.post('/method/farmportal.api.questionnaires.submit_answers', {
      q_id: id,
      answers, // { [rowname]: value }
      message,
      action,
    });
    return unwrap(data);
  },
};
