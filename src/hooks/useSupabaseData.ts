import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Department, Ward, Complaint, RootCause, ActionPlan, Report } from '../lib/supabase';

export function useSupabaseData() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [rootCauses, setRootCauses] = useState<RootCause[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [depts, wrds, compls, rcs, aps, reps] = await Promise.all([
        supabase.from('departments').select('*'),
        supabase.from('wards').select('*').order('number'),
        supabase.from('complaints').select('*').order('created_at', { ascending: false }),
        supabase.from('root_causes').select('*').order('confidence', { ascending: false }),
        supabase.from('action_plans').select('*').order('priority_score', { ascending: false }),
        supabase.from('reports').select('*').order('created_at', { ascending: false }),
      ]);

      setDepartments(depts.data || []);
      setWards(wrds.data || []);
      setComplaints(compls.data || []);
      setRootCauses(rcs.data || []);
      setActionPlans(aps.data || []);
      setReports(reps.data || []);
      setLoading(false);
    }
    load();
  }, []);

  return { departments, wards, complaints, rootCauses, actionPlans, reports, loading };
}
