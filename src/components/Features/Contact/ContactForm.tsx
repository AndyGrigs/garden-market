import { IContactForm } from '@/types/IContactForm';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSendContactMessageMutation } from '@/store/api/contactApi';
import toast from 'react-hot-toast';

interface ContactFormProps {
  onSubmit?: (form: IContactForm) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<IContactForm>({
    name: '',
    email: '',
    message: '',
  });
  
  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await sendContactMessage(form).unwrap();
      toast.success(t('contact.success'));
      
      // Reset form after successful submission
      setForm({ name: '', email: '', message: '' });
      
      // Call parent onSubmit if provided
      if (onSubmit) {
        onSubmit(form);
      }
    } catch (error) {
      console.error('Failed to send contact message:', error);
      toast.error(t('common.error'));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('contact.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">
            {t('contact.name')}
          </label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            {t('contact.email')}
          </label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700 mb-2">
            {t('contact.message')}
          </label>
          <textarea
            id="message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50"
        >
          {isLoading ? t('common.submitting') : t('contact.send')}
        </button>
      </form>
    </div>
  );
}