"use client";

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;

export type WishlistClaimRow = {
  id: string;
  item_id: string;
  name: string;
  email: string;
  phone: string;
  anonymous: boolean;
  gifted: boolean;
  created_at: string;
};

export type WishlistReserveRow = {
  id: string;
  item_id: string;
  name: string;
  email: string;
  phone: string;
  anonymous: boolean;
  created_at: string;
};

export type WishlistContributionRow = {
  id: string;
  item_id: string;
  name: string;
  email: string;
  phone: string;
  anonymous: boolean;
  amount: number;
  paid: boolean;
  reference: string;
  created_at: string;
};