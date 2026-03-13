import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../../store/api/authApi';
import { useTranslation } from 'react-i18next';
import { ErrorResponse } from '../../../types/IUser';
import toast from 'react-hot-toast';

export function useRegister() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [sellerInfo, setSellerInfo] = useState({
    nurseryName: '',
    address: '',
    phoneNumber: '',
    businessLicense: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { t, i18n } = useTranslation();

  const detectedLanguage = i18n.language || navigator.language.split('-')[0] || 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (role === 'seller') {
      if (!sellerInfo.nurseryName.trim()) {
        setError(t('verification.nursery'));
        toast.error(t('verification.nursery'));
        return;
      }
      if (!sellerInfo.phoneNumber.trim()) {
        setError(t('verification.sellerPhone'));
        toast.error(t('verification.sellerPhone'));
        return;
      }
    }

    if (!termsAccepted) {
      setError(t('verification.sellerAccept'));
      toast.error(t('verification.sellerAccept'));
      return;
    }

    try {
      const registerData = {
        fullName,
        email,
        password,
        language: detectedLanguage,
        role,
        termsAccepted,
        ...(role === 'seller' && { sellerInfo }),
      };
      const result = await register(registerData).unwrap();

      setSuccess(result.message);
      toast.success(result.message);
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      }, 4000);
    } catch (err: ErrorResponse | unknown) {
      const errorMsg = (err as ErrorResponse)?.data?.message || t('auth.register.error');
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return {
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    role, setRole,
    sellerInfo, setSellerInfo,
    error,
    success,
    termsAccepted, setTermsAccepted,
    showTermsModal, setShowTermsModal,
    isLoading,
    handleSubmit,
  };
}
