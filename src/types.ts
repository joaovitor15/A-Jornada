/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profile {
  id: string;
  name: string;
  avatarUrl?: string;
  color: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  profileId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export type CofreType = 'reserva' | 'provisao' | 'meta';
export type ProvisaoPaymentType = 'mensal' | 'anual' | 'unico';

export interface Cofre {
  id: string;
  profile_id: string;
  name: string;
  local: string;
  type: CofreType;
  saldo_atual: number;
  objetivo_total: number;
  // Provisoes specific fields
  provisao_payment_type?: ProvisaoPaymentType;
  provisao_falta_ciclo?: number;
  provisao_ja_utilizado?: number;
  provisao_utilizado_ciclos?: number;
  provisao_total_ciclos?: number;
  provisao_vencimento?: string;
  created_at?: string;
}

export type Page = 'dashboard' | 'transactions' | 'profiles' | 'reports' | 'settings' | 'categories' | 'recorrentes' | 'relatorios' | 'cartoes' | 'investimentos' | 'investimentos_ativos' | 'investimentos_cofres';
