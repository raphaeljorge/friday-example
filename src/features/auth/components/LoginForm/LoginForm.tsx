import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../../types/loginSchema';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Add validation on blur
  });

  const handleSubmitForm = (data: LoginFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={styles.formControl}
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={styles.formControl}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="rememberMe">Remember Me</label>
        <input
          type="checkbox"
          id="rememberMe"
          {...register('rememberMe')}
          className={styles.formCheckInput}
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Login
      </button>
    </form>
  );
};
